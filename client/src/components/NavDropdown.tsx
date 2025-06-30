import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'wouter';

import { Button } from "@/components/ui/button";

interface NavItemProps {
  name: string;
  path: string;
  icon: React.ReactNode;
  dropdownItems?: {
    category: string;
    items: {
      name: string;
      path: string;
      highlight?: boolean;
    }[];
  }[];
  isActive: boolean;
}

const NavDropdown = ({ name, path, icon, dropdownItems, isActive }: NavItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // If there are no dropdown items, render a simple button
  if (!dropdownItems) {
    return (
      <Link href={path}>
        <Button 
          variant={isActive ? "default" : "ghost"} 
          size="sm" 
          className={`font-medium transition-all px-3 py-2 h-9 ${
            isActive 
              ? "bg-primary text-white" 
              : "hover:bg-primary/10 hover:text-primary"
          }`}
        >
          <span className="flex items-center gap-1.5">
            {icon}
            {name}
          </span>
        </Button>
      </Link>
    );
  }
  
  // With dropdown items, render a dropdown menu
  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button 
        variant={isActive ? "default" : "ghost"} 
        size="sm" 
        className={`font-medium transition-all px-3 py-2 h-9 ${
          isActive 
            ? "bg-primary text-white" 
            : "hover:bg-primary/10 hover:text-primary"
        }`}
      >
        <Link href={path}>
          <span className="flex items-center gap-1.5">
            {icon}
            {name}
            {isHovered && <ChevronDown className="h-3.5 w-3.5 ml-0.5" />}
          </span>
        </Link>
      </Button>
      
      {/* Dropdown Menu */}
      {isHovered && (
        <div className="absolute left-0 top-full pt-2 z-50">
          <div className="bg-white shadow-lg rounded-lg border border-border overflow-hidden min-w-[280px]">
            {dropdownItems.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="px-4 py-2 font-semibold text-sm bg-muted">
                  {category.category}
                </div>
                <div className="grid grid-cols-1">
                  {category.items.map((item, itemIndex) => (
                    <Link 
                      key={itemIndex} 
                      href={item.path}
                      className={`px-4 py-2 text-sm hover:bg-primary/10 transition-colors flex items-center ${
                        item.highlight ? 'bg-primary/10 text-primary font-medium' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                {categoryIndex < dropdownItems.length - 1 && (
                  <div className="border-t border-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;