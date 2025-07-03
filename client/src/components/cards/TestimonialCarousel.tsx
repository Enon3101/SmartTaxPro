import { Star } from "lucide-react";
import { useEffect, useRef } from "react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    position: "Software Engineer",
    company: "TechSolutions India",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 5,
    text: "MyeCA.in made my tax filing incredibly simple. The expert eCA assistance helped me identify deductions I would have missed otherwise. Saved both time and money!"
  },
  {
    id: 2,
    name: "Priya Sharma",
    position: "Marketing Director",
    company: "Global Brands",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 5,
    text: "As someone with multiple income sources, I was worried about filing correctly. MyeCA.in's expert eCA guided me through the entire process and I received my refund within 2 weeks!"
  },
  {
    id: 3,
    name: "Amit Patel",
    position: "Small Business Owner",
    company: "Patel Enterprises",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 4,
    text: "The expert assistance feature is worth every rupee. Got personalized advice for my business deductions and compliance requirements. Highly recommended for entrepreneurs."
  },
  {
    id: 4,
    name: "Sunita Reddy",
    position: "Financial Analyst",
    company: "Investment Partners",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    rating: 5,
    text: "Even as a finance professional, I found MyeCA.in incredibly helpful. The interface is intuitive and the tax calculation with eCA expertise is accurate. Will definitely use again next year."
  },
  {
    id: 5,
    name: "Vikram Singh",
    position: "Freelance Consultant",
    company: "Self-employed",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    rating: 5,
    text: "Perfect solution for freelancers like me! Helped me understand GST implications and maximize my deductions. The document storage feature is also very convenient."
  },
  {
    id: 6,
    name: "Ananya Desai",
    position: "HR Manager",
    company: "Horizon Corp",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    rating: 4,
    text: "Our company recommended MyeCA.in to all employees, and the feedback has been overwhelmingly positive. The bulk upload feature for Form 16 with eCA support saved us so much time."
  }
];

const TestimonialCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleAutoScroll = () => {
      if (scrollRef.current) {
        if (scrollRef.current.scrollLeft >= (scrollRef.current.scrollWidth - scrollRef.current.clientWidth)) {
          // Reset to start when reaching the end
          scrollRef.current.scrollLeft = 0;
        } else {
          // Smooth scroll to the right
          scrollRef.current.scrollLeft += 1;
        }
      }
    };

    // Set up interval for auto-scrolling
    const scrollInterval = setInterval(handleAutoScroll, 30);

    // Pause scrolling when user hovers over the carousel
    const handleMouseEnter = () => clearInterval(scrollInterval);
    const handleMouseLeave = () => setInterval(handleAutoScroll, 30);

    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('mouseenter', handleMouseEnter);
      currentRef.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearInterval(scrollInterval);
      if (currentRef) {
        currentRef.removeEventListener('mouseenter', handleMouseEnter);
        currentRef.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Duplicate testimonials to ensure continuous scrolling
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
                          Join thousands of satisfied customers who have simplified their tax filing experience with MyeCA.in's expert eCA services
          </p>
        </div>

        <div 
          className="testimonial-carousel overflow-hidden" 
          ref={scrollRef}
        >
          <div className="flex gap-6 py-4">
            {allTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.id}-${index}`} 
                className="testimonial-card flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border border-blue-200"
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=0D8ABC&color=fff`;
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.position}, {testimonial.company}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} 
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialCarousel;
