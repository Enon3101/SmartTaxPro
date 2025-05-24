import { TrendingUp, Award, ShieldCheck } from "lucide-react";

const highlights = [
  {
    icon: <TrendingUp className="h-10 w-10 text-indigo-600" />,
    title: "10000+ ITR Filed",
    description: "Successfully processed over ten thousand income tax returns.",
  },
  {
    icon: <Award className="h-10 w-10 text-indigo-600" />,
    title: "10 Years Experience",
    description: "A decade of expertise in tax filing and financial advisory.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-indigo-600" />,
    title: "100% Client Satisfaction",
    description: "Committed to providing excellent service and ensuring client happiness.",
  },
];

const ExperienceHighlights = () => {
  return (
    <section className="py-12 bg-muted">
      <div className="container mx-auto px-4">
        <div className="w-full flex justify-center">
          <h2 className="text-3xl font-bold text-center mb-10">
            Our Proven Track Record
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-border text-center flex flex-col items-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceHighlights;
