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
import { ThemeToggle } from "@/components/ThemeToggle";

const Header = () => {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
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
            <Button variant="ghost" size="sm" className="font-medium">
              File ITR
            </Button>
          </Link>
          
          <Link href="/calculators">
            <Button variant="ghost" size="sm" className="font-medium">
              Calculators
            </Button>
          </Link>
          
          <Link href="/learning">
            <Button variant="ghost" size="sm" className="font-medium">
              Learning
            </Button>
          </Link>
          
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="font-medium">
              Pricing
            </Button>
          </Link>
          
          <Link href="/support">
            <Button variant="ghost" size="sm" className="font-medium">
              Support
            </Button>
          </Link>
          
          <ThemeToggle />
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(user?.username || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.username}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <FileCheck className="mr-2 h-4 w-4" />
                  <span>My Tax Forms</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginDialog 
              buttonText="Login / Sign Up" 
              buttonVariant="default" 
              className="bg-blue-500 hover:bg-blue-600 text-white" 
            />
          )}
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px]" 
            // To fix sheet not closing automatically, we'll use useState to control it
            onEscapeKeyDown={() => document.body.click()}
            onPointerDownOutside={() => document.body.click()}>
          
            <div className="flex flex-col py-4 space-y-4">
              {isAuthenticated && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials(user?.username || "")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user?.username}</span>
                </div>
              )}
              
              <div className="pb-3 mb-2 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
              
              <Link href="/file-taxes">
                <div 
                  className="font-medium hover:text-primary transition-colors"
                  onClick={() => document.body.click()}  
                >
                  File ITR
                </div>
              </Link>
              <Link href="/calculators">
                <div 
                  className="font-medium hover:text-primary transition-colors"
                  onClick={() => document.body.click()}  
                >
                  Calculators
                </div>
              </Link>
              <Link href="/learning">
                <div 
                  className="font-medium hover:text-primary transition-colors"
                  onClick={() => document.body.click()}  
                >
                  Learning
                </div>
              </Link>
              <Link href="/pricing">
                <div 
                  className="font-medium hover:text-primary transition-colors"
                  onClick={() => document.body.click()}  
                >
                  Pricing
                </div>
              </Link>
              <Link href="/support">
                <div 
                  className="font-medium hover:text-primary transition-colors"
                  onClick={() => document.body.click()}  
                >
                  Support
                </div>
              </Link>
              
              <div className="border-t border-gray-100 my-2 pt-2"></div>
              
              {/* Theme toggle removed */}
              
              {isAuthenticated ? (
                <>
                  <Link href="/profile">
                    <div 
                      className="font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => document.body.click()}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </div>
                  </Link>
                  <Link href="/my-forms">
                    <div 
                      className="font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => document.body.click()}
                    >
                      <FileCheck className="mr-2 h-4 w-4" />
                      <span>My Tax Forms</span>
                    </div>
                  </Link>
                  <Link href="/settings">
                    <div 
                      className="font-medium hover:text-primary transition-colors flex items-center"
                      onClick={() => document.body.click()}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </div>
                  </Link>
                  <div 
                    className="font-medium text-red-600 hover:text-red-700 transition-colors flex items-center cursor-pointer"
                    onClick={(e) => {
                      logout();
                      document.body.click();
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col gap-2">
                    <LoginDialog 
                      buttonText="Login / Sign Up" 
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
                      onOpenChange={(open: boolean) => {
                        if (open) document.body.click();
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
