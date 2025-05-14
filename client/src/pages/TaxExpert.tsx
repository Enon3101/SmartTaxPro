import { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { 
  Send, 
  Bot, 
  RefreshCcw, 
  User,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const welcomeMessage = `Hi! I'm TaxGuru, your personal Indian tax expert. I can help you with:

• Understanding tax deductions (80C, 80D, 80TTA, etc.)
• Filing requirements and deadlines
• Tax slabs and calculations
• ITR forms selection
• Tax saving strategies
• And much more!

What tax-related question do you have today?`;

const TaxExpert = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      content: welcomeMessage,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when component loads
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      content: inputValue.trim(),
      sender: "user" as const,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const response = await apiRequest("POST", "/api/tax-expert-chat", {
        message: userMessage.content
      } as any);
      
      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [
          ...prev, 
          {
            content: data.response,
            sender: "bot",
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response from the tax expert. Please try again.",
        variant: "destructive"
      });
      
      setMessages(prev => [
        ...prev, 
        {
          content: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
          sender: "bot",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const resetConversation = () => {
    setMessages([
      {
        content: welcomeMessage,
        sender: "bot",
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Conversation Reset",
      description: "Starting a new conversation with TaxGuru."
    });
  };

  // Format timestamp to show only hour and minute
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto mt-8 pb-12">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main chat section */}
        <Card className="col-span-1 lg:col-span-4 border-blue-200 shadow-lg">
          <CardHeader className="border-b bg-blue-50">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-blue-500 mr-2" />
              <div>
                <CardTitle className="text-blue-700">TaxGuru - Indian Tax Expert</CardTitle>
                <CardDescription>Ask any questions about Indian income tax laws, deductions, ITR filing</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="flex items-start max-w-[80%]">
                      <div 
                        className={`
                          p-3 rounded-lg shadow-sm flex flex-col gap-1
                          ${message.sender === "user" 
                            ? "bg-blue-600 text-white rounded-br-none" 
                            : "bg-gray-100 text-gray-800 rounded-bl-none"}
                        `}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {message.sender === "user" ? (
                            <User className="h-4 w-4" />
                          ) : (
                            <Bot className="h-4 w-4" />
                          )}
                          <span className="text-xs font-semibold">
                            {message.sender === "user" ? "You" : "TaxGuru"}
                          </span>
                          <span className="text-xs opacity-70 ml-auto">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-3 rounded-lg shadow-sm flex items-center gap-2 text-gray-500 rounded-bl-none">
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                        <span>TaxGuru is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <div className="flex items-center w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="Ask a question about Indian income tax..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={resetConversation}
                title="Reset conversation"
              >
                <RefreshCcw className="h-4 w-4" />
                <span className="sr-only">Reset</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {/* Sidebar with tips */}
        <div className="col-span-1 space-y-4">
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                Example Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="space-y-2">
                <li className="p-2 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                  What are the tax slabs for AY 2026-27?
                </li>
                <li className="p-2 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                  How much can I claim under section 80C?
                </li>
                <li className="p-2 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                  What is the difference between old and new tax regime?
                </li>
                <li className="p-2 bg-blue-50 rounded-md hover:bg-blue-100 cursor-pointer transition-colors">
                  Which ITR form should I use as a salaried employee?
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Popular Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Section 80C</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">HRA Exemption</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">ITR Filing</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Tax Saving</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Income Tax Refund</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Standard Deduction</Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer">Capital Gains</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200">
            <CardContent className="pt-4">
              <p className="text-sm text-muted-foreground">
                This expert uses AI to provide information about Indian tax laws. The responses are for informational purposes only and should not be considered as legal or tax advice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaxExpert;