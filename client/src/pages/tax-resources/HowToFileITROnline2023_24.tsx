import { ArrowLeft, ArrowRight, FileText as FileTextIcon } from 'lucide-react';
import React from 'react';
import { Link } from 'wouter';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const HowToFileITROnline2023_24 = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tax-resources">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Tax Resources
          </Link>
        </Button>
        <Badge variant="outline" className="ml-auto">Assessment Year 2023-24</Badge>
      </div>
      
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <FileTextIcon className="h-7 w-7 text-primary" />
            How to File ITR Online in India for 2023-24
          </h1>
          <p className="text-muted-foreground text-lg">
            Filing your Income Tax Return (ITR) online in India is now easier than ever. Whether you're a salaried individual or a business owner, this guide will walk you through the process for the assessment year 2023-24.
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Why File ITR Online?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>Convenience: File from anywhere, anytime.</li>
              <li>Speed: Get faster refunds with e-filing.</li>
              <li>Accuracy: Avoid manual errors with pre-filled forms.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Steps to File ITR Online</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-3 pl-5">
              <li>
                <strong>Visit the Official Portal:</strong> Go to <a href="https://incometax.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">incometax.gov.in</a>.
              </li>
              <li>
                <strong>Register/Login:</strong> Use your PAN as the user ID and set a password.
              </li>
              <li>
                <strong>Choose ITR Form:</strong> Select ITR-1 for salaried individuals or ITR-4 for presumptive business income. You can <Link href="/itr-forms-guide" className="text-primary underline hover:text-primary/80 transition-colors">learn more about ITR Forms here</Link>.
              </li>
              <li>
                <strong>Fill Details:</strong> Enter income, deductions (e.g., Section 80C), and tax paid.
              </li>
              <li>
                <strong>E-Verify:</strong> Verify using Aadhaar OTP or net banking.
              </li>
              <li>
                <strong>Submit:</strong> Download the acknowledgment (ITR-V).
              </li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Deadlines for AY 2023-24</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li><strong>July 31, 2023:</strong> Last date for ITR filing without penalty.</li>
              <li><strong>December 31, 2023:</strong> Last date with late fees.</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Note: These deadlines were for the Assessment Year 2023-24. Always check the official Income Tax portal for current year deadlines.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tips for Hassle-Free Filing</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc space-y-2 pl-5">
              <li>Keep your PAN, Aadhaar, and Form 16 ready.</li>
              <li>Double-check bank details for refunds.</li>
              <li>Use our free <Link href="/calculators" className="text-primary underline hover:text-primary/80 transition-colors">tax calculator</Link> to estimate your liability.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center mt-8 bg-primary/5 p-6 rounded-lg">
          <p className="text-lg mb-4 text-primary-foreground">
            Start filing your ITR today with MyeCA.in for a seamless expert eCA experience!
          </p>
          <Button asChild size="lg">
            <Link href="/start-filing"> 
              Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowToFileITROnline2023_24;
