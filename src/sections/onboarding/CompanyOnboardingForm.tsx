import { useState } from "react";
import { type FieldError, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { createCompany } from "../../api/companies";
import { ApiError } from "../../api/client";

const optionalText = z
  .string()
  .trim()
  .min(1)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalUrl = z
  .string()
  .trim()
  .url("Enter a valid logo URL")
  .optional()
  .or(z.literal("").transform(() => undefined));

const companyOnboardingSchema = z.object({
  legalName: z.string().trim().min(1, "Legal company name is required"),
  displayName: z.string().trim().min(1, "Display name is required"),
  primaryDomain: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Primary domain is required")
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Enter a valid domain, for example company.com"),
  industry: z.string().trim().min(1, "Industry is required"),
  country: z.string().trim().min(1, "Country is required"),
  state: z.string().trim().min(1, "State is required"),
  city: z.string().trim().min(1, "City is required"),
  financialYearStartMonth: z
    .string()
    .trim()
    .min(1, "Financial year start month is required")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Financial year start month must be between 1 and 12")
        .max(12, "Financial year start month must be between 1 and 12"),
    ),
  cin: optionalText,
  gst: optionalText,
  registeredAddress: optionalText,
  listedStatus: optionalText,
  employeeCountRange: optionalText,
  contactPhone: optionalText,
  logoUrl: optionalUrl,
});

type CompanyOnboardingFormValues = {
  legalName: string;
  displayName: string;
  primaryDomain: string;
  industry: string;
  country: string;
  state: string;
  city: string;
  financialYearStartMonth: string;
  cin: string;
  gst: string;
  registeredAddress: string;
  listedStatus: string;
  employeeCountRange: string;
  contactPhone: string;
  logoUrl: string;
};

const months = [
  ["1", "January"],
  ["2", "February"],
  ["3", "March"],
  ["4", "April"],
  ["5", "May"],
  ["6", "June"],
  ["7", "July"],
  ["8", "August"],
  ["9", "September"],
  ["10", "October"],
  ["11", "November"],
  ["12", "December"],
];

const emptyDefaults: CompanyOnboardingFormValues = {
  legalName: "",
  displayName: "",
  primaryDomain: "",
  industry: "",
  country: "",
  state: "",
  city: "",
  financialYearStartMonth: "",
  cin: "",
  gst: "",
  registeredAddress: "",
  listedStatus: "",
  employeeCountRange: "",
  contactPhone: "",
  logoUrl: "",
};

function FieldMessage({ error }: { error?: FieldError }) {
  if (!error?.message) {
    return null;
  }

  return <p className="mt-2 text-xs font-medium text-[#9b3a32]">{error.message}</p>;
}

function fieldClass(hasError?: boolean) {
  const base =
    "mt-2 h-11 w-full rounded-md border bg-white/75 px-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:ring-3";

  if (hasError) {
    return `${base} border-[#c9756c] focus:border-[#9b3a32] focus:ring-[#9b3a32]/15`;
  }

  return `${base} border-[#d2ded6] focus:border-[#678c72] focus:ring-[#426a52]/15`;
}

function textareaClass(hasError?: boolean) {
  const base =
    "mt-2 min-h-24 w-full resize-y rounded-md border bg-white/75 px-3 py-3 text-sm text-[#16211b] shadow-sm outline-none transition placeholder:text-[#9aa39d] focus:ring-3";

  if (hasError) {
    return `${base} border-[#c9756c] focus:border-[#9b3a32] focus:ring-[#9b3a32]/15`;
  }

  return `${base} border-[#d2ded6] focus:border-[#678c72] focus:ring-[#426a52]/15`;
}

function labelClass() {
  return "text-sm font-semibold text-[#253229]";
}

