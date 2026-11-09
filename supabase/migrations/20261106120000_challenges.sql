-- Challenges: tabellen, beveiliging, functies en eerste sjablonen.
--
-- Uitvoeren: Supabase > SQL Editor > plakken > Run. Veilig om opnieuw uit te voeren.
-- Test het liefst eerst op een kopie van het project.
--
-- Wat de app verwacht (zie features/challenges):
--   challenge_mijn_punten()   -> punten van de ingelogde gebruiker
--   challenge_accepteer(id)   -> voorstel wordt "bezig"
--   challenge_weiger(id)      -> -1 punt en een nieuw voorstel (in een keer)
-- De hoogte van de straf staat hieronder in challenge_weiger; houd hem gelijk aan
-- STRAFPUNTEN_BIJ_WEIGEREN in features/challenges/regels.ts.

-- 1. Matches (minimaal; de matching zelf is een taak van het team dat Ontdek bouwt)
create table if not exists public.matches (
  id uuid primary key default gen_random_uuid(),
  user_a uuid not null references auth.users (id) on delete cascade,
  user_b uuid not null references auth.users (id) on delete cascade,
  status text not null default 'aangevraagd' check (status in ('aangevraagd', 'gematcht')),
  created_at timestamptz not null default now(),
  check (user_a <> user_b)
);

create unique index if not exists matches_uniek_paar
  on public.matches (least(user_a, user_b), greatest(user_a, user_b));

-- 2. Sjablonen: het aanbod aan challenges, met labels voor skills en hobby's
create table if not exists public.challenge_templates (
  id uuid primary key default gen_random_uuid(),
  titel text not null,
  beschrijving text not null,
  xp integer not null check (xp > 0),
  soort text not null default 'Team challenge',
  labels text[] not null default '{}',
  actief boolean not null default true
);

