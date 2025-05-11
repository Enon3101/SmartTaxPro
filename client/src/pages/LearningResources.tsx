import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  FileText, 
  Lightbulb, 
  HelpCircle,
  Pencil,
  Youtube,
  BarChart3,
  ScrollText,
  GraduationCap,
  BookMarked
} from "lucide-react";

const LearningResources = () => {
  // Tax guides data
  const taxGuides = [
    {
      id: "new-vs-old-regime",
      title: "New vs Old Tax Regime: Which Should You Choose?",
      description: "Understand the differences between the new and old tax regimes in India, and determine which option might save you more tax based on your income and investments.",
      image: "/guides/tax-regime-guide.jpg",
      category: "Tax Planning"
    },
    {
      id: "section-80c-80u",
      title: "Tax Benefits Under Section 80C to 80U",
      description: "Explore the comprehensive list of deductions available under various subsections from 80C to 80U, including investments, insurance, and medical expenses.",
      image: "/guides/tax-deductions.jpg",
      category: "Deductions"
    },
    {
      id: "gst-for-business",
      title: "GST for Small Businesses & Professionals",
      description: "Navigate the Goods and Services Tax framework for small businesses, freelancers, and professionals. Learn about registration, filing requirements, and input tax credits.",
      image: "/guides/gst-guide.jpg",
      category: "GST"
    },
    {
      id: "nps-elss-benefits",
      title: "Tax Benefits for NPS and ELSS Investments",
      description: "Discover the tax advantages of investing in National Pension System (NPS) and Equity-Linked Savings Schemes (ELSS) under Indian tax laws.",
      image: "/guides/investment-tax-benefits.jpg",
      category: "Investments"
    }
  ];

  // Capital Gains guides data
  const capitalGainsGuides = [
    {
      id: "understanding-capital-gains",
      title: "Understanding Capital Gains Tax in India",
      description: "Learn the basics of capital gains tax in India, including the difference between short-term and long-term capital gains, and how they are taxed.",
      category: "Basics"
    },
    {
      id: "stocks-mutual-funds",
      title: "Capital Gains on Stocks and Mutual Funds",
      description: "Understand how capital gains tax applies to your investments in stocks and mutual funds, and strategies to minimize your tax liability.",
      category: "Equity"
    },
    {
      id: "real-estate-capital-gains",
      title: "Capital Gains Tax on Real Estate",
      description: "Learn about capital gains tax implications when selling property, and how to use exemptions under Section 54 and 54F.",
      category: "Real Estate"
    },
    {
      id: "capital-gains-indexation",
      title: "Indexation Benefits for Long-Term Capital Gains",
      description: "Understand how indexation can help reduce your tax liability on long-term capital gains from debt funds and property.",
      category: "Tax Planning"
    },
    {
      id: "foreign-assets",
      title: "Capital Gains on Foreign Assets",
      description: "Learn about tax implications for Indian residents selling assets located outside India, including foreign stocks and property.",
      category: "International"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Learning Resources</h1>
        <p className="text-muted-foreground">
          Educational resources and guides to help you understand tax concepts and investment strategies.
        </p>
      </div>

      <Tabs defaultValue="tax-guides" className="w-full mb-12">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tax-guides">Tax Guides</TabsTrigger>
          <TabsTrigger value="capital-gains">Capital Gains Learning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tax-guides">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {taxGuides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden hover:shadow-md transition-all">
                <div className="aspect-video bg-muted dark:bg-muted/40 flex items-center justify-center">
                  <BookOpen className="h-12 w-12 text-primary/70" />
                </div>
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      {guide.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{guide.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{guide.description}</p>
                  <Link href={`/learning/${guide.id}`}>
                    <div className="text-primary font-medium hover:underline">Read Full Guide →</div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/learning">
              <Button variant="outline" size="lg" className="mt-4">
                View All Tax Guides
              </Button>
            </Link>
          </div>
        </TabsContent>
        
        <TabsContent value="capital-gains">
          <div className="flex flex-col space-y-6">
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-6 border border-border mb-8">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Capital Gains Learning Center</h2>
                  <p className="text-muted-foreground mb-4">
                    Understanding capital gains tax is crucial for investors. Explore our comprehensive guides to learn about taxation of different asset classes, holding periods, and strategies to optimize your tax liability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Stocks
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Mutual Funds
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Real Estate
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Gold
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Debt
                    </span>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                      Foreign Assets
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capitalGainsGuides.map((guide, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-3">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{guide.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm flex-grow">{guide.description}</p>
                    <Link href={`/learning/capital-gains/${guide.id}`}>
                      <div className="text-primary font-medium hover:underline">Read More →</div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <Link href="/import-cg">
                <Button className="mt-4">
                  Import Capital Gains Data
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Featured Resources */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Learning Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-muted p-6 flex justify-center">
              <BookMarked className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tax Ebooks & Guides</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Download our comprehensive tax guides, ebooks, and checklists to navigate your tax filing journey.
              </p>
              <Link href="/learning/ebooks">
                <div className="text-primary font-medium hover:underline">Browse Library →</div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-muted p-6 flex justify-center">
              <Youtube className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Video Tutorials</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Visual learner? Watch our video tutorials explaining complex tax concepts in simple terms.
              </p>
              <Link href="/learning/videos">
                <div className="text-primary font-medium hover:underline">Watch Now →</div>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-muted p-6 flex justify-center">
              <GraduationCap className="h-16 w-16 text-primary/70" />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Tax Webinars</h3>
              <p className="text-muted-foreground mb-4 text-sm">
                Join our expert-led webinars on tax planning, investment strategies, and regulatory updates.
              </p>
              <Link href="/learning/webinars">
                <div className="text-primary font-medium hover:underline">View Schedule →</div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Box */}
      <Card className="bg-primary/5 border-0 mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="mb-6 md:mb-0 md:mr-8">
              <HelpCircle className="h-12 w-12 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Need Personalized Tax Guidance?</h3>
              <p className="text-muted-foreground mb-4">
                Our tax experts are ready to help you navigate complex Indian tax situations 
                and find the best solutions for your specific needs.
              </p>
              <Link href="/support" className="text-primary hover:underline font-medium">
                Contact Our Tax Experts →
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningResources;