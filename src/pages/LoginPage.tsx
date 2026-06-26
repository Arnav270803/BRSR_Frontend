import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../api/auth";
import { ApiError } from "../api/client";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function loadGoogleIdentityScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Google sign-in failed to load")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google sign-in failed to load"));
    document.head.appendChild(script);
  });
}

export function LoginPage() {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
  const fromPath =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : null;

  useEffect(() => {
    let isCancelled = false;

    async function setupGoogleLogin() {
      if (!googleClientId) {
        setErrorMessage("Google client id is missing in the frontend environment.");
        setIsGoogleReady(false);
        return;
      }

      try {
        setIsGoogleReady(false);
        await loadGoogleIdentityScript();

        if (isCancelled || !googleButtonRef.current || !window.google?.accounts?.id) {
          return;
        }

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response.credential) {
              setErrorMessage("Google did not return a sign-in token.");
              return;
            }

            setIsSigningIn(true);
            setErrorMessage(null);

            try {
              const result = await loginWithGoogle(response.credential);
              const session = result.data;

              if (fromPath?.startsWith("/invite")) {
                navigate(fromPath, { replace: true });
                return;
              }

              if (session.needsCompanyOnboarding) {
                navigate("/onboarding/company", { replace: true });
                return;
              }

              const firstCompany = session.memberships[0];

              if (firstCompany) {
                navigate(`/app/${firstCompany.companyId}`, { replace: true });
                return;
              }

              setErrorMessage("No company workspace is available for this account yet.");
            } catch (error) {
              if (error instanceof ApiError) {
                setErrorMessage(error.message);
              } else {
                setErrorMessage("Unable to complete Google sign-in right now.");
              }
            } finally {
              setIsSigningIn(false);
            }
          },
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
          logo_alignment: "left",
          width: 320,
        });
        setIsGoogleReady(true);
      } catch (error) {
        setIsGoogleReady(false);
        setErrorMessage(
          error instanceof Error ? error.message : "Google sign-in failed to load",
        );
      }
    }

    setupGoogleLogin();

    return () => {
      isCancelled = true;
      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = "";
      }
    };
  }, [fromPath, googleClientId, navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#eef3ef] px-5 py-6 text-[#15211a]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e8f0ed_48%,#f7efe6_100%)]" />
      <div className="absolute inset-x-0 top-0 h-28 border-b border-white/60 bg-white/25 backdrop-blur-xl" />

      <section className="relative mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl place-items-center">
        <div className="grid w-full overflow-hidden rounded-lg border border-white/70 bg-white/45 shadow-[0_24px_80px_rgba(35,47,38,0.16)] backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr]">
          <div className="flex min-h-[520px] flex-col justify-between border-b border-white/60 p-8 md:border-r md:border-b-0 md:p-10">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-[#426a52] uppercase">
                BRSR Platform
              </p>
              <h1 className="mt-5 max-w-xl text-4xl leading-tight font-semibold text-[#142019] md:text-5xl">
                Sign in to your company workspace.
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-[#5a665f]">
                Access your reporting setup, selected GHG activities, and company data
                workspace in one place.
              </p>
            </div>

            <div className="mt-10 grid gap-3 text-sm text-[#5d675f] sm:grid-cols-3">
              <div className="border-t border-[#b8c7bd] pt-4">
                <p className="font-semibold text-[#16221b]">Company</p>
                <p className="mt-1">Workspace based</p>
              </div>
              <div className="border-t border-[#b8c7bd] pt-4">
                <p className="font-semibold text-[#16221b]">Access</p>
                <p className="mt-1">Role controlled</p>
              </div>
              <div className="border-t border-[#b8c7bd] pt-4">
                <p className="font-semibold text-[#16221b]">Auth</p>
                <p className="mt-1">Google sign-in</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 md:p-10">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <p className="text-sm font-medium text-[#426a52]">Welcome back</p>
                <h2 className="mt-2 text-2xl font-semibold text-[#142019]">
                  Continue securely
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#647169]">
                  Use the Google account linked with your company access.
                </p>
              </div>

              <div className="grid min-h-12 place-items-center rounded-md border border-[#cdd8cf] bg-white/80 px-4 py-2 shadow-sm">
                {!isGoogleReady && !errorMessage ? (
                  <p className="text-sm font-semibold text-[#53615a]">Loading Google sign-in...</p>
                ) : null}
                <div ref={googleButtonRef} />
                {isSigningIn ? (
                  <p className="mt-3 text-center text-sm font-semibold text-[#426a52]">
                    Signing you in...
                  </p>
                ) : null}
              </div>

              {errorMessage ? (
                <p className="mt-4 rounded-md border border-[#e2c6bd] bg-[#fff7f3] px-3 py-2 text-sm leading-6 text-[#8a3f2a]">
                  {errorMessage}
                </p>
              ) : null}

              <p className="mt-5 text-center text-xs leading-5 text-[#778179]">
                Your session will open the correct company workspace after sign-in.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
