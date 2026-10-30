import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Pagina's die je zonder account mag openen
const OPENBARE_PADEN = [
  "/login",
  "/registreren",
  "/wachtwoord-vergeten",
  "/wachtwoord-resetten",
  "/confirm",
];

// Pagina's waar een ingelogde gebruiker niets te zoeken heeft
const ALLEEN_UITGELOGD = ["/login", "/registreren"];

function begintMet(pad: string, lijst: string[]) {
  return lijst.some((p) => pad === p || pad.startsWith(`${p}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          // 1. Op het verzoek zetten, zodat de pagina het nieuwe token ziet
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // 2. Nieuwe response met de bijgewerkte request
          response = NextResponse.next({ request });
          // 3. Op de response zetten, zodat de browser het nieuwe token opslaat
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          // 4. Voorkomt dat een CDN een pagina met sessie cachet
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value)
          );
        },
      },
    }
  );

  // Ververst het token als dat nodig is. Geen code tussen createServerClient en deze regel!
  const { data: { user } } = await supabase.auth.getUser();

  const pad = request.nextUrl.pathname;

  // Niet ingelogd en een beschermde pagina? Naar /login
  if (!user && pad !== "/" && !begintMet(pad, OPENBARE_PADEN)) {
    return redirectMetCookies(request, response, "/login");
  }

  // Wel ingelogd en op /login of /registreren? Naar /profiel
  if (user && begintMet(pad, ALLEEN_UITGELOGD)) {
    return redirectMetCookies(request, response, "/profiel");
  }

  return response;
}

// Een redirect moet de ververste cookies meenemen, anders raak je de sessie kwijt
function redirectMetCookies(request: NextRequest, response: NextResponse, naar: string) {
  const redirect = NextResponse.redirect(new URL(naar, request.url));
  response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  return redirect;
}