import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  User, 
  Send, 
  RefreshCcw, 
  Minimize2, 
  X, 
  MessageSquareHeart,
  ThumbsUp,
  ThumbsDown,
  Shield,
  HelpCircle
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import ReactMarkdown from 'react-markdown';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  id: string; // Unique identifier for each message
  feedback?: "positive" | "negative";
}

interface ChatSession {
  messages: Message[];
  lastActive: Date;
}

// PII patterns to detect and encrypt
const PII_PATTERNS = {
  PAN: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g,
  AADHAAR: /\d{4}\s\d{4}\s\d{4}/g,
  PHONE: /\+91[\s-]?\d{10}/g
};

// Simple encryption function (in production, use a proper encryption library)
const encryptPII = (text: string): string => {
  let result = text;
  Object.entries(PII_PATTERNS).forEach(([type, pattern]) => {
    result = result.replace(pattern, match => `[REDACTED ${type}]`);
  });
  return result;
};

// Suggested questions to help users get started
const SUGGESTED_QUESTIONS = [
  "What are the tax slabs for FY 2024-25?",
  "How do I claim HRA exemption?",
  "What is the deadline for filing ITR this year?",
  "What documents do I need for filing ITR?",
  "How can I save tax under section 80C?"
];

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<{configured: boolean, message: string} | null>(null);
  const [hasConsented, setHasConsented] = useState(false);
  const [showConsentPrompt, setShowConsentPrompt] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Load conversation from localStorage on initial render
  useEffect(() => {
    try {
      const savedSession = localStorage.getItem('taxExpertChat');
      if (savedSession) {
        const session: ChatSession = JSON.parse(savedSession);
        // Only restore if session is less than 24 hours old
        const lastActive = new Date(session.lastActive);
        const now = new Date();
        const hoursSinceActive = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
        
        if (hoursSinceActive < 24) {
          setMessages(session.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })));
          setHasConsented(true);
        } else {
          // Session expired, start fresh
          initializeChat();
        }
      } else {
        initializeChat();
      }
    } catch (error) {
      console.error("Error loading chat session:", error);
      initializeChat();
    }
  }, []);
  
  // Initialize chat with welcome message
  const initializeChat = () => {
    setMessages([
      {
        id: generateMessageId(),
        content: welcomeMessage,
        sender: "bot",
        timestamp: new Date()
      }
    ]);
    setShowConsentPrompt(true);
  };
  
  // Save conversation to localStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0 && hasConsented) {
      const session: ChatSession = {
        messages,
        lastActive: new Date()
      };
      localStorage.setItem('taxExpertChat', JSON.stringify(session));
    }
  }, [messages, hasConsented]);

  // Check API configuration status when widget is opened
  useEffect(() => {
    const checkApiStatus = async () => {
      if (isOpen && !apiStatus) {
        try {
          const response = await fetch("/api/tax-expert-chat/status", {
            method: "GET",
            credentials: "include"
          });
          
          if (!response.ok) {
            throw new Error(`API status check failed: ${response.status}`);
          }
          
          const responseData = await response.json();
          setApiStatus(responseData);
          
          if (!responseData.configured) {
            console.log("API not configured:", responseData.message);
            setMessages(prev => [
              ...prev,
              {
                id: generateMessageId(),
                content: "I'm currently unavailable due to a configuration issue. Please try again later.",
                sender: "bot" as const,
                timestamp: new Date()
              }
            ]);
          }
        } catch (error) {
          console.error("Error checking API status:", error);
          // Log to monitoring service
          logError("API status check failed", { error });
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

  // Generate a unique ID for each message
  const generateMessageId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  };

  // Log errors to monitoring service
  const logError = (message: string, context: any) => {
    // In production, this would send to a monitoring service like Sentry
    console.error(`[TaxExpertWidget] ${message}`, context);
    
    // Example of how this would work with a monitoring service:
    // if (typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.captureException(new Error(message), {
    //     extra: context
    //   });
    // }
  };

  // Log user interactions for audit purposes
  const logUserInteraction = (action: string, details: any) => {
    // In production, this would send to a secure audit log
    console.log(`[AUDIT] ${action}`, {
      timestamp: new Date().toISOString(),
      sessionId: localStorage.getItem('sessionId') || 'unknown',
      // Don't log PII
      ...details
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    if (!hasConsented) {
      setShowConsentPrompt(true);
      return;
    }
    
    const messageId = generateMessageId();
    const userMessage = {
      id: messageId,
      content: inputValue.trim(),
      sender: "user" as const,
      timestamp: new Date()
    };
    
    setInputValue("");
    setIsLoading(true);
    
    // Log the interaction (without the actual message content for privacy)
    logUserInteraction("send_message", { messageId });
    
    try {
      setMessages(prev => [...prev, userMessage]);
      
      // Check for and encrypt any PII before sending
      const sanitizedMessage = encryptPII(userMessage.content);
      
      const startTime = Date.now();
      const response = await fetch("/api/tax-expert-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: sanitizedMessage }),
        credentials: "include"
      });
      const responseTime = Date.now() - startTime;
      
      // Log performance metrics
      console.log(`[PERF] API response time: ${responseTime}ms`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.response) {
        // Make sure bot responses are not undefined
        const botResponse: string = data.response || "Sorry, I couldn't generate a response.";
        const botMessageId = generateMessageId();
        
        setMessages(prev => [
          ...prev, 
          {
            id: botMessageId,
            content: botResponse,
            sender: "bot",
            timestamp: new Date()
          }
        ]);
        
        // Log the bot response (without content)
        logUserInteraction("receive_response", { messageId: botMessageId, responseTime });
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      logError("Message send failed", { error });
      
      let errorMsg = "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.";
      
      if (error instanceof Error && error.message) {
        console.log("Detailed error:", error.message);
        errorMsg += "\n\nError details: " + error.message.substring(0, 200);
      }
      
      setMessages(prev => [
        ...prev, 
        {
          id: generateMessageId(),
          content: errorMsg,
          sender: "bot" as const,
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
    logUserInteraction("reset_conversation", {});
    
    setMessages([
      {
        id: generateMessageId(),
        content: welcomeMessage,
        sender: "bot",
        timestamp: new Date()
      }
    ]);
  };

  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    setIsMinimized(false);
    
    logUserInteraction(newIsOpen ? "open_chat" : "close_chat", {});
  };

  const minimizeChat = () => {
    setIsMinimized(true);
    logUserInteraction("minimize_chat", {});
  };

  const expandChat = () => {
    setIsMinimized(false);
    logUserInteraction("expand_chat", {});
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  // Handle message feedback
  const handleFeedback = (messageId: string, type: "positive" | "negative") => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, feedback: type } : msg
      )
    );
    
    logUserInteraction("message_feedback", { messageId, feedbackType: type });
    
    toast({
      description: type === "positive" 
        ? "Thanks for your positive feedback!" 
        : "Thanks for your feedback. We'll work to improve our responses.",
      duration: 3000
    });
  };

  // Handle suggested question click
  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
    inputRef.current?.focus();
  };

  // Handle consent checkbox change
  const handleConsentChange = (checked: boolean) => {
    setHasConsented(checked);
    if (checked) {
      setShowConsentPrompt(false);
      logUserInteraction("consent_given", {});
    }
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
                {/* Consent Alert */}
                {showConsentPrompt && (
                  <Alert className="m-3 bg-blue-50 border-blue-200">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="text-xs">
                      <div className="flex items-start gap-2 mt-1">
                        <Checkbox 
                          id="consent" 
                          checked={hasConsented}
                          onCheckedChange={handleConsentChange}
                        />
                        <label htmlFor="consent" className="text-xs cursor-pointer">
                          I consent to the processing and storage of my chat data in accordance with the 
                          <Link href="/privacy-policy">
                            <span className="text-blue-600 hover:underline">Privacy Policy</span>
                          </Link>.
                        </label>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Messages area */}
                <ScrollArea className="h-80 p-3">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
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
                              {message.sender === "bot" ? (
                                <ReactMarkdown className="prose prose-sm max-w-none">
                                  {message.content}
                                </ReactMarkdown>
                              ) : (
                                message.content
                              )}
                            </div>
                            
                            {/* Feedback buttons for bot messages */}
                            {message.sender === "bot" && !message.feedback && (
                              <div className="flex justify-end gap-2 mt-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full hover:bg-green-100"
                                  onClick={() => handleFeedback(message.id, "positive")}
                                >
                                  <ThumbsUp className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 rounded-full hover:bg-red-100"
                                  onClick={() => handleFeedback(message.id, "negative")}
                                >
                                  <ThumbsDown className="h-3 w-3 text-red-600" />
                                </Button>
                              </div>
                            )}
                            
                            {/* Show feedback confirmation */}
                            {message.sender === "bot" && message.feedback && (
                              <div className="flex justify-end mt-1">
                                <span className="text-xs text-gray-500">
                                  {message.feedback === "positive" ? "Helpful" : "Not helpful"}
                                </span>
                              </div>
                            )}
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
                    
                    {/* Suggested questions */}
                    {messages.length === 1 && messages[0].sender === "bot" && (
                      <div className="mt-4">
                        <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                        <div className="flex flex-wrap gap-2">
                          {SUGGESTED_QUESTIONS.map((question, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="text-xs py-1 h-auto text-left justify-start"
                              onClick={() => handleSuggestedQuestion(question)}
                            >
                              <HelpCircle className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate">{question}</span>
                            </Button>
                          ))}
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
                      : hasConsented ? "Ask a tax question..." : "Please consent to continue..."}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading || Boolean(apiStatus && !apiStatus.configured) || !hasConsented}
                    className="flex-1 text-sm h-8"
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim() || Boolean(apiStatus && !apiStatus.configured) || !hasConsented}
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