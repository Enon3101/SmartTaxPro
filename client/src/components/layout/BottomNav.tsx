import { FileText, Home, Calculator, Book, HelpCircle, Bot } from "lucide-react";
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
      icon: <Bot className="h-5 w-5" />,
      label: "Tax Expert",
      href: "/tax-expert",
      active: location === "/tax-expert"
    },
    {
      icon: <Book className="h-5 w-5" />,
      label: "Resources",
      href: "/tax-resources",
      active: location === "/tax-resources"
    }
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-slate-800 shadow-lg border-t border-border flex justify-around py-2 z-50 safe-area-inset-bottom">
      {navItems.map((item, index) => (
        <Link key={index} href={item.href}>
          <div className={`flex flex-col items-center justify-center min-w-[60px] min-h-[60px] px-2 py-2 rounded-lg touch-manipulation active:scale-95 transition-all duration-150 ${
            item.active 
              ? "text-blue-500 bg-blue-50 dark:bg-blue-900/20" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}>
            <div className="mb-1">
              {item.icon}
            </div>
            <span className="text-xs font-medium leading-tight text-center">{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
}
