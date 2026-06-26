import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, KeyRound } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { acceptInvitation } from "../api/invitations";
import { ApiError } from "../api/client";

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasSubmittedRef = useRef(false);
  const token = searchParams.get("token")?.trim() ?? "";
  const [message, setMessage] = useState<string | null>(null);
  const acceptInvitationMutation = useMutation({
    mutationFn: acceptInvitation,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      setMessage(`Access accepted for ${response.data.company.displayName}.`);
      navigate(`/app/${response.data.company.id}`, { replace: true });
    },
    onError: (error) => {
      setMessage(
        error instanceof ApiError ? error.message : "Unable to accept this invitation.",
      );
    },
  });

  useEffect(() => {
    if (!token || hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = true;
    acceptInvitationMutation.mutate(token);
  }, [acceptInvitationMutation, token]);

  const isError = !token || acceptInvitationMutation.isError;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#eef3ef] px-5 py-6 text-[#15211a]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8faf6_0%,#e8f0ed_48%,#f7efe6_100%)]" />
      <section className="relative w-full max-w-lg rounded-lg border border-white/70 bg-white/55 p-6 shadow-[0_24px_80px_rgba(35,47,38,0.16)] backdrop-blur-2xl sm:p-7">
        <span className="grid size-12 place-items-center rounded-lg bg-[#1f5135] text-white">
          {isError ? (
            <KeyRound className="size-6" strokeWidth={1.8} />
          ) : (
            <CheckCircle2 className="size-6" strokeWidth={1.8} />
          )}
        </span>

        <p className="mt-5 text-sm font-semibold tracking-[0.16em] text-[#426a52] uppercase">
          BRSR Invitation
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-semibold text-[#142019]">
          {isError ? "Invitation needs attention" : "Accepting your access"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#647169]">
          {token
            ? "Keep this page open while we connect your signed-in account to the company workspace."
            : "This invitation link is missing its token. Ask the admin to send a fresh invite link."}
        </p>

        <div
          className={`mt-5 rounded-md border px-3 py-3 text-sm leading-6 ${
            isError
              ? "border-[#e2c6bd] bg-[#fff7f3] text-[#8a3f2a]"
              : "border-[#bdd3c3] bg-[#edf6ef] text-[#2f6b45]"
          }`}
        >
          {message ??
            (acceptInvitationMutation.isPending
              ? "Accepting invitation..."
              : "Preparing invitation...")}
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none"
            to="/login"
          >
            Sign in again
          </Link>
          <Link
            className="inline-flex h-11 items-center justify-center rounded-md border border-[#cdd9d1] bg-white/70 px-4 text-sm font-semibold text-[#1d2a22] shadow-sm transition hover:border-[#9fb5a6] hover:bg-white focus:ring-3 focus:ring-[#426a52]/20 focus:outline-none"
            to="/"
          >
            Back to app
          </Link>
        </div>
      </section>
    </main>
  );
}
