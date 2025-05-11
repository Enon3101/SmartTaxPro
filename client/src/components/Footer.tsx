import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border mt-8">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">EasyTax</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Simple, secure tax filing for everyone.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Free Filing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Deluxe Filing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Premier Filing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Self-Employed
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Live Tax Expert
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Tax Calculator
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Tax Guides
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    IRS Forms
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Tax Deadlines
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Help Center
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Careers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Terms of Service
                  </a>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <a className="text-muted-foreground hover:text-primary">
                    Contact Us
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EasyTax Inc. All rights reserved.</p>
          <p className="mt-2">
            EasyTax is not affiliated with the IRS. EasyTax is a tax preparation
            service that helps users prepare and file their tax returns.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
