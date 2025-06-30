import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert('Test button clicked!');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-3xl font-bold text-blue-600">SmartTaxPro</h1>
      <p className="mt-4 text-gray-700">Welcome to SmartTaxPro - Your Tax Filing Solution</p>
      <Button 
        className="mt-4"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Test Button'} 
        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
    </div>
  );
};

export default Home;
