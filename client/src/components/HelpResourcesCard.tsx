import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageSquare } from "lucide-react";

const HelpResourcesCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">Need Help?</h2>

      <ul className="space-y-3 mb-4">
        <li>
          <Link href="#">
            <a className="flex items-center text-primary hover:underline">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Understanding W-2 forms</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="#">
            <a className="flex items-center text-primary hover:underline">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Investment income guide</span>
            </a>
          </Link>
        </li>
        <li>
          <Link href="#">
            <a className="flex items-center text-primary hover:underline">
              <HelpCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">Tax deduction tips</span>
            </a>
          </Link>
        </li>
      </ul>

      <Button
        variant="outline"
        className="w-full justify-center bg-background border border-[#E9ECEF] text-foreground hover:bg-[#E9ECEF] transition-colors"
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        Chat with Tax Expert
      </Button>
    </div>
  );
};

export default HelpResourcesCard;
