// Modern company logos carousel component
const TrustedBySection = () => {
  // Company logos with names
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
    // Duplicate the list to ensure continuous scrolling
    { name: 'Tata Consultancy Services', logo: 'company-logos/tcs.png' },
    { name: 'Infosys', logo: 'company-logos/infosys.png' },
    { name: 'Reliance Industries', logo: 'company-logos/reliance.png' },
    { name: 'Wipro', logo: 'company-logos/wipro.png' },
    { name: 'HDFC Bank', logo: 'company-logos/hdfc.png' },
    { name: 'Bharti Airtel', logo: 'company-logos/airtel.png' },
  ];

  return (
    <section className="py-10 bg-primary/5 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">As Trusted By</h3>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Leading Indian companies trust us for their employee's tax filing needs
          </p>
        </div>
        
        <div className="company-carousel">
          <div className="carousel-track">
            {companies.map((company, index) => (
              <div key={index} className="carousel-item">
                <div className="carousel-logo-container">
                  <img 
                    src={company.logo}
                    alt={company.name}
                    className="carousel-logo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff`;
                    }}
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;