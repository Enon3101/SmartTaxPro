import { FileText, Home, Calculator, Book, HelpCircle } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      label: "Home",
      href: "/",
      active: location === "/"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "File Tax",
      href: "/start-filing",
      active: location === "/start-filing"
    },
    {
      icon: <Calculator className="h-5 w-5" />,
      label: "Tools",
      href: "/calculators",
      active: location === "/calculators" || location.startsWith("/calculators/")
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "Resources",
      href: "/tax-resources",
      active: location === "/tax-resources"
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Support",
      href: "/support",
      active: location === "/support"
    }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 shadow-lg border-t border-border flex justify-around py-2 z-50">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <a className={`flex flex-col items-center min-w-11 min-h-11 px-3 pt-2 pb-1 rounded-md ${
            item.active ? "text-blue-500" : "text-muted-foreground"
          } transition-colors`}>
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}