"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, PointerEvent } from "react";

type AvatarUploadProps = {
  huidig: string | null;
  error?: string;
};

type DragState = {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
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
  const cropAreaRef = useRef<HTMLDivElement>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const savedFileRef = useRef<File | null>(null);
  const [preview, setPreview] = useState(huidig);
  const [verwijderd, setVerwijderd] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [cropBaseSize, setCropBaseSize] = useState({ width: 0, height: 0 });
  const [cropScale, setCropScale] = useState(1);
  const [cropOffset, setCropOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<DragState | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const cropWidth = cropBaseSize.width * cropScale;
  const cropHeight = cropBaseSize.height * cropScale;
  const cropLeft = (220 - cropWidth) / 2 + cropOffset.x;
  const cropTop = (220 - cropHeight) / 2 + cropOffset.y;

  function restoreSavedFile() {
    if (!inputRef.current) return;

    if (savedFileRef.current) {
      const transfer = new DataTransfer();
      transfer.items.add(savedFileRef.current);
      inputRef.current.files = transfer.files;
    } else {
      inputRef.current.value = "";
    }
  }

  function closePhotoEditor(clearFile = true, clearError = true) {
    setPendingImage(null);
    if (clearError) setPhotoError(null);
    setDragStart(null);
    if (clearFile) restoreSavedFile();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      closePhotoEditor(true, false);
      setPhotoError("Kies een geldig afbeeldingsbestand.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : null;
      if (!result) {
        closePhotoEditor(true, false);
        setPhotoError("De foto kon niet worden geladen. Probeer een andere afbeelding.");
        return;
      }

      setPendingImage(result);
      setPhotoError(null);
    };
    reader.onerror = () => {
      closePhotoEditor(true, false);
      setPhotoError("De foto kon niet worden gelezen. Probeer het opnieuw.");
    };
    reader.readAsDataURL(file);
  }

  function handleCropImageLoad() {
    if (!cropImageRef.current || !cropAreaRef.current) return;

    const image = cropImageRef.current;
    const area = cropAreaRef.current;
    const coverScale = Math.max(
      area.clientWidth / image.naturalWidth,
      area.clientHeight / image.naturalHeight,
    );

    setCropBaseSize({
      width: image.naturalWidth * coverScale,
      height: image.naturalHeight * coverScale,
    });
    setCropScale(1);
    setCropOffset({ x: 0, y: 0 });
  }

  function handleZoomChange(value: number) {
    const maxOffsetX = Math.max(0, (cropBaseSize.width * value - 220) / 2);
    const maxOffsetY = Math.max(0, (cropBaseSize.height * value - 220) / 2);

    setCropScale(value);
    setCropOffset((current) => ({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, current.x)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, current.y)),
    }));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    setDragStart({
      x: event.clientX,
      y: event.clientY,
      offsetX: cropOffset.x,
      offsetY: cropOffset.y,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragStart || !cropAreaRef.current) return;

    const maxOffsetX = Math.max(0, (cropWidth - cropAreaRef.current.clientWidth) / 2);
    const maxOffsetY = Math.max(0, (cropHeight - cropAreaRef.current.clientHeight) / 2);
    const nextX = dragStart.offsetX + event.clientX - dragStart.x;
    const nextY = dragStart.offsetY + event.clientY - dragStart.y;

    setCropOffset({
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY)),
    });
  }

  async function saveEditedPhoto() {
    if (!cropImageRef.current || !cropAreaRef.current || !inputRef.current) return;

    try {
      const outputSize = 320;
      const areaSize = cropAreaRef.current.clientWidth;
      const outputScale = outputSize / areaSize;
      const canvas = document.createElement("canvas");
      canvas.width = outputSize;
      canvas.height = outputSize;
      const context = canvas.getContext("2d");

      if (!context) throw new Error("Canvas is not available.");

      context.drawImage(
        cropImageRef.current,
        cropLeft * outputScale,
        cropTop * outputScale,
        cropWidth * outputScale,
        cropHeight * outputScale,
      );

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("De foto kon niet worden verwerkt."));
        }, "image/png");
      });
      const croppedFile = new File([blob], "avatar.png", { type: "image/png" });
      const transfer = new DataTransfer();
      transfer.items.add(croppedFile);
      inputRef.current.files = transfer.files;
      savedFileRef.current = croppedFile;

      setPreview(canvas.toDataURL("image/png"));
      setVerwijderd(false);
      closePhotoEditor(false);
    } catch {
      restoreSavedFile();
      setPhotoError("De bewerkte foto kon niet worden opgeslagen. Probeer een andere afbeelding.");
    }
  }

  function handleVerwijder() {
    setPreview(null);
    setVerwijderd(true);
    savedFileRef.current = null;
    closePhotoEditor(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label={preview ? "Profielfoto aanpassen" : "Profielfoto toevoegen"}
          className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-hubi-line text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hubi-link lg:size-32"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- the local preview is a data URL
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

      {verwijderd && <input type="hidden" name="verwijderFoto" value="1" />}

      {error && <p className="mt-1.5 text-[11px] text-red-600">{error}</p>}
      {photoError && !pendingImage && (
        <p role="alert" className="mt-1.5 text-[11px] text-red-600">{photoError}</p>
      )}

      <div
        hidden={!pendingImage}
        role="dialog"
        aria-modal="true"
        aria-labelledby="photoEditorTitle"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-5"
      >
        <div className="w-full max-w-[340px] rounded-xl bg-background p-5 shadow-xl">
          <h2 id="photoEditorTitle" className="text-base font-semibold text-hubi-ink">
            Profielfoto bewerken
          </h2>
          <p className="mb-4 mt-1 text-xs text-hubi-muted">
            Sleep de foto om hem te verplaatsen en gebruik de schuifregelaar om in te zoomen.
          </p>

          <div
            ref={cropAreaRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDragStart(null)}
            onPointerCancel={() => setDragStart(null)}
            className="relative mx-auto mb-4 size-[220px] max-w-full touch-none overflow-hidden rounded-full bg-hubi-line"
            style={{ cursor: dragStart ? "grabbing" : "grab" }}
          >
            {pendingImage && (
              // eslint-disable-next-line @next/next/no-img-element -- used as the crop source
              <img
                ref={cropImageRef}
                src={pendingImage}
                alt="Voorbeeld van de profielfoto"
                onLoad={handleCropImageLoad}
                onError={() => {
                  closePhotoEditor(true, false);
                  setPhotoError("De foto kon niet worden geladen. Probeer een andere afbeelding.");
                }}
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  width: cropWidth,
                  height: cropHeight,
                  left: cropLeft,
                  top: cropTop,
                }}
              />
            )}
          </div>

          <label htmlFor="photoZoom" className="mb-1 block text-[10px] font-medium uppercase tracking-[0.6px] text-hubi-muted">
            Zoomen
          </label>
          <input
            id="photoZoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={cropScale}
            onChange={(event) => handleZoomChange(Number(event.target.value))}
            className="mb-4 block w-full accent-hubi-link"
          />

          {photoError && <p role="alert" className="mb-3 text-xs text-red-600">{photoError}</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => closePhotoEditor()}
              className="min-h-8 rounded-md border border-hubi-soft px-3 text-xs text-hubi-ink"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={saveEditedPhoto}
              className="min-h-8 rounded-md bg-hubi-link px-3 text-xs font-semibold text-white"
            >
              Foto gebruiken
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
