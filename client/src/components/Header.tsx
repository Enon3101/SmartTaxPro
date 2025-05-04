import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Header = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  const NavLinks = () => (
    <ul className="flex space-x-8">
      <li>
        <Link href="/">
          <a
            className={`font-medium ${
              isActive("/")
                ? "text-primary border-b-2 border-primary pb-1"
                : "hover:text-primary transition-colors"
            }`}
          >
            Home
          </a>
        </Link>
      </li>
      <li>
        <Link href="/file-taxes">
          <a
            className={`font-medium ${
              isActive("/file-taxes")
                ? "text-primary border-b-2 border-primary pb-1"
                : "hover:text-primary transition-colors"
            }`}
          >
            File Taxes
          </a>
        </Link>
      </li>
      <li>
        <Link href="/tax-resources">
          <a
            className={`font-medium ${
              isActive("/tax-resources")
                ? "text-primary border-b-2 border-primary pb-1"
                : "hover:text-primary transition-colors"
            }`}
          >
            Tax Resources
          </a>
        </Link>
      </li>
      <li>
        <Link href="/support">
          <a
            className={`font-medium ${
              isActive("/support")
                ? "text-primary border-b-2 border-primary pb-1"
                : "hover:text-primary transition-colors"
            }`}
          >
            Support
          </a>
        </Link>
      </li>
    </ul>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <a className="text-primary font-bold text-2xl">
              EasyTax<span className="text-secondary">.</span>
            </a>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav>
            <NavLinks />
          </nav>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
              <span className="text-sm font-medium">JD</span>
            </div>
          </div>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col py-4 space-y-4">
              <Link href="/">
                <a className="font-medium hover:text-primary transition-colors">
                  Home
                </a>
              </Link>
              <Link href="/file-taxes">
                <a className="font-medium hover:text-primary transition-colors">
                  File Taxes
                </a>
              </Link>
              <Link href="/tax-resources">
                <a className="font-medium hover:text-primary transition-colors">
                  Tax Resources
                </a>
              </Link>
              <Link href="/support">
                <a className="font-medium hover:text-primary transition-colors">
                  Support
                </a>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
