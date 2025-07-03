import { 
  Coins, ArrowRight, FileText, Copy, Briefcase, TrendingUp, Globe, Search, CheckCircle, Circle, ChevronUp, ChevronDown, Star, Shield, Zap, Users
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlanCardProps {
  title: string;
  subtitle?: string;
  price: string;
  originalPrice?: string;
  isFree?: boolean;
  isPopular?: boolean;
  features?: string[];
  buttonText?: string;
  onClick?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  price,
  originalPrice,
  isFree,
  isPopular,
  features = [],
  buttonText,
  onClick,
}) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          Most Popular
        </Badge>
      )}
      <Card className={`h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
        isPopular ? 'ring-2 ring-purple-500 shadow-lg' : 'hover:ring-2 hover:ring-blue-500'
      }`}>
        <CardHeader className="text-center pb-4">
        {isFree && (
            <Badge variant="secondary" className="w-fit mx-auto mb-2 bg-green-100 text-green-700 border-green-200">
              {t('pricing.free', 'Free')}
            </Badge>
          )}
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center mb-6">
          {originalPrice && (
              <span className="text-sm text-gray-500 line-through mr-2">
              ₹{originalPrice}
            </span>
          )}
            <div className="flex items-baseline justify-center">
              <span className={`text-4xl font-bold ${isFree ? 'text-green-600' : 'text-blue-600'}`}>
            {isFree ? price : `₹${price}`}
          </span>
              {!isFree && (
                <span className="text-sm text-gray-500 ml-1">+ taxes</span>
              )}
        </div>
      </div>
          
          {features.length > 0 && (
            <ul className="space-y-2 mb-6">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          
      {buttonText && onClick && (
            <Button 
              onClick={onClick} 
              className={`w-full ${
                isPopular 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium`}
            >
          {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PricingPlan: React.FC = () => {
  const { t } = useTranslation();
  const [isEcaPlanOpen, setIsEcaPlanOpen] = useState(true);

  // Modern File ITR Yourself plans
  const fileYourselfPlans: PlanCardProps[] = [
    {
      title: "Basic",
      subtitle: "Income 0 - 10K",
      price: "Free",
      isFree: true,
      features: [
        "Simple ITR filing",
        "Basic deductions",
        "Email support",
        "Standard processing"
      ],
      buttonText: "Start Free",
      onClick: () => console.log("Start free filing")
    },
    {
      title: "Standard",
      subtitle: "Income 10K - 1L",
      originalPrice: "99",
      price: "49",
      features: [
        "All Basic features",
        "Advanced deductions",
        "Priority support",
        "Faster processing",
        "Document storage"
      ],
      buttonText: "Choose Plan",
      onClick: () => console.log("Choose standard plan")
    },
    {
      title: "Premium",
      subtitle: "Income 1L - 5L",
      originalPrice: "449",
      price: "382",
      isPopular: true,
      features: [
        "All Standard features",
        "Expert consultation",
        "24/7 support",
        "Instant processing",
        "Advanced analytics",
        "Tax optimization"
      ],
      buttonText: "Choose Plan",
      onClick: () => console.log("Choose premium plan")
    },
    {
      title: "Enterprise",
      subtitle: "Income 10L+",
      originalPrice: "1499",
      price: "1274",
      features: [
        "All Premium features",
        "Dedicated expert",
        "Custom solutions",
        "Priority filing",
        "Compliance guarantee",
        "Year-round support"
      ],
      buttonText: "Contact Sales",
      onClick: () => console.log("Contact sales")
    }
  ];

  // eCA Assisted Plans
  const ecaPlans = [
    { 
      key: 'standard', 
      icon: FileText,
      name: 'Standard',
      description: 'Salary (1 employer) + Single House Property',
      basePrice: '1499',
      price: '1274',
      features: ['Salary Income', 'Single House Property', 'Other Sources', 'Basic Support']
    },
    {
      key: 'multipleForm16',
      icon: Copy,
      name: 'Multiple Form 16',
      description: 'Multiple employers + All Standard features',
      basePrice: '1999',
      price: '1699',
      features: ['Multiple Employers', 'All Standard features', 'Priority Support']
    },
    {
      key: 'businessIncome',
      icon: Briefcase,
      name: 'Business Income',
      description: 'Business income + Multiple properties',
      basePrice: '3124',
      price: '2655',
      features: ['Business Income', 'Multiple Properties', 'Section 44AD/44ADA', 'Expert Support']
    },
    {
      key: 'capitalGain',
      icon: TrendingUp,
      name: 'Capital Gains',
      description: 'Capital gains + All Business features',
      basePrice: '4999',
      price: '4249',
      features: ['Capital Gains', 'Crypto Assets', 'Relief u/s 89', 'Premium Support']
    },
    {
      key: 'nri',
      icon: Globe,
      name: 'NRI',
      description: 'NRI tax optimization',
      basePrice: '9374',
      price: '7968',
      features: ['NRI Specific', 'Foreign Assets', 'DTAA Benefits', 'Dedicated Expert']
    },
    {
      key: 'foreign',
      icon: Search,
      name: 'Foreign Income',
      description: 'Complete foreign income handling',
      basePrice: '12499',
      price: '10624',
      features: ['Foreign Income', 'Form 67', 'FTC Optimization', '24/7 Expert Support']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Coins className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Transparent Pricing Plans
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose the perfect plan for your tax filing needs. From simple DIY filing to expert-assisted services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* File ITR Yourself Section */}
      <section className="py-16">
      <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                File ITR Yourself
              </h2>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Complete your tax filing independently with our intuitive platform. 
              Includes all income types: Salary, House Property, Capital Gains, Business Income, and more.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {fileYourselfPlans.map((plan, index) => (
              <PlanCard key={index} {...plan} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
              Start Filing Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

        {/* eCA Assisted Plans Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">
                Expert-Assisted Plans
          </h2>
          </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get professional assistance from certified tax experts. 
              Perfect for complex tax scenarios and maximum optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {ecaPlans.map((plan, index) => {
              const IconComponent = plan.icon;
                      return (
                <motion.div
                  key={plan.key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                    <CardHeader className="text-center">
                      <IconComponent className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-600">{plan.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-6">
                        <span className="text-sm text-gray-500 line-through">₹{plan.basePrice}</span>
                        <div className="text-3xl font-bold text-blue-600">₹{plan.price}</div>
                        <span className="text-sm text-gray-500">+ taxes</span>
                      </div>
                      
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Choose Plan <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
                    );
                  })}
          </div>
            </div>
      </section>

      {/* Features & Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                Why Choose MyeCA.in?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built with security, expertise, and user experience in mind
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "100% Secure",
                description: "Bank-level encryption and security protocols to protect your sensitive data"
              },
              {
                icon: Star,
                title: "Expert Support",
                description: "Get help from certified tax professionals whenever you need assistance"
              },
              {
                icon: Zap,
                title: "Fast & Easy",
                description: "Complete your filing in minutes with our intuitive step-by-step process"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to File Your Taxes?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                              Join thousands of satisfied customers who trust MyeCA.in for their expert eCA services and tax filing needs
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
              Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
      </div>
    </section>
    </div>
  );
};

export default PricingPlan;
