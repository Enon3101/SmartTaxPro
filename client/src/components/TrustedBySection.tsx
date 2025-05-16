// Company logos component for better performance
const TrustedBySection = () => {
  // Using only the companies with confirmed working images
  const companies = [
    { name: 'Tata Consultancy Services', logo: 'company-logos/tcs.png' },
    { name: 'Infosys', logo: 'company-logos/infosys.png' },
    { name: 'Reliance Industries', logo: 'company-logos/reliance.png' },
    { name: 'Wipro', logo: 'company-logos/wipro.png' },
    { name: 'HDFC Bank', logo: 'company-logos/hdfc.png' },
    { name: 'Bharti Airtel', logo: 'company-logos/airtel.png' },
    { name: 'ITC Limited', logo: 'company-logos/itc.png' },
    { name: 'State Bank of India', logo: 'company-logos/sbi.png' },
    { name: 'ICICI Bank', logo: 'company-logos/icici.png' },
  ];

  return (
    <section className="py-8 bg-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">As Trusted By</h3>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Leading Indian companies trust us for their employee's tax filing needs
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
          {companies.map((company, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="h-16 w-16 flex items-center justify-center mb-2 p-2 rounded-md border border-blue-100 bg-white shadow-sm">
                <div className="flex items-center justify-center h-10 w-10">
                  <img 
                    src={company.logo}
                    alt={company.name}
                    className="max-h-10 max-w-10 object-contain"
                  />
                </div>
              </div>
              <span className="text-xs font-medium text-muted-foreground text-center">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;