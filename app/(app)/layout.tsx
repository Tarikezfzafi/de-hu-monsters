import { Suspense } from "react";
import { Navbar } from "@/features/navigatie/components/Navbar";

// Layout voor alle schermen na het inloggen: navigatie + pagina
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <Suspense fallback={null}>
        <Navbar />
      </Suspense>

      {/* Ruimte onder de pagina zodat de tabbalk (72px) niets afdekt */}
      <div className="flex flex-1 flex-col pb-[72px] lg:pb-0">{children}</div>
    </div>
  );
}
