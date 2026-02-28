"use client";

import { useEffect } from "react";

export default function ThankYouPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "Lead");
    }
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          You’re all set ✅
        </h1>

        <p className="mt-4 text-lg text-slate-600">
          A debt specialist will reach out shortly to confirm details and discuss your options.
        </p>

        <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
          <p className="font-semibold text-slate-900">What to expect next:</p>
          <ul className="mt-3 space-y-2 text-slate-700">
            <li>• A quick call/text to confirm your situation</li>
            <li>• Review of eligible debt relief programs (if applicable)</li>
            <li>• A clear plan and next steps</li>
          </ul>
        </div>

        <a
          href="/"
          className="mt-10 inline-flex rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-800 hover:bg-slate-50"
        >
          Back to home
        </a>
      </section>
    </main>
  );
}