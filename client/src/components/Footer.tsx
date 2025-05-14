import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin, FileText, ArrowRight, ShieldCheck, Award, ChevronDown } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <footer className="bg-background border-t border-border mt-8 sm:pb-0 pb-16">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Trust badges section */}
        <div className="mb-8 md:mb-12 p-4 md:p-6 bg-blue-50 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center min-h-12">
              <div className="bg-white p-3 rounded-full shadow-sm mr-4 flex-shrink-0">
                <ShieldCheck className="h-5 w-5 md:h-6 md:w-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">100% Secure</h4>
                <p className="text-xs text-muted-foreground">Bank-level encryption</p>
              </div>
            </div>
            <div className="flex items-center min-h-12">
              <div className="bg-white p-3 rounded-full shadow-sm mr-4 flex-shrink-0">
                <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Authorized by Indian Government</h4>
                <p className="text-xs text-muted-foreground">Certified e-Filing Partner</p>
              </div>
            </div>
            <div className="flex items-center min-h-12">
              <div className="bg-white p-3 rounded-full shadow-sm mr-4 flex-shrink-0">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">4.7/5 Customer Rating</h4>
                <p className="text-xs text-muted-foreground">Based on 22,500+ reviews</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main footer navigation - Mobile Accordion Style */}
        <div className="md:hidden">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-bold text-xl">
                myITR<span className="text-secondary">eturn</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Smart, secure, and simple tax filing for everyone in India.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors min-h-11 min-w-11 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
              </a>
            </div>
          </div>

          {/* Accordion Sections for Mobile */}
          <div className="space-y-2 border-t border-border pt-4">
            <div className="border border-border rounded-md overflow-hidden">
              <button 
                onClick={() => toggleSection('services')}
                className="flex justify-between items-center w-full p-4 text-left min-h-[48px]"
                aria-expanded={expandedSection === 'services'}
              >
                <h3 className="font-semibold text-sm">ITR Services</h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'services' ? 'transform rotate-180' : ''}`} />
              </button>
              {expandedSection === 'services' && (
                <ul className="p-4 pt-0 space-y-3 text-sm">
                  <li>
                    <Link href="/start-filing">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>ITR-1 (Sahaj)</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>ITR-2</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>ITR-3</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>ITR-4 (Sugam)</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>CA Assisted Filing</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="border border-border rounded-md overflow-hidden">
              <button 
                onClick={() => toggleSection('resources')}
                className="flex justify-between items-center w-full p-4 text-left min-h-[48px]"
                aria-expanded={expandedSection === 'resources'}
              >
                <h3 className="font-semibold text-sm">Resources</h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'resources' ? 'transform rotate-180' : ''}`} />
              </button>
              {expandedSection === 'resources' && (
                <ul className="p-4 pt-0 space-y-3 text-sm">
                  <li>
                    <Link href="/calculators">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Income Tax Calculator</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/tax-resources">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Tax Guides</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/tax-resources">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Income Tax Slabs</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/tax-resources">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Tax Deadlines</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/support">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Help Center</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            <div className="border border-border rounded-md overflow-hidden">
              <button 
                onClick={() => toggleSection('company')}
                className="flex justify-between items-center w-full p-4 text-left min-h-[48px]"
                aria-expanded={expandedSection === 'company'}
              >
                <h3 className="font-semibold text-sm">Company</h3>
                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === 'company' ? 'transform rotate-180' : ''}`} />
              </button>
              {expandedSection === 'company' && (
                <ul className="p-4 pt-0 space-y-3 text-sm">
                  <li>
                    <Link href="/about">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>About Us</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Careers</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Privacy Policy</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Terms of Service</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact">
                      <div className="text-slate-600 hover:text-primary flex items-center gap-1 group p-2 min-h-[44px]">
                        <span>Contact Us</span>
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Desktop footer navigation */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-primary mr-2" />
              <span className="text-primary font-bold text-xl">
                myITR<span className="text-secondary">eturn</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Smart, secure, and simple tax filing for everyone in India.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 text-blue-600" />
              </a>
              <a
                href="#"
                className="bg-blue-50 hover:bg-blue-100 p-2 rounded-full transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 text-blue-600" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm text-primary/80 uppercase tracking-wider">ITR Services</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/start-filing">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>ITR-1 (Sahaj)</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>ITR-2</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>ITR-3</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>ITR-4 (Sugam)</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>CA Assisted Filing</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm text-primary/80 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/calculators">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Income Tax Calculator</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/tax-resources">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Tax Guides</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/tax-resources">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Income Tax Slabs</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/tax-resources">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Tax Deadlines</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/support">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Help Center</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm text-primary/80 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>About Us</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Careers</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Privacy Policy</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Terms of Service</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-slate-600 hover:text-primary flex items-center gap-1 group">
                    <span>Contact Us</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <p>© {new Date().getFullYear()} myITReturn. All rights reserved.</p>
            <p className="flex items-center">
              <span className="inline-block mr-2 w-2 h-2 bg-green-500 rounded-full"></span>
              Authorized by Income Tax Department, Government of India
            </p>
          </div>
          <p className="mt-4 text-xs">
            myITReturn is an authorized e-filing intermediary registered with the Income Tax Department, Government of India. This platform helps taxpayers prepare and file their income tax returns efficiently.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
