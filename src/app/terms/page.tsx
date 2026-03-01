import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/"
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-6 mt-4">Terms of Service</h1>

      <p className="mb-4">
        By using Debt Options Now, you agree to the following terms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">No Financial Advice</h2>
      <p>
        We are not a lender, financial advisor, or debt relief provider. We
        connect consumers with third-party service providers.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Use of Website</h2>
      <p>
        You agree to use this site only for lawful purposes and provide accurate
        information when submitting forms.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Third-Party Services</h2>
      <p>
        We are not responsible for services provided by third-party partners.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Limitation of Liability</h2>
      <p>
        We are not liable for damages resulting from use of this website.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Changes to Terms</h2>
      <p>
        We may update these terms at any time without notice.
      </p>
    </main>
  );
}