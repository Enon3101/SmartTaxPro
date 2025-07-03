import {
  FileText,
  Menu,
  User,
  ChevronDown,
  LogOut,
  Settings,
  FileCheck,
  Calculator,
  BookOpen,
  Phone,
  DollarSign,
  FileSearch,
  // Calendar, // Removed unused import
  Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

import LoginDialog from "@/components/modals/LoginDialog";
import NavDropdown from "@/components/NavDropdown";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/features/auth/AuthContext";

const Header = () => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (path: string) => {
    return location === path;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  // Enhanced navigation items with dropdown menus
  const navItems = [
    { 
      name: "File ITR", 
      path: "/start-filing", 
      icon: <FileText className="h-4 w-4" />,
      hasDropdown: false
    },
    { 
      name: "Calculators", 
      path: "/calculators", 
      icon: <Calculator className="h-4 w-4" />,
      hasDropdown: true,
      dropdownItems: [
        {
          category: "Tax Calculators",
          items: [
            { name: "Income Tax Calculator", path: "/calculators/income-tax" },
            { name: "Tax Regime Comparison", path: "/calculators/tax-regime" },
            { name: "HRA Exemption Calculator", path: "/calculators/hra" },
            { name: "TDS Calculator", path: "/calculators/tds" },
            { name: "Capital Gains Tax", path: "/calculators/capital-gains" },
            { name: "Take-home Salary Calculator", path: "/calculators/take-home-salary" },
            { name: "Gratuity Calculator", path: "/calculators/gratuity" },
            { name: "GST Calculator", path: "/calculators/gst" }
          ]
        },
        {
          category: "Investment Calculators",
          items: [
            { name: "SIP Return Calculator", path: "/calculators/sip" },
            { name: "FD Maturity Calculator", path: "/calculators/fd" },
            { name: "PPF Calculator", path: "/calculators/ppf" },
            { name: "NPS Pension Calculator", path: "/calculators/nps" },
            { name: "Compound Interest", path: "/calculators/compound-interest" }
          ]
        },
        {
          category: "Loan",
          items: [
            { name: "Loan EMI Calculator", path: "/calculators/loan-emi" },
            { name: "Home Loan EMI", path: "/calculators/home-loan" },
            { name: "Car Loan EMI", path: "/calculators/car-loan" },
            { name: "Personal Loan EMI", path: "/calculators/personal-loan" },
            { name: "Loan Against Property", path: "/calculators/lap" },
            { name: "Retirement Corpus Planner", path: "/calculators/retirement" }
          ]
        }
      ]
    },
    { 
      name: "Tax Expert", 
      path: "/tax-expert", 
      icon: <Bot className="h-4 w-4" />,
      hasDropdown: false
    },
    { 
      name: "Tax Resources", 
      path: "/tax-resources", 
      icon: <FileSearch className="h-4 w-4" />,
      hasDropdown: true,
      dropdownItems: [
        {
          category: "ITR Forms",
          items: [
            { name: "ITR Forms Guide", path: "/itr-forms-guide", highlight: true },
            { name: "ITR-1 (Sahaj)", path: "/tax-resources/itr1" },
            { name: "ITR-2", path: "/tax-resources/itr2" },
            { name: "ITR-3", path: "/tax-resources/itr3" },
            { name: "ITR-4 (Sugam)", path: "/tax-resources/itr4" }
          ]
        },
        {
          category: "Tax Guides",
          items: [
            { name: "Tax Deductions", path: "/tax-resources/deductions" },
            { name: "Tax Slabs", path: "/tax-resources/slabs" },
            { name: "e-Filing Guide", path: "/tax-resources/e-filing" },
            { name: "Due Dates", path: "/tax-resources/due-dates" }
          ]
        }
      ]
    },
    { 
      name: "Learning", 
      path: "/learning", 
      icon: <BookOpen className="h-4 w-4" />,
      hasDropdown: true,
      dropdownItems: [
        {
          category: "Tax Learning",
          items: [
            { name: "Tax Basics", path: "/learning/tax-basics" },
            { name: "Deductions Guide", path: "/learning/deductions" },
            { name: "Investment Planning", path: "/learning/investment" },
            { name: "Tax-Saving Tips", path: "/learning/tax-saving" }
          ]
        },
        {
          category: "Finance Education",
          items: [
            { name: "Personal Finance", path: "/learning/personal-finance" },
            { name: "Retirement Planning", path: "/learning/retirement" },
            { name: "Financial Independence", path: "/learning/financial-independence" },
            { name: "Wealth Creation", path: "/learning/wealth-creation" }
          ]
        }
      ]
    },
    { 
      name: "Pricing", 
      path: "/pricing", 
      icon: <DollarSign className="h-4 w-4" />,
      hasDropdown: false
    },
    { 
      name: "Support", 
      path: "/support", 
      icon: <Phone className="h-4 w-4" />,
      hasDropdown: false
    }
  ];

  return (
    <header 
      className={`bg-background backdrop-blur-sm border-b sticky top-0 z-50 transition-all duration-200 ${
        scrolled 
          ? "border-border shadow-sm" 
          : "border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href={location.startsWith('/admin') ? '/admin' : '/'}>
            <div className="flex items-center cursor-pointer min-h-11 min-w-11">
              <div className="bg-primary/10 p-2 rounded-lg mr-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <span className="text-primary font-bold text-xl">
                {location.startsWith('/admin') ? 'Admin' : 'MyeCA'}<span className="text-secondary">{location.startsWith('/admin') ? 'Panel' : '.in'}</span>
              </span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1 text-sm">
          {navItems.map((item, index) => (
            <NavDropdown
              key={index}
              name={item.name}
              path={item.path}
              icon={item.icon}
              dropdownItems={item.hasDropdown ? item.dropdownItems : undefined}
              isActive={isActive(item.path)}
            />
          ))}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 ml-2 hover:bg-primary/10 hover:text-primary min-h-11"
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary/90 text-white text-xs">
                      {getInitials(user?.username || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.username}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 mt-1 p-1.5">
                <DropdownMenuItem className="cursor-pointer rounded hover:bg-primary/10 focus:bg-primary/10 py-2 min-h-11">
                  <User className="mr-2 h-4 w-4 text-primary" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded hover:bg-primary/10 focus:bg-primary/10 py-2 min-h-11">
                  <FileCheck className="mr-2 h-4 w-4 text-primary" />
                  <span>My Tax Forms</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer rounded hover:bg-primary/10 focus:bg-primary/10 py-2 min-h-11">
                  <Settings className="mr-2 h-4 w-4 text-primary" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem 
                  className="cursor-pointer rounded text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 py-2 min-h-11" 
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog 
              buttonText="Login / Sign Up" 
              buttonVariant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white ml-2 min-h-11" 
            />
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden min-h-11 min-w-11">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0" 
            onEscapeKeyDown={() => document.body.click()}
            onPointerDownOutside={() => document.body.click()}>
          
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border">
                <Link href={location.startsWith('/admin') ? '/admin' : '/'}>
                  <div className="flex items-center cursor-pointer mb-4 min-h-11" onClick={() => document.body.click()}>
                    <div className="bg-primary/10 p-2 rounded-lg mr-2">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-primary font-bold text-xl">
                      {location.startsWith('/admin') ? 'Admin' : 'MyeCA'}<span className="text-secondary">{location.startsWith('/admin') ? 'Panel' : '.in'}</span>
                    </span>
                  </div>
                </Link>
              
                {isAuthenticated && (
                  <div className="flex items-center gap-2 mt-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials(user?.username || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="font-medium text-sm">{user?.username}</span>
                      <p className="text-xs text-muted-foreground">Signed in</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-3 flex flex-col gap-1 flex-1">
                {navItems.map((item, index) => (
                  <Link key={index} href={item.path}>
                    <div 
                      className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium transition-colors min-h-12
                        ${isActive(item.path) 
                          ? "bg-primary/10 text-primary" 
                          : "hover:bg-muted hover:text-primary text-foreground"
                        }`}
                      onClick={() => document.body.click()}  
                    >
                      {item.icon}
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="p-4 border-t border-border mt-auto">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-1">
                    <Link href="/profile">
                      <div 
                        className="flex items-center gap-2 p-3 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors min-h-12"
                        onClick={() => document.body.click()}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <Link href="/my-forms">
                      <div 
                        className="flex items-center gap-2 p-3 rounded-md text-sm font-medium hover:bg-muted hover:text-primary transition-colors min-h-12"
                        onClick={() => document.body.click()}
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>My Tax Forms</span>
                      </div>
                    </Link>
                    <div 
                      className="flex items-center gap-2 p-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer min-h-12"
                      onClick={() => {
                        logout();
                        document.body.click();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </div>
                  </div>
                ) : (
                  <LoginDialog 
                    buttonText="Login / Sign Up" 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white min-h-12" 
                    onOpenChange={(open: boolean) => {
                      if (open) document.body.click();
                    }}
                  />
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
