import { ArrowRight, CheckCircle, Star, FileText, Calculator, CalendarDays, Upload, Bot, BadgeIndianRupee, Rocket, LifeBuoy } from "lucide-react";
import { useContext } from "react"; // React import first
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

import ExperienceHighlights from "@/components/ExperienceHighlights";
import TrustedBySection from "@/components/TrustedBySection";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext"; // Context imports after components
import { TaxDataContext } from "@/context/TaxDataProvider";


// Performance-optimized home page without heavy animations
const HomeSimplified = () => {
  const { t } = useTranslation();
  useAuth(); // Called useAuth without destructuring as its return values were unused
  const { assessmentYear, setAssessmentYear } = useContext(TaxDataContext);
  
  return (
    <div className="bg-background">
      <Helmet>
        <title>SmartTaxPro: Fast & Easy Online Income Tax Filing in India</title>
        <meta name="description" content="File your ITR online in minutes with SmartTaxPro. Our intelligent platform ensures maximum refund and 100% accuracy. Get started with AY 2025-26 filing now!" />
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/" /> {/* Replace with actual domain */}
        <meta property="og:title" content="SmartTaxPro: Fast & Easy Online Income Tax Filing in India" />
        <meta property="og:description" content="File your ITR online in minutes with SmartTaxPro. Our intelligent platform ensures maximum refund and 100% accuracy. Get started with AY 2025-26 filing now!" />
        <meta property="og:image" content="https://yourdomain.com/og-image-home.png" /> {/* Replace with actual image URL */}
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com/" /> {/* Replace with actual domain */}
        <meta property="twitter:title" content="SmartTaxPro: Fast & Easy Online Income Tax Filing in India" />
        <meta property="twitter:description" content="File your ITR online in minutes with SmartTaxPro. Our intelligent platform ensures maximum refund and 100% accuracy. Get started with AY 2025-26 filing now!" />
        <meta property="twitter:image" content="https://yourdomain.com/og-image-home.png" /> {/* Replace with actual image URL */}
      </Helmet>
      {/* Hero section */}
      <section className="py-10 md:py-16 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl text-blue-500 font-medium mb-4">
                {t('home.hero.subtitle')}
              </p>
              
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((item, index) => (
                  <div key={index}>
                    <Star 
                      className={`h-5 w-5 ${index < 4 ? "text-yellow-400 fill-yellow-400" : "text-yellow-400"}`} 
                      strokeWidth={index === 4 ? 1 : 2}
                    />
                  </div>
                ))}
                <span className="ml-2 text-muted-foreground">
                  {t('home.hero.reviews')}
                </span>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {t('home.hero.description')}
              </p>
              
              <div className="mb-6">
                <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
                  <CalendarDays className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="font-medium text-blue-700 mr-3">{t('home.hero.assessmentYearLabel')}</span>
                  <Select 
                    value={assessmentYear}
                    onValueChange={setAssessmentYear}
                  >
                    <SelectTrigger className="w-36 bg-white border-blue-300 focus:ring-blue-500">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                      <SelectItem value="2026-27">2026-27</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center sm:justify-start">
                <Link href="/start-filing">
                  <div className="inline-block">
                    <Button size="lg" className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600">
                      {t('home.buttons.startFiling')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </Link>
                <Link href="/filing-requirements">
                  <div className="inline-block">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      {t('home.buttons.whoShouldFile')}
                    </Button>
                  </div>
                </Link>
                <Link href="/pricing">
                  <div className="inline-block">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      {t('home.buttons.viewPricing')}
                    </Button>
                  </div>
                </Link>
              </div>
            </div>
            
            <div>
              <div className="rounded-lg p-6 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md border border-blue-100">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  {t('home.easySteps.title')}
                </h2>
                <div className="space-y-5">
                  {[
                    {
                      number: 1,
                      title: t('home.easySteps.step1Title'),
                      description: t('home.easySteps.step1Description')
                    },
                    {
                      number: 2,
                      title: t('home.easySteps.step2Title'),
                      description: t('home.easySteps.step2Description')
                    },
                    {
                      number: 3,
                      title: t('home.easySteps.step3Title'),
                      description: t('home.easySteps.step3Description')
                    },
                    {
                      number: 4,
                      title: t('home.easySteps.step4Title'),
                      description: t('home.easySteps.step4Description')
                    }
                  ].map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="font-semibold">{step.number}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation cards */}
      <section className="py-8 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              {
                href: "/start-filing",
                icon: <FileText className="h-6 w-6 text-blue-500" />,
                title: t('home.navigationCards.fileYourITRTitle'),
                description: t('home.navigationCards.fileYourITRDescription')
              },
              {
                href: "/pricing",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                ),
                title: t('home.navigationCards.pricingPlansTitle'),
                description: t('home.navigationCards.pricingPlansDescription')
              },
              {
                href: "/tax-resources",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                ),
                title: t('home.navigationCards.taxResourcesTitle'),
                description: t('home.navigationCards.taxResourcesDescription')
              },
              {
                href: "/tax-expert",
                icon: <Bot className="h-6 w-6 text-blue-500" />,
                title: t('home.navigationCards.aiExpertTitle'),
                description: t('home.navigationCards.aiExpertDescription')
              },
              {
                href: "/support",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                ),
                title: t('home.navigationCards.getSupportTitle'),
                description: t('home.navigationCards.getSupportDescription')
              }
            ].map((card, index) => (
              <div key={index}>
                <Link href={card.href}>
                  <div className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-border h-full flex flex-col justify-between cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Trusted by section - using the optimized component */}
      <TrustedBySection />
      
      {/* Easy ways to file section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">
            {t('home.easyWaysToFile.title')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Upload className="h-10 w-10 text-blue-500" />,
                title: t('home.easyWaysToFile.uploadForm16Title'),
                description: t('home.easyWaysToFile.uploadForm16Description')
              },
              {
                icon: <Calculator className="h-10 w-10 text-blue-500" />,
                title: t('home.easyWaysToFile.expertAssistedTitle'),
                description: t('home.easyWaysToFile.expertAssistedDescription')
              },
              {
                icon: <Bot className="h-10 w-10 text-blue-500" />,
                title: t('home.easyWaysToFile.aiAssistantTitle'),
                description: t('home.easyWaysToFile.aiAssistantDescription')
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-border text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tax Expert Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-blue-500" />
                <span className="text-blue-600 font-medium">{t('home.aiTaxExpertSection.subHeader')}</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">{t('home.aiTaxExpertSection.title')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('home.aiTaxExpertSection.description')}
              </p>
              <div className="flex space-x-4">
                <Link href="/tax-expert">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    {t('home.aiTaxExpertSection.askButton')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 shadow-md">
                <div className="flex flex-col gap-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="16" x2="12" y2="12"></line>
                          <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-800">{t('home.aiTaxExpertSection.exampleQuestion')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-md shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-gray-800">{t('home.aiTaxExpertSection.exampleAnswerIntro')}</p>
                        <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm">
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem1')}</li>
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem2')}</li>
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem3')}</li>
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem4')}</li>
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem5')}</li>
                          <li>{t('home.aiTaxExpertSection.exampleAnswerItem6')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits of filing */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">{t('home.benefits.title')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t('home.benefits.description')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <CheckCircle className="h-10 w-10 text-green-500" />,
                title: t('home.benefits.accuracyTitle'),
                description: t('home.benefits.accuracyDescription')
              },
              {
                icon: <BadgeIndianRupee className="h-10 w-10 text-blue-500" />,
                title: t('home.benefits.refundTitle'),
                description: t('home.benefits.refundDescription')
              },
              {
                icon: <Rocket className="h-10 w-10 text-orange-500" />,
                title: t('home.benefits.fastProcessingTitle'),
                description: t('home.benefits.fastProcessingDescription')
              },
              {
                icon: <LifeBuoy className="h-10 w-10 text-red-500" />,
                title: t('home.benefits.expertSupportTitle'),
                description: t('home.benefits.expertSupportDescription')
              }
            ].map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
                <div className="mb-4 flex justify-center"> {/* Added flex justify-center */}
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">{benefit.title}</h3>
                <p className="text-muted-foreground text-center">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Highlights Section */}
      <ExperienceHighlights />

      {/* CTA section */}
      <section className="py-14 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              {t('home.cta.description')}
            </p>
            <Link href="/start-filing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                {t('home.cta.button')} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeSimplified;
