import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Download, FileText, Home, Printer } from "lucide-react";

export default function FilingComplete() {
  const [location, setLocation] = useLocation();
  const acknowledgmentNumber = "AXXXXT1234E" + new Date().getFullYear() + Math.floor(Math.random() * 1000000);
  
  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold">Filing Successful!</h1>
        <p className="text-gray-600 mt-2">Your tax return has been successfully submitted</p>
      </div>
      
      <Card className="shadow-lg mb-8">
        <CardHeader className="bg-green-50">
          <CardTitle className="text-center text-green-700">e-Filing Acknowledgment</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Acknowledgment Number:</span>
              <span>{acknowledgmentNumber}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Assessment Year:</span>
              <span>2023-24</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Form Type:</span>
              <span>ITR-1</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Filing Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Filing Status:</span>
              <span className="text-green-600 font-semibold">Successful</span>
            </div>
            
            <div className="flex justify-between border-b pb-2">
              <span className="font-medium">Processing Status:</span>
              <span className="text-yellow-600">Under Processing</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Refund Status:</span>
              <span className="text-yellow-600">Pending</span>
            </div>
          </div>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" /> Download Acknowledgment
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Printer className="h-4 w-4" /> Print Acknowledgment
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> View Full Return
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 mb-8">
        <h3 className="text-lg font-medium text-blue-800 mb-2">What's Next?</h3>
        <ul className="space-y-2">
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">1</span>
            <span>Your return will be processed by the Income Tax Department, which may take 2-3 months.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">2</span>
            <span>If a refund is due, it will be directly credited to your bank account within 1-3 months.</span>
          </li>
          <li className="flex items-start">
            <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold mr-2 mt-0.5">3</span>
            <span>You will receive email notifications about any updates to your return processing status.</span>
          </li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setLocation("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" /> Return to Home
        </Button>
      </div>
    </div>
  );
}