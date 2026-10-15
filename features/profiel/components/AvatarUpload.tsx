"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";

type AvatarUploadProps = {
  huidig: string | null;
  error?: string;
};

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}

export function AvatarUpload({ huidig, error }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState(huidig);
  const [verwijderd, setVerwijderd] = useState(false);

  // Toont de gekozen foto direct, nog voordat er opgeslagen is
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setVerwijderd(false);
    }
  }

  // Haalt de preview weg en leegt de bestandskiezer, zodat er geen foto meegestuurd wordt
  function handleVerwijder() {
    setPreview(null);
    setVerwijderd(true);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Profielfoto kiezen"
          className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-hubi-line text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:size-32"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- blob-preview werkt niet met next/image
            <img src={preview} alt="" className="size-full object-cover" />
          ) : (
            "Foto +"
          )}
        </button>

        {preview && (
          <button
            type="button"
            onClick={handleVerwijder}
            aria-label="Profielfoto verwijderen"
            className="absolute right-0 bottom-0 flex size-8 items-center justify-center rounded-full border-2 border-background bg-hubi-ink text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:right-1 lg:bottom-1"
          >
            <TrashIcon />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        name="foto"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      {/* Alleen meesturen als de gebruiker op de prullenbak heeft geklikt */}
      {verwijderd && <input type="hidden" name="verwijderFoto" value="1" />}

      {error && <p className="mt-1.5 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}