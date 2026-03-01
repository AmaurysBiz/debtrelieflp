import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12 py-10 text-sm text-gray-600">
      <div className="mx-auto max-w-6xl px-4 flex flex-col gap-6">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          <p>
            © {new Date().getFullYear()} Debt Options Now. All rights reserved.
          </p>

          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
            <Link href="/disclaimer" className="hover:underline">
              Disclaimer
            </Link>
          </div>

        </div>

        {/* Contact */}
        <div className="text-center md:text-left text-gray-500">
          <p>
            Contact:{" "}
            <a
              href="mailto:support@debtoptionsnow.com"
              className="underline"
            >
              support@debtoptionsnow.com
            </a>
          </p>
        </div>

        {/* Compliance Disclaimer */}
        <p className="text-xs text-gray-500 leading-relaxed">
          Debt Options Now is a marketing and lead generation service that connects
          consumers with third-party debt relief providers. We are not a lender,
          debt settlement company, or financial advisor. By submitting your
          information, you consent to be contacted by phone, text, or email by
          affiliated service providers. Message and data rates may apply.
        </p>

      </div>
    </footer>
  );
}