import Container from "@/components/Container";
import Link from "next/link";

export default function DisclaimerPage() {
  return (
    <main className="py-16">
      <Container>
        <Link
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold mt-4">Disclaimer</h1>

        <p className="mt-4 text-gray-700">
          Debt Options Now is not a lender, law firm, credit repair organization,
          or financial advisor. We are a marketing and lead generation company that
          connects consumers with third-party providers who may offer debt relief
          solutions.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">No Financial Advice</h2>
        <p className="mt-3 text-gray-700">
          Content on this website is provided for informational purposes only and
          should not be construed as financial, legal, or tax advice. You should
          consult qualified professionals for advice specific to your situation.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Results May Vary</h2>
        <p className="mt-3 text-gray-700">
          Results vary based on individual financial circumstances, creditor policies,
          and program eligibility. Not all consumers will qualify for services.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Affiliate / Partner Compensation</h2>
        <p className="mt-3 text-gray-700">
          This website may receive compensation from partners for referrals and/or
          qualified leads. Compensation may influence which providers you are matched with.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">Third-Party Services</h2>
        <p className="mt-3 text-gray-700">
          We are not responsible for the services, offers, pricing, or outcomes
          provided by third parties. Any agreement you enter into is strictly between
          you and the third-party provider.
        </p>
      </Container>
    </main>
  );
}