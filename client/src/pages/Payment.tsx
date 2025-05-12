import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, CreditCard, Building, Lock } from "lucide-react";

export default function Payment() {
  const [location, setLocation] = useLocation();
  const [paymentMethod, setPaymentMethod] = useState<string>("netbanking");
  const [processingPayment, setProcessingPayment] = useState<boolean>(false);
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: ""
  });

  // Get the payment method from URL if specified
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const method = searchParams.get("method");
    if (method && (method === "netbanking" || method === "upi" || method === "card")) {
      setPaymentMethod(method);
    }
  }, []);

  const handlePayment = () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setLocation("/filing-complete");
    }, 2000);
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Complete Your Payment</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="font-medium">Amount Payable</p>
              <p className="text-sm text-gray-600">Tax Assessment Year 2023-24</p>
            </div>
            <div className="text-2xl font-bold text-blue-800">₹2,400</div>
          </div>
          
          <Tabs defaultValue={paymentMethod} className="w-full" onValueChange={setPaymentMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="netbanking"><Building className="mr-2 h-4 w-4" /> Net Banking</TabsTrigger>
              <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" /> Credit Card</TabsTrigger>
              <TabsTrigger value="upi"><Check className="mr-2 h-4 w-4" /> UPI</TabsTrigger>
            </TabsList>
            
            <TabsContent value="netbanking" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${selectedBank === "sbi" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  onClick={() => setSelectedBank("sbi")}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/State_Bank_of_India_logo.svg/2560px-State_Bank_of_India_logo.svg.png" 
                       alt="SBI" 
                       className="h-10 w-auto mb-2" />
                  <p className="text-sm font-medium">State Bank of India</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${selectedBank === "hdfc" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  onClick={() => setSelectedBank("hdfc")}
                >
                  <img src="https://1000logos.net/wp-content/uploads/2021/06/HDFC-Bank-emblem.png" 
                       alt="HDFC" 
                       className="h-10 w-auto mb-2" />
                  <p className="text-sm font-medium">HDFC Bank</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${selectedBank === "icici" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  onClick={() => setSelectedBank("icici")}
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/ICICI_Bank_Logo.svg/1280px-ICICI_Bank_Logo.svg.png" 
                       alt="ICICI" 
                       className="h-10 w-auto mb-2" />
                  <p className="text-sm font-medium">ICICI Bank</p>
                </div>
                
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${selectedBank === "axis" ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                  onClick={() => setSelectedBank("axis")}
                >
                  <img src="https://companieslogo.com/img/orig/AXISBANK.NS-d00aca68.png" 
                       alt="Axis" 
                       className="h-10 w-auto mb-2" />
                  <p className="text-sm font-medium">Axis Bank</p>
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800 mt-4" 
                onClick={handlePayment}
                disabled={!selectedBank || processingPayment}
              >
                {processingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input 
                    id="cardNumber" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input 
                    id="cardName" 
                    placeholder="John Doe" 
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Expiry Date</Label>
                    <Input 
                      id="cardExpiry" 
                      placeholder="MM/YY" 
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardCvv">CVV</Label>
                    <Input 
                      id="cardCvv" 
                      placeholder="123" 
                      type="password" 
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Lock className="h-4 w-4 mr-2" /> Your payment information is secure
              </div>
              
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800 mt-4" 
                onClick={handlePayment}
                disabled={
                  !cardDetails.number || !cardDetails.name || 
                  !cardDetails.expiry || !cardDetails.cvv || 
                  processingPayment
                }
              >
                {processingPayment ? "Processing..." : "Pay Now"}
              </Button>
            </TabsContent>
            
            <TabsContent value="upi" className="space-y-4 mt-4">
              <div className="text-center p-4">
                <img 
                  src="https://qrcg-free-editor.qr-code-generator.com/main/assets/images/websiteQRCode_noFrame.png" 
                  alt="UPI QR Code" 
                  className="mx-auto h-48 w-auto mb-4"
                />
                <p className="text-sm text-gray-600 mb-4">Scan this QR code with any UPI app like Paytm, Google Pay, PhonePe, etc.</p>
                
                <div className="space-y-2">
                  <Label htmlFor="upiId">Or enter UPI ID</Label>
                  <Input id="upiId" placeholder="yourname@upi" />
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-700 hover:bg-blue-800" 
                onClick={handlePayment}
                disabled={processingPayment}
              >
                {processingPayment ? "Processing..." : "Verify & Pay"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => setLocation("/start-filing")}>
          Back to Filing
        </Button>
      </div>
    </div>
  );
}