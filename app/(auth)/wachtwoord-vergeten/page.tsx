import type { Metadata } from "next";
import { AuthShell } from "@/features/auth/components/AuthShell";

export const metadata: Metadata = {
  title: "Wachtwoord vergeten | HUBi",
};

// Taak 1: logo. De frame (AuthShell) toont het HUBi-logo; de rest volgt.
export default function WachtwoordVergetenPage() {
  return (
    <AuthShell brandTitle="" brandText="">
      {null}
    </AuthShell>
  );
}
