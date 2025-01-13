import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-blue-50 py-16">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
        {/* Column 1: Torah Net */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-blue-900">Torah Net</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a href="#" className="hover:text-blue-900">
                Home
              </a>
            </li>
            <li>
              <a href="#mission" className="hover:text-blue-900">
                Mission
              </a>
            </li>
            <li>
              <a href="#mission" className="hover:text-blue-900">
                About Us
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-blue-900">
                How it Works
              </a>
            </li>
          </ul>
        </div>

        {/* Column 2: Policies */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-blue-900">Policies</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a
                href="/pdf/community-guidelines.pdf"
                className="hover:text-blue-900"
                target="`_blank"
              >
                Community Guidelines
              </a>
            </li>
            <li>
              <a
                href="/pdf/dispute-resolution-policy.pdf"
                className="hover:text-blue-900"
                target="`_blank"
              >
                Dispute Resolutions
              </a>
            </li>
            <li>
              <a
                href="/pdf/user-agreements-and-terms-of-service.pdf"
                className="hover:text-blue-900"
                target="`_blank"
              >
                User Agreements and Terms of Service
              </a>
            </li>
            <li>
              <a
                href="/pdf/payment-policy.pdf"
                className="hover:text-blue-900"
                target="`_blank"
              >
                Payment Policy
              </a>
            </li>
            <li>
              <a
                href="/pdf/cancelation-policy.pdf"
                className="hover:text-blue-900"
                target="`_blank"
              >
                Cancelation Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Social Media */}
        <div>
          <h3 className="mb-4 text-lg font-bold text-blue-900">
            Follow us on Social Media
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <a
                href="https://www.instagram.com/torahnet/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900"
              >
                @TorahNet Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/profile.php?id=61570630370361"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-900"
              >
                Torah Net Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Logo */}
        <div className="flex justify-center">
          <a href="www.torah-net.com">
            <img
              src="/logo-torah-net-dark-blue.png"
              alt="Torah Net Logo"
              className="h-32 w-32 object-contain"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
