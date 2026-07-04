import { useState } from "react";
import { Send, UserPlus } from "lucide-react";
import { type FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../../api/client";
import type { CreateInvitationValues, InvitationRecord } from "./employeesData";
import { toCreateInvitationPayload } from "./employeesUtils";

const createInvitationSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid invite email"),
  role: z.enum(["ADMIN", "USER"]),
});

const defaultValues: CreateInvitationValues = {
  email: "",
  role: "USER",
};

function fieldClass(hasError?: boolean) {
  const base =
    "mt-2 h-11 w-full rounded-md border bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:ring-3";

  if (hasError) {
    return `${base} border-[#c9756c] focus:border-[#9b3a32] focus:ring-[#9b3a32]/15`;
  }

  return `${base} border-[#d2ded6] focus:border-[#678c72] focus:ring-[#426a52]/15`;
}

function FieldMessage({ error }: { error?: FieldError }) {
  if (!error?.message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-[#9b3a32]">{error.message}</p>;
}

export function EmployeesInviteForm({
  canCreate,
  createInvitation,
}: {
  canCreate: boolean;
  createInvitation: (values: CreateInvitationValues) => Promise<InvitationRecord>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
    watch,
  } = useForm<CreateInvitationValues>({
    defaultValues,
  });
  const selectedRole = watch("role");

  async function onSubmit(values: CreateInvitationValues) {
    clearErrors();
    setStatusMessage(null);
    const result = createInvitationSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof CreateInvitationValues | undefined;

        if (fieldName) {
          setError(fieldName, {
            message: issue.message,
            type: "manual",
          });
        }
      }

      return;
    }

    const payload = toCreateInvitationPayload(values);
    try {
      const invitation = await createInvitation(payload);
      setStatusMessage(
        invitation.emailSent
          ? `Invite email sent to ${invitation.email}.`
          : `Invite created for ${invitation.email}, but email was not sent. Copy the local invite link from the list.`,
      );
      reset(defaultValues);
    } catch (error) {
      setStatusMessage(error instanceof ApiError ? error.message : "Unable to create invite.");
    }
  }

  return (
    <aside
      className="order-first rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 xl:order-none 2xl:p-6"
      id="invite-employee"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Invite employee</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">Company access</h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
          <UserPlus className="size-5" strokeWidth={1.8} />
        </span>
      </div>

      {canCreate ? (
      <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <label>
          <span className="text-sm font-semibold text-[#253229]">Email</span>
          <input
            aria-invalid={Boolean(errors.email)}
            className={fieldClass(Boolean(errors.email))}
            placeholder="employee@company.com"
            type="email"
            {...register("email")}
          />
          <FieldMessage error={errors.email} />
        </label>

        <div>
          <span className="text-sm font-semibold text-[#253229]">Role</span>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-lg border border-[#d2ded6] bg-white/55 p-1">
            {(["USER", "ADMIN"] as const).map((role) => (
              <label
                className={`grid h-10 cursor-pointer place-items-center rounded-md text-sm font-semibold transition ${
                  selectedRole === role
                    ? "bg-[#1f5135] text-white shadow-sm"
                    : "text-[#5f6d65] hover:bg-white/70"
                }`}
                key={role}
              >
                <input className="sr-only" type="radio" value={role} {...register("role")} />
                {role}
              </label>
            ))}
          </div>
          <FieldMessage error={errors.role} />
        </div>

        <button
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8fa797]"
          disabled={isSubmitting}
          type="submit"
        >
          <Send className="size-4" strokeWidth={1.8} />
          {isSubmitting ? "Sending..." : "Send invite"}
        </button>

        {statusMessage ? (
          <p className="text-sm font-semibold text-[#2f6b45]">{statusMessage}</p>
        ) : null}
      </form>
      ) : (
        <div className="mt-5 rounded-lg border border-[#d9e2dc] bg-white/55 p-4 text-sm leading-6 text-[#65716a]">
          Your role can view access state, but only admins can invite new employees.
        </div>
      )}

      <div className="mt-5 rounded-lg border border-[#d9e2dc] bg-white/45 p-4 text-sm leading-6 text-[#65716a]">
        Invited users must sign in with the same email address used in the invitation.
        If email delivery fails, copy the invite link from the invitations list.
      </div>
    </aside>
  );
}
