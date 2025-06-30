import { motion, useAnimation } from "framer-motion";
import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

interface Testimonial {
  id: number;
  content: string;
  author: string;
  role: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    content: "SmartTaxPro made tax filing a breeze! The step-by-step guidance was incredibly helpful and saved me hours of work.",
    author: "Rahul Sharma",
    role: "Freelance Developer",
    rating: 5,
  },
  {
    id: 2,
    content: "As a small business owner, I was dreading tax season. But with SmartTaxPro, I filed my taxes accurately and got my maximum refund.",
    author: "Priya Patel",
    role: "Small Business Owner",
    rating: 5,
  },
  {
    id: 3,
    content: "The interface is so intuitive and the calculations are spot on. I've recommended SmartTaxPro to all my colleagues.",
    author: "Amit Kumar",
    role: "Senior Accountant",
    rating: 5,
  },
  {
    id: 4,
    content: "I was able to file my taxes in under 15 minutes! The auto-fill feature saved me so much time.",
    author: "Neha Gupta",
    role: "Marketing Professional",
    rating: 4,
  },
  {
    id: 5,
    content: "Excellent customer support! They helped me understand some complex tax deductions I was eligible for.",
    author: "Vikram Singh",
    role: "IT Consultant",
    rating: 5,
  },
];

export const Testimonials = () => {
  const controls = useAnimation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  // Function to render star rating
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          strokeWidth={i < rating ? 2 : 1}
        />
      ));
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollWidth = slider.scrollWidth;
    const width = slider.clientWidth;
    const duration = 40; // seconds per full scroll
    
    const animate = () => {
      controls.start({
        x: -scrollWidth / 2,
        transition: { duration, ease: "linear", repeat: Infinity }
      });
    };

    animate();
  }, [controls]);

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-foreground mb-3"
          >
            What Our Users Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto text-lg"
          >
            Join thousands of satisfied users who have made SmartTaxPro their preferred tax filing solution
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
              {duplicatedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: (index % 5) * 0.1 }}
                >
                  <div className="flex mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium mr-3">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          {/* Gradient fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10" />
        </div>
      </div>
    </section>
  );
}
