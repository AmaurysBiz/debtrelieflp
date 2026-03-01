import Container from "@/components/Container";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="py-16">
      <Container>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mt-4">Privacy Policy</h1>

        <p className="mt-4 text-gray-600">
          This Privacy Policy describes how Debt Options Now (“we”, “us”, “our”)
          collects, uses, and shares information when you use this website.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Information We Collect</h2>
        <p className="mt-3 text-gray-700">
          When you submit a form, we may collect information such as your name,
          email address, phone number, state, debt amount estimate, and any other
          information you choose to provide.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">How We Use Information</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-700 space-y-2">
          <li>To contact you about debt relief options and related services.</li>
          <li>To route your inquiry to third-party providers who may assist you.</li>
          <li>To improve website performance, tracking, and advertising (where enabled).</li>
          <li>To comply with legal obligations and prevent fraud.</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">Sharing Information</h2>
        <p className="mt-3 text-gray-700">
          We may share your information with third-party service providers and
          partners to help respond to your request. We do not sell personal
          information as a standalone product, but we may be compensated by
          partners for qualified leads.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Your Choices</h2>
        <p className="mt-3 text-gray-700">
          You may request access, correction, or deletion of your information by
          contacting us. You may also opt out of marketing communications at any time.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Contact</h2>
        <p className="mt-3 text-gray-700">
          If you have questions about this policy, contact us using the information
          provided on this website.
        </p>

        <p className="mt-10 text-sm text-gray-500">
          Last updated: {new Date().getFullYear()}
        </p>
      </Container>
    </main>
  );
}