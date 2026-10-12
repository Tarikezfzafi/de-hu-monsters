"use client";

import { useActionState, useState } from "react";
import { registerUser, type RegisterState } from "../actions";
import { FormField } from "./FormField";
import { PasswordField } from "./PasswordField";

const initialState: RegisterState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerUser, initialState);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <>
      <form action={formAction} className="mt-[26px] flex flex-col gap-[18px]">
        <FormField
          label="Volledige naam"
          name="fullName"
          placeholder="Voor- en achternaam"
          autoComplete="name"
          error={state.errors?.fullName?.[0]}
        />

        <FormField
          label="E-mailadres"
          name="email"
          type="email"
          placeholder="jij@domain.hu.nl"
          autoComplete="email"
          error={state.errors?.email?.[0]}
        />

        <PasswordField
          label="Wachtwoord"
          name="password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Minimaal 12 tekens"
          error={state.errors?.password?.[0]}
        />

        <PasswordField
          label="Wachtwoord herhalen"
          name="confirmPassword"
          placeholder="••••••••"
          autoComplete="new-password"
          error={state.errors?.confirmPassword?.[0]}
        />

        <label className="flex items-start gap-2 pt-5 text-xs text-hubi-ink">
          <input
            type="checkbox"
            name="acceptTerms"
            className="grid size-[18px] shrink-0 appearance-none place-content-center rounded-[4px] border-[1.5px] border-hubi-ink before:hidden before:text-xs before:leading-none before:text-white before:content-['✓'] checked:bg-hubi-ink checked:before:block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
          />

          <span>
            Ik ga akkoord met de gebruiksvoorwaarden en het{" "}
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="underline hover:text-hubi-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
            >
              privacybeleid
            </button>
          </span>
        </label>
        
        {state.errors?.acceptTerms && (
          <p className="text-[11px] text-red-600">{state.errors.acceptTerms[0]}</p>
        )}

        {state.message && (
          <p role="alert" className="text-sm text-red-600">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-[18px] h-[46px] w-full rounded-[10px] bg-hubi-ink text-[15px] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link disabled:cursor-not-allowed disabled:opacity-60 lg:h-[50px] lg:text-base"
        >
          {pending ? "Bezig..." : "Account aanmaken →"}
        </button>
      </form>

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-[12px] bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h2 className="text-xl font-semibold text-hubi-ink">Privacybeleid HUBI</h2>
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-gray-500 transition-colors hover:text-hubi-ink"
                aria-label="Sluiten"
              >
                ✕
              </button>
            </div>
            
            <div className="max-h-[60vh] space-y-5 overflow-y-auto pr-2 text-sm text-gray-700">
              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">1. Wie zijn wij?</h3>
                <p>HUBI is een platform beheerd door de Open ICT projectgroep HU monsters. Wij zijn verantwoordelijk voor de verwerking van jouw persoonsgegevens zoals beschreven in dit document.</p>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">2. Welke gegevens verzamelen we?</h3>
                <p>Wanneer je een account aanmaakt en ons platform gebruikt, verwerken wij de volgende gegevens:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li><strong>Volledige naam:</strong> Om je persoonlijk aan te kunnen spreken in de applicatie.</li>
                  <li><strong>E-mailadres:</strong> Je e-mailadres wordt gebruikt als je inlognaam en voor essentiële accountcommunicatie (zoals wachtwoordherstel).</li>
                  <li><strong>Wachtwoord:</strong> Dit wordt direct versleuteld (gehasht) opgeslagen. Wij kunnen jouw originele wachtwoord nooit inzien.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">3. Waarom verzamelen we deze gegevens?</h3>
                <p>Wij verzamelen jouw gegevens uitsluitend voor de volgende doelen:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Het aanmaken en beheren van je account.</li>
                  <li>Het beveiligen van de applicatie tegen misbruik of ongeautoriseerde toegang.</li>
                  <li>Het leveren van de functionaliteiten binnen HUBI.</li>
                </ul>
                <p className="mt-2">De juridische grondslag hiervoor is de uitvoering van de overeenkomst (je wilt de app gebruiken en daarvoor hebben we een account nodig) en jouw uitdrukkelijke toestemming bij het registreren.</p>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">4. Hoe lang bewaren we je gegevens?</h3>
                <p>We bewaren je gegevens niet langer dan strikt noodzakelijk.</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Zolang je account actief is, blijven je gegevens behouden.</li>
                  <li>Verwijder je jouw account? Dan worden je naam, e-mailadres en gekoppelde data direct uit onze actieve databases verwijderd.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">5. Delen we gegevens met derden?</h3>
                <p>Wij verkopen jouw gegevens nooit aan derden. Wel maken we gebruik van externe IT-infrastructuur om deze applicatie te draaien. Jouw gegevens worden opgeslagen op de beveiligde servers van onze hosting en databasepartners (bijvoorbeeld Supabase).</p>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">6. Hoe beveiligen we je gegevens?</h3>
                <p>Wij nemen passende technische maatregelen om misbruik, verlies of onbevoegde toegang tegen te gaan:</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Al het dataverkeer tussen jouw browser en onze servers is beveiligd (HTTPS/SSL).</li>
                  <li>Gegevens worden opgeslagen in afgeschermde database-omgevingen.</li>
                </ul>
              </section>

              <section>
                <h3 className="mb-1 font-semibold text-hubi-ink">7. Jouw rechten</h3>
                <p>Volgens de AVG heb je altijd de controle over je eigen gegevens. Je hebt het recht om:</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li><strong>Inzage te krijgen:</strong> Je mag opvragen welke gegevens wij exact van jou hebben.</li>
                  <li><strong>Te corrigeren:</strong> Klopt er iets niet? Dan passen we het aan.</li>
                  <li><strong>Te verwijderen (recht om vergeten te worden):</strong> Je kunt op elk moment vragen om je account en alle bijbehorende data te wissen.</li>
                  <li><strong>Je toestemming in te trekken:</strong> Indien een verwerking louter op toestemming is gebaseerd.</li>
                </ol>
              </section>
            </div>

            <div className="mt-6 border-t pt-4">
              <button
                type="button"
                onClick={() => setIsPrivacyModalOpen(false)}
                className="h-[46px] w-full rounded-[10px] bg-hubi-ink font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link"
              >
                Ik begrijp het, sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}