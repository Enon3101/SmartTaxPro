// Modern company logos carousel component with employee testimonials

import { motion, useAnimation } from 'framer-motion';
import { Star, Building2, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';

// Employee testimonials from top companies
const employeeTestimonials = [
  {
    id: 1,
    company: "Tata Consultancy Services",
    logo: "/company-logos-new/Tata_Consultancy_Services_old_logo.svg",
    employee: "Rajesh Kumar",
    position: "Senior Software Engineer",
    testimonial: "SmartTaxPro streamlined our entire team's tax filing process. The bulk Form-16 upload feature saved us countless hours during tax season.",
    rating: 5,
    employeesCount: "500+ employees"
  },
  {
    id: 2,
    company: "Wipro",
    logo: "/company-logos-new/Wipro_Primary_Logo_Color_RGB.svg",
    employee: "Priya Sharma",
    position: "HR Manager",
    testimonial: "As an HR manager, I appreciate how SmartTaxPro handles complex tax scenarios. Our employees love the intuitive interface and quick refund processing.",
    rating: 5,
    employeesCount: "300+ employees"
  },
  {
    id: 3,
    company: "Infosys",
    logo: "/company-logos-new/infosys.png",
    employee: "Amit Patel",
    position: "Project Manager",
    testimonial: "The AI-powered deduction finder helped me discover tax benefits I never knew existed. SmartTaxPro truly maximizes your refund potential.",
    rating: 5,
    employeesCount: "400+ employees"
  },
  {
    id: 4,
    company: "Hindustan Unilever",
    logo: "/company-logos-new/hindustan-unilever.svg",
    employee: "Sunita Reddy",
    position: "Finance Director",
    testimonial: "Our finance team recommends SmartTaxPro to all employees. The accuracy and compliance features give us complete peace of mind.",
    rating: 5,
    employeesCount: "250+ employees"
  },
  {
    id: 5,
    company: "ITC Limited",
    logo: "/company-logos-new/ITC_Limited_Logo.svg",
    employee: "Vikram Singh",
    position: "Senior Analyst",
    testimonial: "Filing taxes used to be a nightmare. SmartTaxPro made it so simple that I completed my return in just 15 minutes. Highly recommended!",
    rating: 5,
    employeesCount: "200+ employees"
  },
  {
    id: 6,
    company: "Mahindra",
    logo: "/company-logos-new/mahindra.svg",
    employee: "Neha Gupta",
    position: "Operations Manager",
    testimonial: "The step-by-step guidance is perfect for first-time filers. SmartTaxPro explains everything in simple terms and ensures accuracy.",
    rating: 5,
    employeesCount: "350+ employees"
  },
  {
    id: 7,
    company: "Asian Paints",
    logo: "/company-logos-new/Asian_Paints_Logo.svg",
    employee: "Arun Kumar",
    position: "Sales Executive",
    testimonial: "I was worried about my capital gains calculations. SmartTaxPro handled everything perfectly and I got my maximum refund.",
    rating: 5,
    employeesCount: "180+ employees"
  },
  {
    id: 8,
    company: "Bajaj Finserv",
    logo: "/company-logos-new/bajaj-finserv.svg",
    employee: "Meera Desai",
    position: "Product Manager",
    testimonial: "The customer support is exceptional. They helped me understand complex tax scenarios and ensured I claimed all eligible deductions.",
    rating: 5,
    employeesCount: "220+ employees"
  }
];

const TrustedBySection = () => {
  const controls = useAnimation();
  const sliderRef = useRef<HTMLDivElement>(null);

  // Function to render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          strokeWidth={i < rating ? 2 : 1}
        />
      ));
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollWidth = slider.scrollWidth;
    const duration = 50; // seconds per full scroll

    controls.start({
      x: -scrollWidth / 2,
      transition: { duration, ease: 'linear', repeat: Infinity }
    });
  }, [controls]);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-4"
          >
            <Building2 className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">
              Trusted by Employees from Top Companies
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            See what employees from leading Indian companies say about their SmartTaxPro experience
          </motion.p>
        </div>
        
        <div className="relative">
          <div 
            ref={sliderRef}
            className="overflow-hidden py-4"
          >
            <motion.div 
              className="flex gap-6 w-max"
              animate={controls}
            >
              {[...employeeTestimonials, ...employeeTestimonials].map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="w-96 flex-shrink-0 bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: (index % 8) * 0.1 }}
                >
                  {/* Company Logo and Info */}
                  <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
                      <img
                        src={testimonial.logo}
                        alt={`${testimonial.company} logo`}
                        className="object-contain h-8 w-8"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.company)}&background=0D8ABC&color=fff`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{testimonial.company}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Users className="h-3 w-3 mr-1" />
                        {testimonial.employeesCount}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex mb-3">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Employee Info */}
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3 text-sm">
                      {testimonial.employee.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 text-sm">{testimonial.employee}</h5>
                      <p className="text-xs text-gray-500">{testimonial.position}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-blue-50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-blue-50 to-transparent z-10" />
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2000+</div>
            <div className="text-gray-600">Companies Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">50,000+</div>
            <div className="text-gray-600">Employees Served</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySection; 