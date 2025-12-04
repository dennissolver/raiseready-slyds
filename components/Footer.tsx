// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Company Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">SlydS</h3>
            <p className="text-sm text-gray-400 mb-4">
              Want to be the next UNICORN? Become a STORYTELLER.
            </p>
            <p className="text-sm text-gray-400 mb-4">
              $2B+ raised for 500+ startups since 2013.
            </p>
            <p className="text-sm text-gray-500">
              SlydS - Decks, Fundraise & Strategy<br />
              Bengaluru, Karnataka, India
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/founder/upload" className="hover:text-white transition-colors">Submit Your Pitch</Link></li>
              <li><Link href="/founder/practice" className="hover:text-white transition-colors">AI Pitch Coach</Link></li>
              <li><a href="https://slyds.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">SlydS Services</a></li>
              <li><a href="https://www.linkedin.com/company/slyds" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal & Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors font-medium">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="mailto:hello@slyds.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">
              © {currentYear} SlydS Services Pvt. Ltd. All rights reserved.
            </p>

            <div className="flex items-center space-x-6 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms
              </Link>
              <a href="mailto:hello@slyds.com" className="hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>

          {/* Compliance Badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                GDPR Compliant
              </span>
              <span className="text-gray-700">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                India DPDP Act
              </span>
              <span className="text-gray-700">•</span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Secure Infrastructure
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}