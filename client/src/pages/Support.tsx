import { MessageSquare, Mail, Phone, Clock } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


const Support = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-[#ADB5BD]">
          Have questions about your taxes? We're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Live Chat</h3>
              <p className="text-[#ADB5BD] mb-4">
                Chat with our tax experts in real-time for immediate assistance.
              </p>
              <Button>Start Chat</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email Support</h3>
              <p className="text-[#ADB5BD] mb-4">
                Send us an email and we'll respond within 24 hours.
              </p>
              <Button variant="outline">support@easytax.com</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone Support</h3>
              <p className="text-[#ADB5BD] mb-4">
                Call us directly to speak with a tax professional.
              </p>
              <Button variant="outline">1-800-TAX-HELP</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find quick answers to common tax questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    When is the tax filing deadline?
                  </AccordionTrigger>
                  <AccordionContent>
                    For most individuals, the federal tax filing deadline is April 15th. 
                    If this date falls on a weekend or holiday, the deadline is extended 
                    to the next business day. You can request a six-month extension if 
                    you need more time, but any taxes owed are still due by the original deadline.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How long does it take to receive my tax refund?
                  </AccordionTrigger>
                  <AccordionContent>
                    Most e-filed returns with direct deposit are processed within 21 days. 
                    Paper returns typically take 6-8 weeks. You can check your refund status 
                    on the IRS website using the "Where's My Refund" tool approximately 24 hours 
                    after e-filing or 4 weeks after mailing a paper return.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    What documents do I need to file my taxes?
                  </AccordionTrigger>
                  <AccordionContent>
                    Common documents include: W-2 forms from employers, 1099 forms for other income, 
                    Social Security numbers for you and dependents, receipts for deductible expenses, 
                    last year's tax return, and bank account information for direct deposit. 
                    Additional documents may be needed depending on your specific situation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Can I file my taxes for free?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, if your adjusted gross income is below $73,000, you can use the IRS Free File program. 
                    EasyTax offers a free filing option for simple tax returns. State tax returns may have 
                    additional fees depending on your situation and location.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What if I make a mistake on my tax return?
                  </AccordionTrigger>
                  <AccordionContent>
                    If you discover an error after filing, you can file an amended return using Form 1040-X. 
                    Depending on the mistake, the IRS may correct simple math errors automatically or 
                    contact you if more information is needed. It's best to file an amendment as soon as 
                    you discover a significant error.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
              <CardDescription>
                Send us your question or concern
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="first-name" className="text-sm font-medium">
                      First Name
                    </label>
                    <Input id="first-name" placeholder="First Name" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="last-name" className="text-sm font-medium">
                      Last Name
                    </label>
                    <Input id="last-name" placeholder="Last Name" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" placeholder="your@email.com" type="email" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or issue in detail"
                    rows={4}
                  />
                </div>
                <Button className="w-full">Submit</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4">Support Hours</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Monday - Friday</h4>
                    <p className="text-[#ADB5BD]">8:00 AM - 8:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Saturday</h4>
                    <p className="text-[#ADB5BD]">9:00 AM - 5:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Sunday</h4>
                    <p className="text-[#ADB5BD]">Closed</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#ADB5BD]">
                <strong>Note:</strong> Extended hours are available during tax season
                (January - April).
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Tax Professionals</h3>
              <p className="mb-4">
                Need specialized tax advice? Our certified tax professionals 
                are available for one-on-one consultations.
              </p>
              <div className="bg-background p-4 rounded-md">
                <h4 className="font-medium mb-2">Premium Support Plans</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-secondary mr-2"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Priority support with faster response times
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-secondary mr-2"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Direct access to tax professionals
                  </li>
                  <li className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 text-secondary mr-2"
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                    Audit assistance and representation
                  </li>
                </ul>
              </div>
              <Button className="mt-4">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
