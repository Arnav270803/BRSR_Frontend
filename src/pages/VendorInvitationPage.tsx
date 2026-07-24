import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, KeyRound, Store } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ApiError } from "../api/client";
import { acceptVendorInvitation } from "../api/vendors";

export function VendorInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const submittedRef = useRef(false);
  const token = searchParams.get("token")?.trim() ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const mutation = useMutation({
    mutationFn: acceptVendorInvitation,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setMessage(`Supplier access accepted for ${response.data.company.displayName}.`);
      navigate(`/vendor/${response.data.vendor.id}`, { replace: true });
    },
    onError: (error) => {
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Unable to accept this supplier invitation.",
      );
    },
  });

  useEffect(() => {
    if (!token || submittedRef.current) {
      return;
    }

    submittedRef.current = true;
    mutation.mutate(token);
  }, [mutation, token]);

  const isError = !token || mutation.isError;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#eef3ef] px-5 py-6 text-[#15211a]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e8f0ed_48%,#f7efe6_100%)]" />
      <section className="relative w-full max-w-lg rounded-lg border border-white/70 bg-white/55 p-6 shadow-[0_24px_80px_rgba(35,47,38,0.16)] backdrop-blur-2xl sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-12 place-items-center rounded-lg bg-[#1f5135] text-white">
            {isError ? (
              <KeyRound className="size-6" strokeWidth={1.8} />
            ) : (
              <CheckCircle2 className="size-6" strokeWidth={1.8} />
            )}
          </span>
          <Store className="size-5 text-[#426a52]" strokeWidth={1.8} />
        </div>

        <p className="mt-5 text-sm font-semibold tracking-[0.16em] text-[#426a52] uppercase">
          Supplier invitation
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold text-[#142019]">
          {isError ? "Invitation needs attention" : "Connecting your supplier account"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#647169]">
          {token
            ? "Keep this page open while we connect your signed-in account to the supplier portal."
            : "This link is missing its invitation token. Ask the company administrator for a fresh invitation."}
        </p>

        <div
          className={`mt-5 rounded-md border px-3 py-3 text-sm leading-6 ${
            isError
              ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
              : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
          }`}
        >
          {message ?? (mutation.isPending ? "Accepting invitation..." : "Preparing access...")}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white"
            state={{ from: `/vendor/invite?token=${encodeURIComponent(token)}` }}
            to="/login"
          >
            Sign in again
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22]"
            to="/"
          >
            Back to home
          </Link>
        </div>
      </section>
    </main>
  );
}
