import { AlertCircle } from "lucide-react";
import { Sentry } from "@/lib/sentry";
import { useEffect } from "react";
import { Link } from "wouter";

import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: `404 on ${window.location.pathname} from ${document.referrer}`,
      level: "info",
    });
  }, []);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link href="/">
              <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Take me home</button>
            </Link>
                          <a href="mailto:support@myeca.in" className="w-full text-center underline text-blue-600 hover:text-blue-800">Contact support</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
