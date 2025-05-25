// Placeholder for ITR-1 JSON Generation Logic
// This will need to be meticulously mapped to the official ITR-1 JSON schema.

interface PersonalInfo {
  pan: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  aadhaarNumber: string;
  mobile: string;
  email: string;
  address: AddressData; 
}

interface AddressData { // Basic address structure
  flatNo?: string;
  premises?: string;
  street?: string;
  areaLocality?: string;
  townCityDistrict?: string;
  state?: string; // Consider using a state code enum/type later
  country?: string;
  pinCode?: string;
}

interface CapitalGainsJSONData { // Simplified structure for JSON output
  stcgNormalRate?: number;
  stcg111A?: number;
  ltcg112?: number;
  ltcg112A_Equity?: number;
  ltcgOther?: number;
}

interface IncomeDetails {
  salary: number | string;
  housePropertyIncome: number | string;
  otherSourcesIncome: number | string;
  capitalGains: CapitalGainsJSONData; // Use the defined type
}

interface DeductionsChapterVIA {
  section80C: number | string;
  section80CCC: number | string;
  section80CCD1: number | string;
  section80CCD1B: number | string;
  section80D: number | string;
  section80DD: number | string;
  section80DDB: number | string;
  section80E: number | string;
  section80EEA: number | string;
  section80G: number | string;
  section80TTA: number | string;
  section80TTB: number | string;
}

interface Deductions {
  chapterVIA: DeductionsChapterVIA;
}

interface Itr1FormData {
  personalInfo: PersonalInfo;
  incomeDetails: IncomeDetails;
  deductions: Deductions;
  // Add other form data sections as they are implemented
}

// This is a highly simplified placeholder.
// The actual ITR-1 JSON schema is very complex and detailed.
// Refer to official documentation for the correct structure and field names.
interface Itr1JsonOutput {
  PersonalInfo: {
    PAN: string;
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    DOB: string; // DD/MM/YYYY format usually
    AadhaarCardNo?: string;
    MobileNo: string;
    EmailAddress: string;
    // ... many more fields
  };
  IncomeSources: {
    Salary: number;
    IncomeFromHP: number;
    IncomeOthSrc: number;
    // ... capital gains, etc.
  };
  Deductions: {
    UsrDeductUndChapVIA: {
      Section80C: number;
      Section80D: number;
      // ... many more deduction fields
    };
    // ... other deduction categories
  };
  // ... many other top-level sections like TaxComputation, TDS, BankDetails, Verification
}

export function generateItr1Json(formData: Itr1FormData): Itr1JsonOutput {
  // Helper to convert string to number, defaulting to 0 if empty or invalid
  const toNumber = (val: string | number | undefined): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const num = parseFloat(val);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };
  
  // Helper to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDateForItr = (dateStr: string): string => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return ''; // return empty if format is wrong
    }
  };


  // This is a very basic mapping and needs to be expanded significantly
  // based on the official ITR-1 JSON schema.
  const itrJson: Itr1JsonOutput = {
    PersonalInfo: {
      PAN: formData.personalInfo.pan.toUpperCase(),
      FirstName: formData.personalInfo.firstName,
      MiddleName: formData.personalInfo.middleName || undefined,
      LastName: formData.personalInfo.lastName,
      DOB: formatDateForItr(formData.personalInfo.dob),
      AadhaarCardNo: formData.personalInfo.aadhaarNumber || undefined,
      MobileNo: formData.personalInfo.mobile,
      EmailAddress: formData.personalInfo.email,
      // Address mapping would be complex
    },
    IncomeSources: {
      Salary: toNumber(formData.incomeDetails.salary),
      IncomeFromHP: toNumber(formData.incomeDetails.housePropertyIncome),
      IncomeOthSrc: toNumber(formData.incomeDetails.otherSourcesIncome),
      // Capital gains would need detailed mapping here
    },
    Deductions: {
      UsrDeductUndChapVIA: { // User Deductions Under Chapter VIA
        Section80C: toNumber(formData.deductions.chapterVIA.section80C),
        Section80D: toNumber(formData.deductions.chapterVIA.section80D),
        // Map other deductions from formData.deductions.chapterVIA here
        // Example:
        // Section80CCD1B: toNumber(formData.deductions.chapterVIA.section80CCD1B),
        // Section80TTA: toNumber(formData.deductions.chapterVIA.section80TTA),
      },
    },
    // Other sections like TaxComputation, TDS, BankDetails, Verification would go here
  };

  console.log("Generated ITR JSON (simplified):", itrJson);
  return itrJson;
}

export function downloadJson(data: object, filename: string) {
  const jsonStr = JSON.stringify(data, null, 2); // Pretty print JSON
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
