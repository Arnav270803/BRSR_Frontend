import { CalendarPlus, LockKeyhole } from "lucide-react";
import { type FieldError, useForm } from "react-hook-form";
import { z } from "zod";
import { ApiError } from "../../api/client";
import type { CreateReportingYearValues } from "./reportingYearsData";

const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Enter a valid date");

const createReportingYearSchema = z
  .object({
    label: z.string().trim().min(1, "Label is required").max(80, "Max 80 characters"),
    startDate: dateOnlySchema,
    endDate: dateOnlySchema,
  })
  .superRefine((value, ctx) => {
    if (value.startDate > value.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }
  });

const defaultValues: CreateReportingYearValues = {
  label: "",
  startDate: "",
  endDate: "",
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

export function CreateReportingYearPanel({
  canCreate,
  createReportingYear,
}: {
  canCreate: boolean;
  createReportingYear: (values: CreateReportingYearValues) => Promise<void>;
}) {
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
    setError,
  } = useForm<CreateReportingYearValues>({
    defaultValues,
  });

  async function onSubmit(values: CreateReportingYearValues) {
    clearErrors();
    const result = createReportingYearSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof CreateReportingYearValues | undefined;

        if (fieldName) {
          setError(fieldName, {
            message: issue.message,
            type: "manual",
          });
        }
      }

      return;
    }

    try {
      await createReportingYear(result.data);
      reset(defaultValues);
    } catch (error) {
      setError("label", {
        message: error instanceof ApiError ? error.message : "Unable to create reporting year",
        type: "manual",
      });
    }
  }

  return (
    <aside
      className="rounded-lg border border-white/70 bg-white/50 p-4 shadow-[0_18px_60px_rgba(35,47,38,0.10)] backdrop-blur-2xl sm:p-5 2xl:p-6"
      id="create-reporting-year"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Admin setup</p>
          <h2 className="mt-1 text-xl font-semibold text-[#142019]">
            Create reporting year
          </h2>
        </div>
        <span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef4f0] text-[#315f42]">
          {canCreate ? (
            <CalendarPlus className="size-5" strokeWidth={1.8} />
          ) : (
            <LockKeyhole className="size-5" strokeWidth={1.8} />
          )}
        </span>
      </div>

      {canCreate ? (
        <form className="mt-5 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <span className="text-sm font-semibold text-[#253229]">Label</span>
            <input
              aria-invalid={Boolean(errors.label)}
              className={fieldClass(Boolean(errors.label))}
              placeholder="FY 2026-27"
              type="text"
              {...register("label")}
            />
            <FieldMessage error={errors.label} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label>
              <span className="text-sm font-semibold text-[#253229]">Start date</span>
              <input
                aria-invalid={Boolean(errors.startDate)}
                className={fieldClass(Boolean(errors.startDate))}
                type="date"
                {...register("startDate")}
              />
              <FieldMessage error={errors.startDate} />
            </label>

            <label>
              <span className="text-sm font-semibold text-[#253229]">End date</span>
              <input
                aria-invalid={Boolean(errors.endDate)}
                className={fieldClass(Boolean(errors.endDate))}
                type="date"
                {...register("endDate")}
              />
              <FieldMessage error={errors.endDate} />
            </label>
          </div>

          <button
            className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#1f5135] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8fa797]"
            disabled={isSubmitting}
            type="submit"
          >
            <CalendarPlus className="size-4" strokeWidth={1.8} />
            {isSubmitting ? "Creating..." : "Create year"}
          </button>
        </form>
      ) : (
        <div className="mt-5 rounded-lg border border-[#d9e2dc] bg-white/55 p-4 text-sm leading-6 text-[#65716a]">
          Reporting years are read only for your role. Ask a company admin to create
          a new reporting year.
        </div>
      )}

      <div className="mt-5 rounded-lg border border-[#d9e2dc] bg-white/45 p-4 text-sm leading-6 text-[#65716a]">
        Create a year first, then select the GHG activities that apply for that
        reporting cycle.
      </div>
    </aside>
  );
}
