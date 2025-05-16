import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  User, 
  Send, 
  RefreshCcw, 
  Minimize2, 
  X, 
  MessageSquareHeart 
} from "lucide-react";
import { Link } from "wouter";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const welcomeMessage = `Hi! I'm TaxGuru, your Indian tax expert. I can help with:

• Understanding tax deductions
• Filing requirements and deadlines
• Tax calculation questions
• And much more!

How can I assist you today?`;

const TaxExpertWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      content: welcomeMessage,
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{configured: boolean, message: string} | null>(null);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Check API configuration status when widget is opened
  useEffect(() => {
    const checkApiStatus = async () => {
      if (isOpen && !apiStatus) {
        try {
          const response = await apiRequest("GET", "/api/tax-expert-chat/status");
          const statusData = response as { configured: boolean; message: string; error?: string };
          setApiStatus(statusData);
          
          if (!statusData.configured) {
            console.log("API not configured:", statusData.message);
            setMessages(prev => [
              ...prev,
              {
                content: "I'm currently unavailable due to a configuration issue. Please try again later.",
                sender: "bot",
                timestamp: new Date()
              }
            ]);
          }
        } catch (error) {
          console.error("Error checking API status:", error);
        }
      }
    };
    
    checkApiStatus();
  }, [isOpen, apiStatus]);

  // Scroll to bottom of messages whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    const userMessage = {
      content: inputValue.trim(),
      sender: "user" as const,
      timestamp: new Date()
    };
    
    setInputValue("");
    setIsLoading(true);
    
    try {
      setMessages(prev => [...prev, userMessage]);
      
      const response = await apiRequest(
        "POST",
        "/api/tax-expert-chat", 
        { message: userMessage.content }
      );
      
      // apiRequest already returns the parsed JSON data
      const data = response;
      
      if (data.response) {
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
      
      let errorMsg = "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
      
      if (error instanceof Error && error.message) {
        console.log("Detailed error:", error.message);
        errorMsg += "\n\nError details: " + error.message.substring(0, 200);
      }
      
      setMessages(prev => [
        ...prev, 
        {
          content: errorMsg,
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
  };

  const toggleChat = () => {
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const expandChat = () => {
    setIsMinimized(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  // Format timestamp to show only hour and minute
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              onClick={toggleChat}
              className="h-14 w-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
            >
              <MessageSquareHeart className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={isMinimized 
              ? { opacity: 1, y: 0, scale: 0.8, height: "auto" } 
              : { opacity: 1, y: 0, scale: 1, height: "auto" }
            }
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`bg-white rounded-lg shadow-xl border border-blue-200 overflow-hidden ${
              isMinimized ? "w-72" : "w-80 md:w-96"
            }`}
          >
            {/* Chat header */}
            <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <h3 className="font-semibold">
                  {isMinimized ? "TaxGuru" : "TaxGuru - Tax Expert"}
                </h3>
              </div>
              <div className="flex items-center gap-1">
                {isMinimized ? (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={expandChat}
                    className="h-6 w-6 text-white hover:bg-blue-500"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={minimizeChat}
                    className="h-6 w-6 text-white hover:bg-blue-500"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-6 w-6 text-white hover:bg-blue-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Minimized View */}
            {isMinimized && (
              <div className="p-3 text-sm">
                <p>Ask me any tax-related question!</p>
              </div>
            )}

            {/* Full Chat View */}
            {!isMinimized && (
              <>
                {/* Messages area */}
                <ScrollArea className="h-80 p-3">
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.sender === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex items-start max-w-[85%]">
                          <div
                            className={`
                              p-2 rounded-lg shadow-sm flex flex-col gap-1
                              ${
                                message.sender === "user"
                                  ? "bg-blue-600 text-white rounded-br-none"
                                  : "bg-gray-100 text-gray-800 rounded-bl-none"
                              }
                            `}
                          >
                            <div className="flex items-center gap-2 mb-0.5">
                              {message.sender === "user" ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                              <span className="text-xs font-semibold">
                                {message.sender === "user" ? "You" : "TaxGuru"}
                              </span>
                              <span className="text-xs opacity-70 ml-auto">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                              {message.content}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />

                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="flex items-start">
                          <div className="bg-gray-100 p-2 rounded-lg shadow-sm flex items-center gap-2 text-gray-500 text-sm rounded-bl-none">
                            <RefreshCcw className="h-3 w-3 animate-spin" />
                            <span>TaxGuru is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input area */}
                <div className="border-t p-2 flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder={apiStatus && !apiStatus.configured 
                      ? "Service unavailable..." 
                      : "Ask a tax question..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || Boolean(apiStatus && !apiStatus.configured)}
                    className="flex-1 text-sm h-8"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || Boolean(apiStatus && !apiStatus.configured)}
                    className="h-8 px-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetConversation}
                    title="Reset conversation"
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCcw className="h-3 w-3" />
                  </Button>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-2 text-center">
                  <Link href="/tax-expert">
                    <span className="text-xs text-blue-600 hover:underline">
                      Open full Tax Expert
                    </span>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaxExpertWidget;