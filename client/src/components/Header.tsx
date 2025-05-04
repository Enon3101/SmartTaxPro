import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  Menu,
  User,
  ChevronDown,
  LogOut,
  Settings,
  FileCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoginDialog } from "@/components/LoginDialog";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <FileText className="h-7 w-7 text-primary mr-2" />
              <span className="text-primary font-bold text-xl">
                myITR<span className="text-secondary">eturn</span>
              </span>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-3 text-sm">
          <Link href="/file-taxes">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              File ITR
            </Button>
          </Link>
          
          <Link href="/import-cg">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              Import CG / Shares
            </Button>
          </Link>
          
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              Pricing
            </Button>
          </Link>
          
          <Link href="/tax-resources">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              Resources
            </Button>
          </Link>
          
          <Link href="/support">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              Support
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="ghost" size="sm" className="font-medium text-gray-600">
              Log in
            </Button>
          </Link>
          
          <Link href="/signup">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              New User
            </Button>
          </Link>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col py-4 space-y-4">
              <Link href="/file-taxes">
                <div className="font-medium hover:text-primary transition-colors">
                  File ITR
                </div>
              </Link>
              <Link href="/import-cg">
                <div className="font-medium hover:text-primary transition-colors">
                  Import CG / Shares
                </div>
              </Link>
              <Link href="/pricing">
                <div className="font-medium hover:text-primary transition-colors">
                  Pricing
                </div>
              </Link>
              <Link href="/tax-resources">
                <div className="font-medium hover:text-primary transition-colors">
                  Resources
                </div>
              </Link>
              <Link href="/support">
                <div className="font-medium hover:text-primary transition-colors">
                  Support
                </div>
              </Link>
              <div className="border-t border-gray-100 my-2 pt-2"></div>
              <Link href="/login">
                <div className="font-medium hover:text-primary transition-colors">
                  Log in
                </div>
              </Link>
              <Link href="/signup">
                <div className="font-medium text-blue-500 hover:text-blue-600 transition-colors">
                  New User
                </div>
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
