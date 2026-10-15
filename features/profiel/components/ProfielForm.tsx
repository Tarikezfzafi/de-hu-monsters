"use client";

import { useActionState } from "react";
import { saveProfile, type ProfielState } from "../actions";
import { AvatarUpload } from "./AvatarUpload";
import { ChipGroup } from "./ChipGroup";
import { TRIBES } from "../tribes";

const initialState: ProfielState = {};

type Profiel = {
  tribe: string | null;
  skills_heb: string[];
  skills_leer: string[];
  hobbys: string[];
  avatar_url: string | null;
} | null;

type ProfielFormProps = {
  naam: string;
  profiel: Profiel;
};

export function ProfielForm({ naam, profiel }: ProfielFormProps) {
  const [state, formAction, pending] = useActionState(saveProfile, initialState);

  return (
    <>
      <header>
        {/* Naam van de gebruiker i.p.v. "Jouw profiel" */}
        <h1 className="mt-1 text-[26px] font-bold lg:text-[28px]">
          {naam}
        </h1>
        <p className="mt-1 text-[13px] text-hubi-muted lg:mt-2 lg:text-sm">
          Zo weten andere tribe-leden wie je bent
        </p>
      </header>

      <form action={formAction} className="mt-[26px] flex flex-col gap-[26px]">
        <div className="flex items-center gap-6 lg:gap-10">
          <AvatarUpload huidig={profiel?.avatar_url ?? null} error={state.errors?.foto?.[0]} />

          {/* Zelfde opmaak als FormField, maar dan een select */}
          <div className="flex-1">
            <label
              htmlFor="tribe"
              className="block text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted"
            >
              Tribe
            </label>
            <select
              id="tribe"
              name="tribe"
              defaultValue={profiel?.tribe ?? ""}
              aria-invalid={!!state.errors?.tribe}
              className="mt-0.5 block w-full appearance-none rounded-none border-0 border-b-2 border-hubi-ink bg-transparent pb-1.5 text-sm text-hubi-ink outline-none focus-visible:border-hubi-link lg:text-[15px]"
            >
              <option value="" disabled>Kies je tribe...</option>
              {TRIBES.map((tribe) => (
                <option key={tribe} value={tribe}>{tribe}</option>
              ))}
            </select>
            {state.errors?.tribe && (
              <p className="mt-1.5 text-[11px] text-red-600">{state.errors.tribe[0]}</p>
            )}
          </div>
        </div>

        <ChipGroup
          titel="Skills die je al hebt"
          name="skillsHeb"
          opties={["Python", "Linux", "Figma"]}
          gekozen={profiel?.skills_heb ?? []}
        />
        <ChipGroup
          titel="Skills die je wilt leren"
          name="skillsLeer"
          opties={["Networking", "UX Research"]}
          gekozen={profiel?.skills_leer ?? []}
        />
        <ChipGroup
          titel="Hobby's"
          name="hobbys"
          opties={["Gaming", "Fotografie", "Anime"]}
          gekozen={profiel?.hobbys ?? []}
        />

        {state.message && (
          <p role="alert" className="text-sm text-red-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
        >
          {pending ? "Bezig..." : "Profiel opslaan →"}
        </button>
      </form>
    </>
  );
}