export function CompanyOnboardingForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const navigate = useNavigate();
  const {
    clearErrors,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setError,
  } = useForm<CompanyOnboardingFormValues>({
    defaultValues: emptyDefaults,
  });

  async function onSubmit(values: CompanyOnboardingFormValues) {
    clearErrors();
    setSubmitError(null);
    const result = companyOnboardingSchema.safeParse(values);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const fieldName = issue.path[0] as keyof CompanyOnboardingFormValues | undefined;

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
      const response = await createCompany(result.data);
      navigate(`/app/${response.data.company.id}`, { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Unable to create company workspace right now.");
    }
  }

  return (
    <form
      className="rounded-lg border border-white/70 bg-white/55 p-5 shadow-[0_20px_70px_rgba(35,47,38,0.12)] backdrop-blur-2xl md:p-7"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-3 border-b border-[#dce5df] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-[#426a52]">Company profile</p>
          <h2 className="mt-1 text-2xl font-semibold text-[#142019]">Workspace details</h2>
        </div>
        <p className="rounded-md border border-[#cbd9d1] bg-white/65 px-3 py-2 text-xs font-semibold tracking-[0.12em] text-[#5f6f66] uppercase">
          V1 setup
        </p>
      </div>

      <FormSection
        description="Basic company identity used across the workspace."
        title="Company identity"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass()}>Legal company name</span>
            <input
              aria-invalid={Boolean(errors.legalName)}
              className={fieldClass(Boolean(errors.legalName))}
              placeholder="Acme Industries Limited"
              type="text"
              {...register("legalName")}
            />
            <FieldMessage error={errors.legalName} />
          </label>

          <label>
            <span className={labelClass()}>Display name</span>
            <input
              aria-invalid={Boolean(errors.displayName)}
              className={fieldClass(Boolean(errors.displayName))}
              placeholder="Acme Industries"
              type="text"
              {...register("displayName")}
            />
            <FieldMessage error={errors.displayName} />
          </label>

          <label>
            <span className={labelClass()}>Primary domain</span>
            <input
              aria-invalid={Boolean(errors.primaryDomain)}
              className={fieldClass(Boolean(errors.primaryDomain))}
              placeholder="acme.com"
              type="text"
              {...register("primaryDomain")}
            />
            <FieldMessage error={errors.primaryDomain} />
          </label>

          <label>
            <span className={labelClass()}>Industry</span>
            <input
              aria-invalid={Boolean(errors.industry)}
              className={fieldClass(Boolean(errors.industry))}
              placeholder="Manufacturing"
              type="text"
              {...register("industry")}
            />
            <FieldMessage error={errors.industry} />
          </label>
        </div>
      </FormSection>

      <FormSection description="Registered business location for the company record." title="Location">
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className={labelClass()}>Country</span>
            <input
              aria-invalid={Boolean(errors.country)}
              className={fieldClass(Boolean(errors.country))}
              placeholder="India"
              type="text"
              {...register("country")}
            />
            <FieldMessage error={errors.country} />
          </label>

          <label>
            <span className={labelClass()}>State</span>
            <input
              aria-invalid={Boolean(errors.state)}
              className={fieldClass(Boolean(errors.state))}
              placeholder="Maharashtra"
              type="text"
              {...register("state")}
            />
            <FieldMessage error={errors.state} />
          </label>

          <label>
            <span className={labelClass()}>City</span>
            <input
              aria-invalid={Boolean(errors.city)}
              className={fieldClass(Boolean(errors.city))}
              placeholder="Mumbai"
              type="text"
              {...register("city")}
            />
            <FieldMessage error={errors.city} />
          </label>
        </div>

        <label className="mt-4 block">
          <span className={labelClass()}>Registered address</span>
          <textarea
            aria-invalid={Boolean(errors.registeredAddress)}
            className={textareaClass(Boolean(errors.registeredAddress))}
            placeholder="Registered office address"
            {...register("registeredAddress")}
          />
          <FieldMessage error={errors.registeredAddress} />
        </label>
      </FormSection>

      <FormSection
        description="Optional company identifiers and classification details."
        title="Compliance details"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className={labelClass()}>CIN</span>
            <input
              aria-invalid={Boolean(errors.cin)}
              className={fieldClass(Boolean(errors.cin))}
              placeholder="U00000MH0000PLC000000"
              type="text"
              {...register("cin")}
            />
            <FieldMessage error={errors.cin} />
          </label>

          <label>
            <span className={labelClass()}>GST</span>
            <input
              aria-invalid={Boolean(errors.gst)}
              className={fieldClass(Boolean(errors.gst))}
              placeholder="27AAAAA0000A1Z5"
              type="text"
              {...register("gst")}
            />
            <FieldMessage error={errors.gst} />
          </label>

          <label>
            <span className={labelClass()}>Listed status</span>
            <select
              aria-invalid={Boolean(errors.listedStatus)}
              className={fieldClass(Boolean(errors.listedStatus))}
              {...register("listedStatus")}
            >
              <option value="">Select status</option>
              <option value="listed">Listed</option>
              <option value="unlisted">Unlisted</option>
              <option value="not_applicable">Not applicable</option>
            </select>
            <FieldMessage error={errors.listedStatus} />
          </label>

          <label>
            <span className={labelClass()}>Employee count range</span>
            <select
              aria-invalid={Boolean(errors.employeeCountRange)}
              className={fieldClass(Boolean(errors.employeeCountRange))}
              {...register("employeeCountRange")}
            >
              <option value="">Select range</option>
              <option value="1-50">1-50</option>
              <option value="51-250">51-250</option>
              <option value="251-1000">251-1000</option>
              <option value="1001-5000">1001-5000</option>
              <option value="5000+">5000+</option>
            </select>
            <FieldMessage error={errors.employeeCountRange} />
          </label>
        </div>
      </FormSection>

      <FormSection
        description="Workspace settings used during the first reporting setup."
        title="Workspace settings"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className={labelClass()}>Financial year start month</span>
            <select
              aria-invalid={Boolean(errors.financialYearStartMonth)}
              className={fieldClass(Boolean(errors.financialYearStartMonth))}
              {...register("financialYearStartMonth")}
            >
              <option value="">Select month</option>
              {months.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <FieldMessage error={errors.financialYearStartMonth} />
          </label>

          <label>
            <span className={labelClass()}>Contact phone</span>
            <input
              aria-invalid={Boolean(errors.contactPhone)}
              className={fieldClass(Boolean(errors.contactPhone))}
              placeholder="+91 98765 43210"
              type="tel"
              {...register("contactPhone")}
            />
            <FieldMessage error={errors.contactPhone} />
          </label>

          <label>
            <span className={labelClass()}>Logo URL</span>
            <input
              aria-invalid={Boolean(errors.logoUrl)}
              className={fieldClass(Boolean(errors.logoUrl))}
              placeholder="https://company.com/logo.png"
              type="url"
              {...register("logoUrl")}
            />
            <FieldMessage error={errors.logoUrl} />
          </label>
        </div>
      </FormSection>

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#dce5df] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm leading-6 text-[#65716a]">
            No role selection is needed here. The first creator becomes company admin.
          </p>
          {submitError ? (
            <p className="mt-2 rounded-md border border-[#e2c6bd] bg-[#fff7f3] px-3 py-2 text-sm font-semibold text-[#8a3f2a]">
              {submitError}
            </p>
          ) : null}
        </div>
        <button
          className="h-11 rounded-md bg-[#1f5135] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#183f2a] focus:ring-3 focus:ring-[#426a52]/25 focus:outline-none disabled:cursor-not-allowed disabled:bg-[#8fa797]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating workspace..." : "Create workspace"}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  children,
  description,
  title,
}: {
  children: React.ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="border-b border-[#dce5df] py-6 last:border-b-0">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-[#16211b]">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#65716a]">{description}</p>
      </div>
      {children}
    </section>
  );
}
