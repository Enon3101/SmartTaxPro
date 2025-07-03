import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 sm:py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2h-2v2h2V2zm0 18h-2v2h2v-2zM4.93 4.93l-1.41 1.41L5.05 7.88l1.41-1.41L4.93 4.93zm14.14 0l-1.54 1.54 1.41 1.41 1.54-1.54-1.41-1.41zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white">MyeCA.in</h3>
                <p className="text-sm text-gray-400">Tax Filing Made Easy</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Simplifying tax filing with expert guidance and cutting-edge technology. 
              File your ITR with confidence and get maximum refunds.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors touch-manipulation">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors touch-manipulation">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors touch-manipulation">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition-colors touch-manipulation">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/start-filing" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                File ITR Online
              </Link>
              <Link href="/calculators" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Tax Calculators
              </Link>
              <Link href="/tax-resources" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Tax Resources
              </Link>
              <Link href="/pricing" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Pricing Plans
              </Link>
              <Link href="/support" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Help & Support
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Services</h4>
            <nav className="space-y-2">
              <Link href="/tax-filing" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                ITR Filing
              </Link>
              <Link href="/tax-expert" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Tax Expert Consultation
              </Link>
              <Link href="/gst-filing" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                GST Filing
              </Link>
              <Link href="/business-registration" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Business Registration
              </Link>
              <Link href="/tax-planning" className="block text-sm hover:text-blue-400 transition-colors py-1 touch-manipulation">
                Tax Planning
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <div>
                  <a href="tel:+911234567890" className="text-sm hover:text-blue-400 transition-colors">
                    +91 123 456 7890
                  </a>
                  <p className="text-xs text-gray-500">Mon-Fri 9AM-6PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <a href="mailto:support@myeca.in" className="text-sm hover:text-blue-400 transition-colors">
                  support@myeca.in
                </a>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                <address className="text-sm not-italic leading-relaxed">
                  123 Business District,<br />
                  Mumbai, Maharashtra 400001
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400 text-center sm:text-left">
              © 2024 MyeCA.in. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors touch-manipulation">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors touch-manipulation">
                Terms of Service
              </Link>
              <Link href="/disclaimer" className="text-sm text-gray-400 hover:text-blue-400 transition-colors touch-manipulation">
                Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
