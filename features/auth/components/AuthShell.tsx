import type { ReactNode } from "react";

type AuthShellProps = {
  brandTitle: ReactNode;
  brandText: string;
  children: ReactNode;
};


export function AuthShell({ brandTitle, brandText, children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col lg:flex-row">
      <aside className="hidden bg-hubi-ink p-16 text-white lg:flex lg:w-1/2 lg:flex-col">
        <p className="text-[28px] font-bold">HUBi</p>
        <div className="my-auto max-w-[500px]">
          <h2 className="text-[30px] leading-9 font-bold">{brandTitle}</h2>
          <p className="mt-16 max-w-[460px] text-[15px] text-hubi-soft">
            {brandText}
          </p>
        </div>
      </aside>

      <main className="flex flex-1 justify-center px-5 pt-12 pb-10 lg:items-center lg:px-16 lg:py-16">
        <div className="w-full max-w-[350px] lg:max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
