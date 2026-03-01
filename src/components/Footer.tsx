import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t mt-12 py-8 text-sm text-gray-600">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left */}
        <p>
          © {new Date().getFullYear()} Debt Options Now. All rights reserved.
        </p>

        {/* Links */}
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
    </footer>
  );
}