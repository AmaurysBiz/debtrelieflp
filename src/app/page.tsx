"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DebtAmountOption =
  | ""
  | "5000-10000"
  | "10000-20000"
  | "20000-50000"
  | "50000+";

type FormState = {
  firstName: string;
  email: string;
  phone: string;
  debtAmount: DebtAmountOption;
  state: string;
  consent: boolean;
};

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function normalizePhone(v: string) {
  const digits = v.replace(/[^\d]/g, "");
  if (digits.length <= 10) return digits;
  return digits.slice(-10);
}

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState<FormState>({
    firstName: "",
    email: "",
    phone: "",
    debtAmount: "",
    state: "",
    consent: false,
  });

  const errors = useMemo(() => {
    if (!submitted) return {};
    const e: Record<string, string> = {};

    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.email.trim() || !isEmail(form.email)) e.email = "Valid email required";
    if (normalizePhone(form.phone).length < 10) e.phone = "Valid phone required";
    if (!form.debtAmount) e.debtAmount = "Required";
    if (!form.state) e.state = "Required";
    if (!form.consent) e.consent = "Required";

    return e;
  }, [form, submitted]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitLead() {
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      router.push("/thank-you");
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">

      {/* TOP BAR */}
      <div className="bg-slate-900 text-white text-center text-xs py-2">
        Free & Confidential Debt Consultation • No Upfront Fees
      </div>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">

          {/* LEFT */}
          <section>

            <h1 className="text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
              Owe $10,000+ in Credit Card Debt?
              <br />
              See If You Qualify to Lower Your Payments
            </h1>

            <p className="mt-3 text-sm font-medium text-slate-700">
              Takes ~60 seconds • No upfront fees • Limited availability
            </p>

            <p className="mt-4 text-lg text-slate-600">
              Free consultation. No obligation.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Checking eligibility does NOT affect your credit score
            </p>

            <ul className="mt-6 space-y-3 text-slate-700">
              <li>✓ Free consultation</li>
              <li>✓ Private & secure process</li>
              <li>✓ No upfront fees</li>
              <li>✓ Explore options to reduce total debt</li>
            </ul>

          </section>

          {/* FORM */}
          <section>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="text-xl font-bold text-slate-900">
                See If You Qualify
              </div>

              <div className="mt-1 text-sm text-slate-600">
                Takes ~60 seconds
              </div>

              <div className="mt-6 space-y-4">

                <Field label="First Name" error={errors.firstName}>
                  <input className="input"
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)} />
                </Field>

                <Field label="Email" error={errors.email}>
                  <input className="input"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)} />
                </Field>

                <Field label="Phone" error={errors.phone}>
                  <input className="input"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)} />
                </Field>

                <Field label="Estimated Total Unsecured Debt" error={errors.debtAmount}>
                  <select className="input"
                    value={form.debtAmount}
                    onChange={(e) => update("debtAmount", e.target.value as DebtAmountOption)}>
                    <option value="">Select…</option>
                    <option value="5000-10000">$5,000 – $10,000</option>
                    <option value="10000-20000">$10,000 – $20,000</option>
                    <option value="20000-50000">$20,000 – $50,000</option>
                    <option value="50000+">$50,000+</option>
                  </select>
                </Field>

                <Field label="State" error={errors.state}>
                  <select
                    className="input"
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                  >
                    <option value="">Select your state…</option>
                    <option value="KY">Kentucky</option>
                    <option value="TX">Texas</option>
                    <option value="CA">California</option>
                    <option value="FL">Florida</option>
                    <option value="NY">New York</option>
                    <option value="Other">Other</option>
                  </select>
                </Field>

                <label className="text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => update("consent", e.target.checked)}
                  />{" "}
                  I agree to be contacted regarding debt relief options.
                  {errors.consent && (
                    <span className="text-red-600 text-xs ml-2">Required</span>
                  )}
                </label>

                <button className="btn-primary" onClick={submitLead}>
                  {loading ? "Submitting..." : "Get My Options"}
                </button>

                <div className="text-xs text-slate-500 text-center mt-3">
                  🔒 Secure submission • No upfront fees • Free consultation
                </div>

              </div>
            </div>
          </section>

        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgb(226 232 240);
          padding: 0.75rem;
          font-size: 0.95rem;
        }
        .input:focus {
          border-color: rgb(59 130 246);
          box-shadow: 0 0 0 3px rgb(59 130 246 / 0.15);
          outline: none;
        }
        .btn-primary {
          width: 100%;
          border-radius: 0.9rem;
          background: rgb(37 99 235);
          padding: 0.9rem;
          font-weight: 700;
          color: white;
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
      <div className="mb-1 text-sm font-semibold text-slate-700">
        {label} {error && <span className="text-red-600 text-xs ml-1">{error}</span>}
      </div>
      {children}
    </div>
  );
}