"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DebtAmountOption =
  | ""
  | "0-5000"
  | "5000-10000"
  | "10000-20000"
  | "20000-50000"
  | "50000+";

type BehindOnPaymentsOption = "" | "No" | "Yes" | "Not sure";
type CreditScoreOption = "" | "Excellent (720+)" | "Good (680-719)" | "Fair (620-679)" | "Poor (<620)" | "Prefer not to say";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  debtAmount: DebtAmountOption;
  state: string;

  debtTypes: string[];
  behindOnPayments: BehindOnPaymentsOption;
  creditScore: CreditScoreOption;
  hardship: string;
  notes: string;

  consent: boolean;
};

const DEBT_TYPE_OPTIONS = [
  "Credit Card",
  "Personal Loan",
  "Medical Bills",
  "Collections",
  "Student Loan (private)",
  "Payday Loan",
  "Other",
] as const;

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function normalizePhone(v: string) {
  // light cleanup; keep digits
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length <= 10) return digits;
  // if country code included, keep last 10
  return digits.slice(-10);
}

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    debtAmount: "",
    state: "",

    debtTypes: [],
    behindOnPayments: "",
    creditScore: "Prefer not to say",
    hardship: "",
    notes: "",

    consent: false,
  });

  const step1Errors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "First name is required";
    if (!form.email.trim() || !isEmail(form.email)) errs.email = "Enter a valid email";
    const phoneDigits = normalizePhone(form.phone);
    if (phoneDigits.length < 10) errs.phone = "Enter a valid phone number";
    if (!form.debtAmount) errs.debtAmount = "Select an estimate";
    if (!form.consent) errs.consent = "Consent is required";
    return errs;
  }, [form]);

  const canContinue = Object.keys(step1Errors).length === 0;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleDebtType(label: string) {
    setForm((prev) => {
      const exists = prev.debtTypes.includes(label);
      return {
        ...prev,
        debtTypes: exists ? prev.debtTypes.filter((x) => x !== label) : [...prev.debtTypes, label],
      };
    });
  }

  async function submitLead(mode: "step1" | "full") {
    setLoading(true);
    setServerError(null);

    const payload =
      mode === "step1"
        ? {
            mode,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            debtAmount: form.debtAmount,
            consent: form.consent,
          }
        : {
            mode,
            ...form,
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            state: form.state.trim().toUpperCase(),
          };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to submit");
      }

      router.push("/thank-you");
    } catch (e: any) {
      setServerError(e?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          {/* LEFT: Offer */}
          <section>
            <div className="text-sm font-semibold tracking-wide text-blue-700">Debt Relief Consultation</div>

            <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Reduce your monthly payments — without taking another loan
            </h1>

            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Check eligibility in ~60 seconds. No upfront fees. No obligation. Private &amp; confidential.
            </p>

            <ul className="mt-6 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded bg-green-100 text-green-700">✓</span>
                <span>Free consultation</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded bg-green-100 text-green-700">✓</span>
                <span>Personalized plan to reduce and resolve debt</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded bg-green-100 text-green-700">✓</span>
                <span>Support with common debt types (credit cards, personal loans, medical bills)</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded bg-green-100 text-green-700">✓</span>
                <span>Private &amp; confidential</span>
              </li>
            </ul>

            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">What happens next?</div>
              <div className="mt-1">
                After you submit, a debt specialist will contact you to confirm details and discuss options.
              </div>
            </div>
          </section>

          {/* RIGHT: Form card */}
          <section className="lg:sticky lg:top-10">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-bold text-slate-900">Check if you qualify</div>
                  <div className="mt-1 text-sm text-slate-600">
                    Step {step} of 2 • Takes ~60 seconds • We only use this to contact you about debt relief options.
                  </div>
                </div>

                <div className="hidden rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 sm:block">
                  No upfront fees
                </div>
              </div>

              {serverError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {serverError}
                </div>
              )}

              {/* STEP 1 */}
              {step === 1 && (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" error={step1Errors.firstName}>
                      <input
                        className="input"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        placeholder="John"
                        autoComplete="given-name"
                      />
                    </Field>

                    <Field label="Last name (optional)">
                      <input
                        className="input"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        placeholder="Smith"
                        autoComplete="family-name"
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Email" error={step1Errors.email}>
                      <input
                        className="input"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="john@email.com"
                        autoComplete="email"
                      />
                    </Field>

                    <Field label="Phone" error={step1Errors.phone}>
                      <input
                        className="input"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="(555) 555-5555"
                        autoComplete="tel"
                      />
                    </Field>
                  </div>

                  <Field label="Estimated total unsecured debt" error={step1Errors.debtAmount}>
                    <select
                      className="input"
                      value={form.debtAmount}
                      onChange={(e) => update("debtAmount", e.target.value as DebtAmountOption)}
                    >
                      <option value="">Select…</option>
                      <option value="0-5000">$0 – $5,000</option>
                      <option value="5000-10000">$5,000 – $10,000</option>
                      <option value="10000-20000">$10,000 – $20,000</option>
                      <option value="20000-50000">$20,000 – $50,000</option>
                      <option value="50000+">$50,000+</option>
                    </select>
                  </Field>

                  <label className="mt-2 flex items-start gap-3 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                    />
                    <span>
                      I agree to be contacted by phone/text/email about debt relief options. Message &amp; data rates may apply.
                      {step1Errors.consent && (
                        <span className="ml-2 font-semibold text-red-600">{step1Errors.consent}</span>
                      )}
                    </span>
                  </label>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      className={`btn-primary ${!canContinue || loading ? "opacity-60" : ""}`}
                      disabled={!canContinue || loading}
                      onClick={() => setStep(2)}
                      type="button"
                    >
                      Continue
                    </button>

                    <button
                      className={`btn-secondary ${!canContinue || loading ? "opacity-60" : ""}`}
                      disabled={!canContinue || loading}
                      onClick={() => submitLead("step1")}
                      type="button"
                    >
                      Submit with Step 1
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Disclaimer: This site is not a lender and does not offer loans. Qualification and program availability vary.
                  </div>
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="State (optional)">
                      <input
                        className="input"
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        placeholder="KY"
                      />
                      <div className="mt-1 text-xs text-slate-500">2-letter code (ex: KY, CA, TX)</div>
                    </Field>

                    <Field label="Behind on payments? (optional)">
                      <select
                        className="input"
                        value={form.behindOnPayments}
                        onChange={(e) => update("behindOnPayments", e.target.value as BehindOnPaymentsOption)}
                      >
                        <option value="">Select…</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                        <option value="Not sure">Not sure</option>
                      </select>
                    </Field>
                  </div>

                  <Field label="Types of debt (optional)">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {DEBT_TYPE_OPTIONS.map((t) => (
                        <label key={t} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
                          <input
                            type="checkbox"
                            checked={form.debtTypes.includes(t)}
                            onChange={() => toggleDebtType(t)}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Credit score (optional)">
                      <select
                        className="input"
                        value={form.creditScore}
                        onChange={(e) => update("creditScore", e.target.value as CreditScoreOption)}
                      >
                        <option value="">Select…</option>
                        <option value="Excellent (720+)">Excellent (720+)</option>
                        <option value="Good (680-719)">Good (680–719)</option>
                        <option value="Fair (620-679)">Fair (620–679)</option>
                        <option value="Poor (<620)">Poor (&lt;620)</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </Field>

                    <Field label="Main hardship (optional)">
                      <input
                        className="input"
                        value={form.hardship}
                        onChange={(e) => update("hardship", e.target.value)}
                        placeholder="Job loss, medical, divorce, reduced income…"
                      />
                    </Field>
                  </div>

                  <Field label="Notes (optional)">
                    <textarea
                      className="input min-h-[96px] resize-y"
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Anything else a specialist should know?"
                    />
                  </Field>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button className="btn-secondary" type="button" onClick={() => setStep(1)} disabled={loading}>
                      Back
                    </button>

                    <button
                      className={`btn-primary ${loading ? "opacity-60" : ""}`}
                      type="button"
                      onClick={() => submitLead("full")}
                      disabled={loading}
                    >
                      {loading ? "Submitting…" : "Check If I Qualify"}
                    </button>
                  </div>

                  <div className="mt-2 text-xs text-slate-500">
                    Disclaimer: This site is not a lender and does not offer loans. Qualification and program availability vary.
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Tailwind helper classes */}
      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.75rem 0.9rem;
          font-size: 0.95rem;
          outline: none;
        }
        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.15);
        }
        .btn-primary {
          width: 100%;
          border-radius: 0.9rem;
          background: rgb(37 99 235);
          padding: 0.9rem 1rem;
          font-weight: 700;
          color: white;
        }
        .btn-primary:hover {
          background: rgb(29 78 216);
        }
        .btn-secondary {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgb(203 213 225);
          background: white;
          padding: 0.9rem 1rem;
          font-weight: 700;
          color: rgb(15 23 42);
        }
        .btn-secondary:hover {
          background: rgb(248 250 252);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {error && <span className="text-xs font-semibold text-red-600">{error}</span>}
      </div>
      {children}
    </div>
  );
}