import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  User, 
  Tags, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail 
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Sample blog post data (to be replaced with API call)
const blogPostsData = [
  {
    id: 1,
    title: "How to Choose Between Old and New Tax Regimes in 2025",
    slug: "old-vs-new-tax-regime-2025",
    summary: "Understand the key differences between old and new tax regimes to make the best choice for your financial situation.",
    content: `<p>The choice between India's old and new tax regimes can significantly impact your tax liability. This article explores the key differences and helps you make an informed decision based on your financial situation.</p>
    
    <h2>The Old Tax Regime</h2>
    <p>Under the old tax regime, taxpayers are eligible for various deductions and exemptions, such as:</p>
    <ul>
      <li>Section 80C deductions (up to ₹1,50,000)</li>
      <li>Section 80D health insurance premium (up to ₹25,000 for self and family, additional ₹25,000 for parents)</li>
      <li>House Rent Allowance (HRA) exemptions</li>
      <li>Leave Travel Allowance (LTA) exemptions</li>
      <li>Standard deduction of ₹50,000 for salaried employees</li>
      <li>Interest on housing loan (up to ₹2,00,000 for self-occupied property)</li>
    </ul>
    
    <h2>The New Tax Regime</h2>
    <p>The new tax regime offers lower tax rates but requires taxpayers to forego most deductions and exemptions. Key features include:</p>
    <ul>
      <li>Lower tax rates across income slabs</li>
      <li>Standard deduction of ₹50,000 for salaried employees (starting from FY 2023-24)</li>
      <li>No deductions under Chapter VI-A (80C, 80D, etc.)</li>
      <li>No exemptions for HRA, LTA, etc.</li>
      <li>No deduction for interest on housing loan</li>
    </ul>
    
    <h2>Tax Rates Comparison (FY 2024-25)</h2>
    <p>Here's a comparison of tax rates under both regimes:</p>
    <table>
      <thead>
        <tr>
          <th>Income Slab</th>
          <th>Old Regime</th>
          <th>New Regime</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Up to ₹3,00,000</td>
          <td>Nil</td>
          <td>Nil</td>
        </tr>
        <tr>
          <td>₹3,00,001 to ₹5,00,000</td>
          <td>5%</td>
          <td>5%</td>
        </tr>
        <tr>
          <td>₹5,00,001 to ₹6,00,000</td>
          <td>20%</td>
          <td>5%</td>
        </tr>
        <tr>
          <td>₹6,00,001 to ₹7,50,000</td>
          <td>20%</td>
          <td>10%</td>
        </tr>
        <tr>
          <td>₹7,50,001 to ₹9,00,000</td>
          <td>20%</td>
          <td>10%</td>
        </tr>
        <tr>
          <td>₹9,00,001 to ₹10,00,000</td>
          <td>20%</td>
          <td>15%</td>
        </tr>
        <tr>
          <td>₹10,00,001 to ₹12,00,000</td>
          <td>30%</td>
          <td>15%</td>
        </tr>
        <tr>
          <td>₹12,00,001 to ₹15,00,000</td>
          <td>30%</td>
          <td>20%</td>
        </tr>
        <tr>
          <td>Above ₹15,00,000</td>
          <td>30%</td>
          <td>30%</td>
        </tr>
      </tbody>
    </table>
    
    <h2>Who Should Choose the Old Tax Regime?</h2>
    <p>The old tax regime may be beneficial for:</p>
    <ul>
      <li>Those who claim significant deductions through various sections</li>
      <li>Homeowners with housing loan interest</li>
      <li>Those who pay rent and claim HRA exemption</li>
      <li>Individuals with significant investments in tax-saving instruments</li>
    </ul>
    
    <h2>Who Should Choose the New Tax Regime?</h2>
    <p>The new tax regime may be advantageous for:</p>
    <ul>
      <li>Those with limited deductions and exemptions</li>
      <li>Young professionals who haven't made significant investments in tax-saving instruments</li>
      <li>Those who don't pay rent or have housing loans</li>
      <li>Individuals who prefer a simpler tax filing process</li>
    </ul>
    
    <h2>How to Calculate Which Regime Is Better</h2>
    <p>To determine which tax regime is better for you:</p>
    <ol>
      <li>Calculate your total income for the financial year</li>
      <li>List all eligible deductions and exemptions under the old regime</li>
      <li>Calculate tax liability under both regimes</li>
      <li>Compare and choose the regime with the lower tax liability</li>
    </ol>
    
    <p>Use our <a href="/calculators/income-tax">Income Tax Calculator</a> to quickly compare your tax liability under both regimes based on your specific situation.</p>
    
    <h2>Conclusion</h2>
    <p>The choice between the old and new tax regimes depends on your specific financial situation. Taxpayers with significant deductions may benefit from the old regime, while those with limited deductions might find the new regime more advantageous. It's recommended to calculate your tax liability under both regimes before making a decision.</p>`,
    authorId: 1,
    authorName: "Priya Sharma",
    authorBio: "Priya Sharma is a Chartered Accountant with over 10 years of experience in tax planning and advisory.",
    featuredImage: "/blog/tax-regime-comparison.jpg",
    category: "Tax Planning",
    tags: ["tax regime", "tax planning", "income tax"],
    readTime: 6,
    published: true,
    publishedAt: "2025-04-15T10:30:00Z",
    createdAt: "2025-04-10T14:25:00Z",
    updatedAt: "2025-04-15T09:15:00Z"
  }
];

