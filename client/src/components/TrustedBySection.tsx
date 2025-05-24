// Modern company logos carousel component

// Import SVG logos from the directory
import adaniGreenEnergyLogo from '@/assets/company-logos/Adani_Green_Energy_logo.svg';
import airtelLogo from '@/assets/company-logos/airtel.svg';
import amulLogo from '@/assets/company-logos/amul.svg';
import asianPaintsLogo from '@/assets/company-logos/Asian_Paints_Logo.svg';
import bajajFinservLogo from '@/assets/company-logos/bajaj-finserv.svg';
import balajiWafersLogo from '@/assets/company-logos/BalajiWafersLogo.svg';
import dlfLogo from '@/assets/company-logos/DLF_logo.svg';
import dunzoLogo from '@/assets/company-logos/dunzo.svg';
import godrejLogo from '@/assets/company-logos/Godrej_Logo.svg';
import heroLogo from '@/assets/company-logos/hero.svg';
import hindustanUnileverLogo from '@/assets/company-logos/hindustan-unilever.svg';
import indiabullsHomeLoansLogo from '@/assets/company-logos/Indiabulls_Home_Loans_Logo.svg';
import itcLimitedLogo from '@/assets/company-logos/ITC_Limited_Logo.svg';
import justdialLogo from '@/assets/company-logos/Justdial_Logo.svg';
import mahindraLogo from '@/assets/company-logos/mahindra.svg';
import olaCabsLogo from '@/assets/company-logos/Ola_Cabs_logo.svg';
import paytmLogo from '@/assets/company-logos/Paytm_Logo_(standalone).svg';
import phonepeLogo from '@/assets/company-logos/phonepe.svg';
import raymondLogo from '@/assets/company-logos/Raymond_logo.svg';
import snapdealLogo from '@/assets/company-logos/Snapdeal_branding_logo.svg';
import tSeriesLogo from '@/assets/company-logos/T-series-logo.svg';
import tanishqLogo from '@/assets/company-logos/Tanishq_Logo.svg';
import tataLogo from '@/assets/company-logos/tata.svg';
import tata1mgLogo from '@/assets/company-logos/TATA_1mg_Logo.svg'; // Using one of the TATA_1mg logos
import tataConsultancyServicesOldLogo from '@/assets/company-logos/Tata_Consultancy_Services_old_logo.svg';
import tataSteelLogo from '@/assets/company-logos/Tata_Steel_Logo.svg';
import videoconLogo from '@/assets/company-logos/Videocon_logo.svg';
import wiproPrimaryLogoColorRGB from '@/assets/company-logos/Wipro_Primary_Logo_Color_RGB.svg';
import zohoLogo from '@/assets/company-logos/ZOHO.svg';
import zomatoLogo from '@/assets/company-logos/Zomato_Logo.svg';


// Helper function to derive display name from filename
const formatName = (filename: string): string => {
  const name = filename
    .replace(/\.svg$/, '') // Remove .svg extension
    .replace(/_logo$/i, '') // Remove common '_logo' suffix
    .replace(/_Logo$/i, '') // Remove common '_Logo' suffix
    .replace(/_Primary_Logo_Color_RGB$/i, '') // Remove specific suffix for Wipro
    .replace(/_branding_logo$/i, '') // Remove specific suffix for Snapdeal
    .replace(/_old_logo$/i, '') // Remove specific suffix for TCS
    .replace(/_\(standalone\)$/i, '') // Remove specific suffix for Paytm
    .replace(/_\(1\)$/i, '') // Remove (1) suffix
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  if (name === 'tata') return 'Tata Group'; // Handle generic 'tata.svg'
  return name;
};

const TrustedBySection = () => {
  const rawCompanies = [
    { name: formatName('Adani_Green_Energy_logo.svg'), logo: adaniGreenEnergyLogo },
    { name: formatName('airtel.svg'), logo: airtelLogo },
    { name: formatName('amul.svg'), logo: amulLogo },
    { name: formatName('Asian_Paints_Logo.svg'), logo: asianPaintsLogo },
    { name: formatName('bajaj-finserv.svg'), logo: bajajFinservLogo },
    { name: formatName('BalajiWafersLogo.svg'), logo: balajiWafersLogo },
    { name: formatName('DLF_logo.svg'), logo: dlfLogo },
    { name: formatName('dunzo.svg'), logo: dunzoLogo },
    { name: formatName('Godrej_Logo.svg'), logo: godrejLogo },
    { name: formatName('hero.svg'), logo: heroLogo },
    { name: formatName('hindustan-unilever.svg'), logo: hindustanUnileverLogo },
    { name: formatName('Indiabulls_Home_Loans_Logo.svg'), logo: indiabullsHomeLoansLogo },
    { name: formatName('ITC_Limited_Logo.svg'), logo: itcLimitedLogo },
    { name: formatName('Justdial_Logo.svg'), logo: justdialLogo },
    { name: formatName('mahindra.svg'), logo: mahindraLogo },
    { name: formatName('Ola_Cabs_logo.svg'), logo: olaCabsLogo },
    { name: formatName('Paytm_Logo_(standalone).svg'), logo: paytmLogo },
    { name: formatName('phonepe.svg'), logo: phonepeLogo },
    { name: formatName('Raymond_logo.svg'), logo: raymondLogo },
    { name: formatName('Snapdeal_branding_logo.svg'), logo: snapdealLogo },
    { name: formatName('T-series-logo.svg'), logo: tSeriesLogo },
    { name: formatName('Tanishq_Logo.svg'), logo: tanishqLogo },
    { name: formatName('TATA_1mg_Logo.svg'), logo: tata1mgLogo },
    { name: formatName('Tata_Consultancy_Services_old_logo.svg'), logo: tataConsultancyServicesOldLogo },
    { name: formatName('Tata_Steel_Logo.svg'), logo: tataSteelLogo },
    { name: formatName('tata.svg'), logo: tataLogo },
    { name: formatName('Videocon_logo.svg'), logo: videoconLogo },
    { name: formatName('Wipro_Primary_Logo_Color_RGB.svg'), logo: wiproPrimaryLogoColorRGB },
    { name: formatName('ZOHO.svg'), logo: zohoLogo },
    { name: formatName('Zomato_Logo.svg'), logo: zomatoLogo },
  ];

  // Duplicate the list to ensure continuous scrolling
  const companies = [...rawCompanies, ...rawCompanies.slice(0, 15)]; // Adjust slice as needed for smooth scroll

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
                    alt={`${company.name} logo`}
                    className="carousel-logo"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff`;
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBySection;