-- 3. Challenges van een match
create table if not exists public.match_challenges (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references public.matches (id) on delete cascade,
  template_id uuid not null references public.challenge_templates (id),
  status text not null default 'voorgesteld'
    check (status in ('voorgesteld', 'bezig', 'afgewezen', 'ingediend', 'goedgekeurd', 'afgekeurd')),
  -- XP wordt bij het voorstel vastgelegd, zodat het aanpassen van een sjabloon oude challenges niet verandert
  xp integer not null check (xp > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists match_challenges_match_idx on public.match_challenges (match_id);

-- Per match hoogstens een open voorstel
create unique index if not exists match_challenges_een_voorstel
  on public.match_challenges (match_id) where status = 'voorgesteld';

-- 4. Punten per gebruiker
create table if not exists public.user_punten (
  user_id uuid primary key references auth.users (id) on delete cascade,
  punten integer not null default 3 check (punten >= 0)
);

-- 5. Beveiliging: gebruikers lezen alleen hun eigen gegevens; schrijven gaat via de functies hieronder
alter table public.matches enable row level security;
alter table public.challenge_templates enable row level security;
alter table public.match_challenges enable row level security;
alter table public.user_punten enable row level security;

revoke insert, update, delete on public.challenge_templates from anon, authenticated;
revoke insert, update, delete on public.match_challenges from anon, authenticated;
revoke insert, update, delete on public.user_punten from anon, authenticated;

drop policy if exists "matches: eigen matches lezen" on public.matches;
create policy "matches: eigen matches lezen" on public.matches
  for select to authenticated
  using (auth.uid() in (user_a, user_b));

drop policy if exists "matches: zelf aanvragen" on public.matches;
create policy "matches: zelf aanvragen" on public.matches
  for insert to authenticated
  with check (auth.uid() = user_a and status = 'aangevraagd');

-- Sjablonen zijn niet geheim; ook uitgezette sjablonen blijven leesbaar voor oude challenges
drop policy if exists "templates: lezen" on public.challenge_templates;
create policy "templates: lezen" on public.challenge_templates
  for select to authenticated
  using (true);

drop policy if exists "match_challenges: eigen lezen" on public.match_challenges;
create policy "match_challenges: eigen lezen" on public.match_challenges
  for select to authenticated
  using (exists (
    select 1 from public.matches m
    where m.id = match_challenges.match_id and auth.uid() in (m.user_a, m.user_b)
  ));

drop policy if exists "user_punten: eigen lezen" on public.user_punten;
create policy "user_punten: eigen lezen" on public.user_punten
  for select to authenticated
  using (user_id = auth.uid());

-- 6. Hulpfuncties
-- Maakt van een lijst skills of hobby's een lijst in kleine letters zonder spaties of dubbelen.
-- Werkt voor kolommen van het type text[] en jsonb.
create or replace function public.challenge_norm(p text[])
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(distinct lower(btrim(x))) filter (where btrim(x) <> ''), '{}'::text[])
  from unnest(p) as x
$$;

create or replace function public.challenge_norm(p jsonb)
returns text[]
language sql
immutable
as $$
  select public.challenge_norm(
    coalesce(
      array(select jsonb_array_elements_text(case when jsonb_typeof(p) = 'array' then p else '[]'::jsonb end)),
      '{}'::text[]
    )
  )
$$;

-- Kiest een sjabloon op basis van wat de twee gebruikers gemeen hebben:
--   3 punten per label dat de een heeft en de ander wil leren,
--   2 punten per label dat ze delen (skill of hobby),
--   een algemeen sjabloon (zonder labels) als er niets overeenkomt.
-- Sjablonen die deze match al had, komen niet opnieuw. Bij gelijke score beslist het toeval.
create or replace function public.challenge_kies_template(p_match_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  m public.matches%rowtype;
  a_heeft text[]; a_leert text[]; a_hobby text[];
  b_heeft text[]; b_leert text[]; b_hobby text[];
  leren text[];
  gedeeld text[];
  gekozen uuid;
begin
  select * into m from public.matches where id = p_match_id;
  if not found then
    raise exception 'match_niet_gevonden';
  end if;

  select challenge_norm(skills_heb), challenge_norm(skills_leer), challenge_norm(hobbys)
    into a_heeft, a_leert, a_hobby
    from public.profiles where id = m.user_a;
  select challenge_norm(skills_heb), challenge_norm(skills_leer), challenge_norm(hobbys)
    into b_heeft, b_leert, b_hobby
    from public.profiles where id = m.user_b;

  a_heeft := coalesce(a_heeft, '{}'); a_leert := coalesce(a_leert, '{}'); a_hobby := coalesce(a_hobby, '{}');
  b_heeft := coalesce(b_heeft, '{}'); b_leert := coalesce(b_leert, '{}'); b_hobby := coalesce(b_hobby, '{}');

  leren := array(
    (select unnest(a_heeft) intersect select unnest(b_leert))
    union
    (select unnest(b_heeft) intersect select unnest(a_leert))
  );
  gedeeld := array(
    select unnest(a_heeft || a_leert || a_hobby)
    intersect
    select unnest(b_heeft || b_leert || b_hobby)
  );

  select t.id into gekozen
  from public.challenge_templates t
  where t.actief
    and not exists (
      select 1 from public.match_challenges mc
      where mc.match_id = p_match_id and mc.template_id = t.id
    )
  order by
    3 * cardinality(array(select unnest(challenge_norm(t.labels)) intersect select unnest(leren)))
    + 2 * cardinality(array(select unnest(challenge_norm(t.labels)) intersect select unnest(gedeeld))) desc,
    -- Zonder overeenkomst gaat de voorkeur naar een algemeen sjabloon (zonder labels)
    (cardinality(t.labels) = 0) desc,
    random()
  limit 1;

  if gekozen is null then
    raise exception 'geen_challenges_meer';
  end if;

  return gekozen;
end;
$$;

-- Maakt een nieuw voorstel voor een match
create or replace function public.challenge_maak_voorstel(p_match_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  gekozen uuid;
  nieuw uuid;
  template_xp integer;
begin
  gekozen := public.challenge_kies_template(p_match_id);
  select xp into template_xp from public.challenge_templates where id = gekozen;

  insert into public.match_challenges (match_id, template_id, xp)
  values (p_match_id, gekozen, template_xp)
  returning id into nieuw;

  return nieuw;
end;
$$;

-- Zodra een match "gematcht" is, krijgt hij zijn eerste voorstel.
-- Lukt dat niet (bijvoorbeeld geen sjablonen), dan blijft de match gewoon bestaan.
create or replace function public.challenge_na_match()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'gematcht' and (tg_op = 'INSERT' or old.status is distinct from 'gematcht') then
    begin
      perform public.challenge_maak_voorstel(new.id);
    exception when raise_exception then
      raise warning 'Geen voorstel gemaakt voor match %: %', new.id, sqlerrm;
    end;
  end if;
  return new;
end;
$$;

drop trigger if exists challenge_na_match on public.matches;
create trigger challenge_na_match
  after insert or update of status on public.matches
  for each row execute function public.challenge_na_match();

-- 7. Functies die de app aanroept
create or replace function public.challenge_mijn_punten()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  ik uuid := auth.uid();
  huidig integer;
begin
  if ik is null then
    return null;
  end if;

  insert into public.user_punten (user_id) values (ik) on conflict do nothing;
  select punten into huidig from public.user_punten where user_id = ik;
  return huidig;
end;
$$;

create or replace function public.challenge_accepteer(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  huidige public.match_challenges%rowtype;
begin
  select mc.* into huidige
  from public.match_challenges mc
  join public.matches m on m.id = mc.match_id
  where mc.id = p_id and auth.uid() in (m.user_a, m.user_b)
  for update of mc;

  if not found then
    raise exception 'niet_gevonden';
  end if;
  if huidige.status <> 'voorgesteld' then
    raise exception 'niet_meer_open';
  end if;

  update public.match_challenges set status = 'bezig', updated_at = now() where id = p_id;
end;
$$;

-- Weigeren kost 1 punt en geeft een nieuw voorstel. Alles gebeurt in een keer:
-- lukt het nieuwe voorstel niet, dan blijft het punt staan.
create or replace function public.challenge_weiger(p_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  strafpunten constant integer := 1;
  ik uuid := auth.uid();
  huidige public.match_challenges%rowtype;
  saldo integer;
  nieuw uuid;
begin
  if ik is null then
    raise exception 'niet_ingelogd';
  end if;

  select mc.* into huidige
  from public.match_challenges mc
  join public.matches m on m.id = mc.match_id
  where mc.id = p_id and ik in (m.user_a, m.user_b)
  for update of mc;

  if not found then
    raise exception 'niet_gevonden';
  end if;
  if huidige.status <> 'voorgesteld' then
    raise exception 'niet_meer_open';
  end if;

  insert into public.user_punten (user_id) values (ik) on conflict do nothing;
  select punten into saldo from public.user_punten where user_id = ik for update;

  if saldo < strafpunten then
    raise exception 'onvoldoende_punten';
  end if;

  update public.user_punten set punten = punten - strafpunten where user_id = ik;
  update public.match_challenges set status = 'afgewezen', updated_at = now() where id = p_id;

  nieuw := public.challenge_maak_voorstel(huidige.match_id);

  return jsonb_build_object('punten', saldo - strafpunten, 'nieuw_id', nieuw);
end;
$$;

-- 8. Rechten: alleen ingelogde gebruikers mogen de functies voor de app aanroepen
revoke all on function public.challenge_norm(text[]) from public, anon, authenticated;
revoke all on function public.challenge_norm(jsonb) from public, anon, authenticated;
revoke all on function public.challenge_kies_template(uuid) from public, anon, authenticated;
revoke all on function public.challenge_maak_voorstel(uuid) from public, anon, authenticated;
revoke all on function public.challenge_na_match() from public, anon, authenticated;
revoke all on function public.challenge_mijn_punten() from public, anon, authenticated;
revoke all on function public.challenge_accepteer(uuid) from public, anon, authenticated;
revoke all on function public.challenge_weiger(uuid) from public, anon, authenticated;

grant execute on function public.challenge_mijn_punten() to authenticated;
grant execute on function public.challenge_accepteer(uuid) to authenticated;
grant execute on function public.challenge_weiger(uuid) to authenticated;

-- 9. Eerste sjablonen. Voorbeelden: het team past de teksten en labels aan.
-- Labels zijn skills of hobby's zoals gebruikers ze invullen (hoofdletters maken niet uit).
insert into public.challenge_templates (titel, beschrijving, xp, soort, labels)
select v.titel, v.beschrijving, v.xp, 'Team challenge', v.labels
from (values
  ('Linux Challenge', 'Los samen een Linux-probleem op en laat zien wat je kunt.', 50, array['linux']),
  ('Python Challenge', 'Schrijf samen een klein Python-script dat een echt probleem oplost.', 40, array['python']),
  ('Git Challenge', 'Werk samen in één repository en los een merge-conflict op.', 40, array['git']),
  ('Networking Challenge', 'Zet samen een klein netwerk op met drie apparaten en laat zien dat ze elkaar zien.', 50, array['networking', 'netwerk']),
  ('Design Challenge', 'Ontwerp samen in Figma één scherm en leg uit waarom je deze keuzes maakte.', 40, array['figma', 'ux research', 'design']),
  ('Fotografie Challenge', 'Maak samen een foto-serie van drie plekken op de campus en kies de beste.', 30, array['fotografie']),
  ('Gaming Challenge', 'Speel samen een korte game en bedenk een eigen regel om het moeilijker te maken.', 30, array['gaming', 'games']),
  ('Muziek Challenge', 'Kies samen een nummer en schrijf op wat jullie er allebei aan vinden.', 30, array['muziek']),
  ('Reis Challenge', 'Plan samen een dagtrip in Nederland met een budget van 25 euro.', 30, array['reizen']),
  ('Kook Challenge', 'Kook samen een gerecht met hoogstens vijf ingrediënten en deel een foto.', 30, array['koken']),
  ('Fitness Challenge', 'Bedenk samen een training van 20 minuten die je op de campus kunt doen.', 30, array['fitness', 'sport']),
  ('Kennismaking Challenge', 'Vertel elkaar over je favoriete project en geef elkaar een tip.', 20, '{}'::text[]),
  ('Koffie Challenge', 'Drink samen een kop koffie of thee en stel elkaar drie vragen die je nog niet wist.', 20, '{}'::text[])
) as v(titel, beschrijving, xp, labels)
where not exists (select 1 from public.challenge_templates);