const BlogPost = () => {
  const { slug } = useParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const articleRef = useRef<HTMLElement>(null);
  
  // Find the blog post by slug
  const post = blogPostsData.find(post => post.slug === slug);
  
  // Calculate reading progress on scroll
  useEffect(() => {
    const calculateReadingProgress = () => {
      if (articleRef.current) {
        const articleHeight = articleRef.current.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // How far the user has scrolled into the article
        const scrolled = scrollY - articleRef.current.offsetTop;
        
        // Total scrollable distance (total height minus window height)
        const scrollableHeight = articleHeight - windowHeight;
        
        // Calculate progress as a percentage, clamped between 0 and 100
        const progress = Math.max(0, Math.min(100, (scrolled / scrollableHeight) * 100));
        
        setReadingProgress(progress);
      }
    };
    
    window.addEventListener('scroll', calculateReadingProgress);
    calculateReadingProgress(); // Initial calculation
    
    return () => window.removeEventListener('scroll', calculateReadingProgress);
  }, []);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  if (!post) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The blog post you're looking for doesn't exist or may have been removed.
          </p>
          <Link href="/learning">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning Resources
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Reading progress bar - fixed at the top */}
      <div className="fixed top-[64px] left-0 w-full h-1 bg-gray-200 z-40">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>
      
      {/* Back button */}
      <div className="mb-6">
        <Link href="/learning">
          <Button variant="ghost" size="sm" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content */}
        <article className="flex-grow max-w-3xl mx-auto" ref={articleRef}>
          {/* Blog header */}
          <header className="mb-8">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 dark:bg-primary/20 text-primary rounded-md">
                {post.category}
              </span>
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-muted-foreground rounded-md">
                  {tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
            
            <p className="text-lg text-muted-foreground mb-6">{post.summary}</p>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
            </div>
          </header>
          
          {/* Blog content */}
          <div className="prose prose-blue max-w-none dark:prose-invert mb-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Author info */}
          <div className="border rounded-lg p-6 bg-muted/20">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 mr-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User className="h-8 w-8" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold">{post.authorName}</h3>
                <p className="text-sm text-muted-foreground">{post.authorBio}</p>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-2">
              <Tags className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <Link key={index} href={`/learning/tag/${tag}`}>
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Share buttons */}
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-2">
              <Share2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Share this article:</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>
        
        {/* Sidebar - Table of Contents with reading progress */}
        <aside className="w-full md:w-64 lg:w-80 order-first md:order-last">
          <div className="md:sticky md:top-[80px] bg-card p-5 rounded-lg border">
            <h4 className="font-semibold mb-4">Table of Contents</h4>
            <nav className="text-sm">
              <ul className="space-y-3">
                {post.content.match(/<h2>(.*?)<\/h2>/g)?.map((match, index) => {
                  const title = match.replace(/<h2>(.*?)<\/h2>/, '$1');
                  const slug = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-');
                  
                  // Calculate progress through article sections
                  const sectionProgress = Math.min(100, Math.max(0, 
                    (readingProgress - (index * (100 / (post.content.match(/<h2>/g)?.length || 1)))) 
                    * ((post.content.match(/<h2>/g)?.length || 1) / 100) * 3
                  ));
                  
                  return (
                    <li key={index} className="relative">
                      {/* Progress indicator */}
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-muted rounded-full">
                        <div 
                          className="bg-primary w-full rounded-full transition-all duration-200 ease-out"
                          style={{ height: `${sectionProgress}%` }}
                        />
                      </div>
                      
                      <a 
                        href={`#${slug}`}
                        className={`pl-4 inline-block hover:text-primary transition-colors ${
                          sectionProgress > 50 ? 'text-primary font-medium' : 'text-muted-foreground'
                        }`}
                      >
                        {title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            {/* Reading progress indicator */}
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Reading progress</span>
                <span className="font-medium">{Math.round(readingProgress)}%</span>
              </div>
              <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogPost;