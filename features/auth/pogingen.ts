import { cookies } from "next/headers";

// Na te veel mislukte inlogpogingen kan je een tijd niet meer inloggen.
// De teller staat in een cookie (httpOnly). Wie zijn cookies wist, begint opnieuw:
// dit is een eenvoudige beveiliging zonder database.
export const MAX_POGINGEN = 5;
export const TIMEOUT_MINUTEN = 15;

const COOKIE = "login_pogingen";

type Teller = {
  aantal: number;
  // Tijdstip (ms) waarop de blokkade eindigt
  tot?: number;
};

async function leesTeller(): Promise<Teller> {
  const waarde = (await cookies()).get(COOKIE)?.value;
  if (!waarde) return { aantal: 0 };

  try {
    const { aantal, tot } = JSON.parse(waarde);
    if (Number.isInteger(aantal) && aantal >= 0) {
      return { aantal, tot: typeof tot === "number" ? tot : undefined };
    }
  } catch {
    // Kapotte cookie: opnieuw beginnen
  }
  return { aantal: 0 };
}

// Tijdstip (ms) tot wanneer inloggen geblokkeerd is, of null als dat niet zo is
export async function blokkadeTot(): Promise<number | null> {
  const { tot } = await leesTeller();
  return tot && tot > Date.now() ? tot : null;
}

// Telt een mislukte poging. Geeft het einde van de blokkade terug als die nu ingaat.
export async function registreerMislukteLogin(): Promise<number | null> {
  const { aantal, tot } = await leesTeller();

  // Een verlopen blokkade telt niet meer mee
  const aantalNu = tot && tot <= Date.now() ? 0 : aantal;
  const nieuwAantal = aantalNu + 1;
  const geblokkeerdTot =
    nieuwAantal >= MAX_POGINGEN ? Date.now() + TIMEOUT_MINUTEN * 60 * 1000 : undefined;

  (await cookies()).set(
    COOKIE,
    JSON.stringify({ aantal: nieuwAantal, tot: geblokkeerdTot }),
    {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: TIMEOUT_MINUTEN * 60,
    }
  );

  return geblokkeerdTot ?? null;
}

export async function wisPogingen() {
  (await cookies()).delete(COOKIE);
}

// Tekst voor de melding, met de resterende tijd naar boven afgerond in minuten
export function blokkadeMelding(tot: number) {
  const minuten = Math.max(1, Math.ceil((tot - Date.now()) / 60000));
  return `Te veel mislukte pogingen. Probeer het over ${minuten} ${
    minuten === 1 ? "minuut" : "minuten"
  } opnieuw.`;
}
