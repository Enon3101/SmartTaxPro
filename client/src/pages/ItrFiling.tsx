import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';
// import { Button } from '@/components/ui/button'; // Example, if using ShadCN UI
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

interface PersonalInfo {
  pan: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  aadhaarNumber: string;
  mobile: string;
  email: string;
  address: {
    flatNo: string;
    premises: string;
    street: string;
    areaLocality: string;
    townCityDistrict: string;
    state: string;
    country: string;
    pinCode: string;
  };
}

// Define other section interfaces as needed
interface CapitalGainsData {
  stcgNormalRate: number | string;
  stcg111A: number | string;
  ltcg112: number | string;
  ltcg112A_Equity: number | string;
  ltcgOther: number | string;
}
interface IncomeDetails {
  salary: number | string; // string to allow empty input
  housePropertyIncome: number | string;
  otherSourcesIncome: number | string;
  capitalGains: CapitalGainsData;
  // Add more fields as per ITR-1 requirements
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
  // other deductions if any
}

interface Itr1FormData {
  personalInfo: PersonalInfo;
  incomeDetails: IncomeDetails;
  deductions: Deductions;
  // ... other sections
}

const initialFormData: Itr1FormData = {
  personalInfo: {
    pan: '',
    firstName: '',
    middleName: '',
    lastName: '',
    dob: '',
    aadhaarNumber: '',
    mobile: '',
    email: '',
    address: {
      flatNo: '',
      premises: '',
      street: '',
      areaLocality: '',
      townCityDistrict: '',
      state: '',
      country: 'India',
      pinCode: '',
    },
  },
  incomeDetails: {
    salary: '',
    housePropertyIncome: '',
    otherSourcesIncome: '',
    capitalGains: {
      stcgNormalRate: '',
      stcg111A: '',
      ltcg112: '',
      ltcg112A_Equity: '',
      ltcgOther: '',
    },
  },
  deductions: {
    chapterVIA: {
      section80C: '',
      section80CCC: '',
      section80CCD1: '',
      section80CCD1B: '',
      section80D: '',
      section80DD: '',
      section80DDB: '',
      section80E: '',
      section80EEA: '',
      section80G: '',
      section80TTA: '',
      section80TTB: '',
    },
  },
};


const ItrFiling: React.FC = () => {
  const params = useParams<{ filingId?: string }>();
  const [, setLocation] = useLocation(); // Only setLocation is used
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<Itr1FormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilingId, setCurrentFilingId] = useState<string | null>(params.filingId || null);

  useEffect(() => {
    const loadOrCreateFiling = async () => {
      if (!user) {
        setError("User not authenticated.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        if (params.filingId) {
          // Load existing filing data
          const response = await apiRequest('GET', `/api/tax-forms/${params.filingId}`);
          if (!response.ok) throw new Error('Failed to load filing data');
          const existingFiling = await response.json();
          // Assuming the API returns data in a structure that can be mapped to formData
          console.log("Loaded existing filing:", existingFiling);
          
          // Use a functional update with setFormData to ensure all parts are correctly merged from initialFormData and existingFiling
          setFormData(prev => {
            let updatedState = JSON.parse(JSON.stringify(initialFormData)); // Deep clone initial state

            if (existingFiling.personalInfo) {
              try { updatedState.personalInfo = { ...updatedState.personalInfo, ...JSON.parse(existingFiling.personalInfo) }; }
              catch (e) { console.error("Error parsing personalInfo", e); }
            }
            if (existingFiling.incomeData) {
              try {
                const parsedIncome = JSON.parse(existingFiling.incomeData);
                updatedState.incomeDetails = { ...updatedState.incomeDetails, ...parsedIncome };
                if (parsedIncome.capitalGains) {
                  updatedState.incomeDetails.capitalGains = { ...initialFormData.incomeDetails.capitalGains, ...parsedIncome.capitalGains };
                } else { // Ensure capitalGains object exists even if not in parsed data
                  updatedState.incomeDetails.capitalGains = { ...initialFormData.incomeDetails.capitalGains };
                }
              } 
              catch (e) { console.error("Error parsing incomeData", e); }
            }
            
            // Consolidate deduction loading logic
            const chapterVIADeductionsLoaded: Partial<DeductionsChapterVIA> = {};
            if (existingFiling.deductions80c) { // Specific field from backend for 80C
              try { chapterVIADeductionsLoaded.section80C = JSON.parse(existingFiling.deductions80c).section80C || ''; } 
              catch (e) { console.error("Error parsing deductions80c", e); }
            }
            if (existingFiling.deductions80d) { // Specific field from backend for 80D
              try { chapterVIADeductionsLoaded.section80D = JSON.parse(existingFiling.deductions80d).section80D || ''; }
               catch (e) { console.error("Error parsing deductions80d", e); }
            }
            // If backend stores other chapter VI-A deductions in a general 'otherDeductions' JSON field
            if (existingFiling.otherDeductions) { 
              try { 
                const parsedOtherDeductions = JSON.parse(existingFiling.otherDeductions);
                for (const key in parsedOtherDeductions) {
                  if (key in updatedState.deductions.chapterVIA) {
                    // @ts-ignore - Trusting the key exists from the check
                    updatedState.deductions.chapterVIA[key as keyof DeductionsChapterVIA] = parsedOtherDeductions[key];
                  }
                }
              } catch (e) { console.error("Error parsing otherDeductions", e); }
            }
            // Merge specifically loaded 80C/80D with other deductions from 'otherDeductions'
            updatedState.deductions.chapterVIA = { ...updatedState.deductions.chapterVIA, ...chapterVIADeductionsLoaded };

            return updatedState;
          });
          
          setCurrentFilingId(params.filingId);

        } else {
          // Create a new draft filing if no ID in URL
          const newFilingResponse = await apiRequest('POST', '/api/tax-forms', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              formType: 'ITR-1', 
              assessmentYear: '2025-26', // Example, make this dynamic or user-selectable
              status: 'draft' 
            }),
          });
          if (!newFilingResponse.ok) throw new Error('Failed to create new filing');
          const newFilingData = await newFilingResponse.json();
          setCurrentFilingId(newFilingData.id);
          // Update URL to include the new filing ID, without page reload
          setLocation(`/itr-filing/${newFilingData.id}`, { replace: true });
          setFormData(initialFormData); // Start with a fresh form for the new filing
        }
      } catch (err) {
        console.error("Error loading or creating filing:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    loadOrCreateFiling();
  }, [user, params.filingId, setLocation]);


  const handleInputChange = (section: keyof Itr1FormData, field: string, value: string) => {
    setFormData(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null) {
        if (field.includes('.')) { // Handle nested fields like deductions.chapterVIA.section80C
          const [parentField, childField] = field.split('.');
          // @ts-expect-error TODO: Improve type safety for dynamic section/field updates
          if (parentField in sectionData && typeof sectionData[parentField] === 'object' && sectionData[parentField] !== null) {
            // @ts-expect-error TODO: Improve type safety for dynamic section/field updates
            const updatedParent = { ...sectionData[parentField], [childField]: value };
            return { ...prev, [section]: { ...sectionData, [parentField]: updatedParent } };
          }
        } else if (field in sectionData) { // Handle direct fields
          const updatedSection = { ...sectionData, [field]: value };
          return { ...prev, [section]: updatedSection };
        }
      }
      return prev;
    });
  };
  
  const handleSubmitReturn = async () => {
    if (!currentFilingId || !user) {
      setError("No active filing to submit or user not authenticated.");
      return;
    }
    // First, ensure all data is saved
    await handleSaveDraft(); 
    if (error) { // If save draft had an error, don't proceed
      alert("Please resolve save errors before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest('POST', `/api/tax-forms/${currentFilingId}/status`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'filed' }), // Using existing status update endpoint
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Submission failed" }));
        throw new Error(errorData.message || "Failed to submit return");
      }
      
      const result = await response.json();
      // Generate a mock acknowledgment
      const mockAckNumber = `ACK-${Date.now()}-${currentFilingId.substring(0, 6)}`;
      alert(`Return submitted successfully! Mock Acknowledgment No: ${mockAckNumber}`);
      // Optionally, redirect to a success page or MyFilings page
      // setLocation('/my-filings'); 
      // Update local form data status if needed, or rely on re-fetch
      // setFormData(prev => ({...prev, status: 'filed'})); // This won't work directly, status is not in Itr1FormData
                                                        // We'd typically refetch or update MyFilings page state.
      console.log("Mock submission result:", result, "Ack:", mockAckNumber);

    } catch (err) {
      console.error("Error submitting return:", err);
      setError(err instanceof Error ? err.message : "Failed to submit return.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDraft = async () => {
    if (!currentFilingId || !user) {
      setError("No active filing to save or user not authenticated.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Save all major sections. Consider making this more granular or a single "save all" endpoint.
      // For now, saving personalInfo, incomeDetails, and deductions separately.
      const personalInfoPromise = apiRequest('POST', `/api/tax-forms/${currentFilingId}/personal-info`, {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.personalInfo),
      });
      const incomeDataPromise = apiRequest('POST', `/api/tax-forms/${currentFilingId}/income`, { // Assuming endpoint exists
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData.incomeDetails),
      });
      // For deductions, send 80C and 80D to specific endpoints if they exist
      // Send the rest of chapterVIA to the 'other-deductions' endpoint
      const { section80C, section80D, ...otherChapterVIADeductions } = formData.deductions.chapterVIA;
      
      const promises = [
        personalInfoPromise,
        incomeDataPromise,
        apiRequest('POST', `/api/tax-forms/${currentFilingId}/deductions-80c`, {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section80C }),
        }),
        apiRequest('POST', `/api/tax-forms/${currentFilingId}/deductions-80d`, {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section80D }),
        }),
        apiRequest('POST', `/api/tax-forms/${currentFilingId}/other-deductions`, {
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(otherChapterVIADeductions),
        }),
      ];

      const responses = await Promise.all(promises);

      for (const response of responses) {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `Save failed for a section: ${response.statusText}` }));
          throw new Error(errorData.message || `Failed to save a section: ${response.status}`);
        }
      }
      alert("Draft saved successfully!"); // Replace with a proper toast notification
    } catch (err) {
      console.error("Error saving draft:", err);
      setError(err instanceof Error ? err.message : "Failed to save draft.");
    } finally {
      setLoading(false);
    }
  };


  if (loading && !currentFilingId) { // Show loading only if we don't have an ID yet (i.e., creating new)
    return <div className="container mx-auto p-4 text-center">Loading or creating filing...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ITR Filing (ITR-1) - {currentFilingId ? `ID: ${currentFilingId}` : 'New Filing'}</h1>
      <p className="mb-6 text-sm text-gray-600">ITR-1 Sahaj Form for individuals being a resident (other than not ordinarily resident) having total income upto Rs.50 lakh, having Income from Salaries, one house property, other sources (Interest etc.), and agricultural income upto Rs.5 thousand.</p>
      
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Personal Information Section */}
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Part A: Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN</label>
              <input type="text" name="pan" id="pan" value={formData.personalInfo.pan} onChange={(e) => handleInputChange('personalInfo', 'pan', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="firstName" id="firstName" value={formData.personalInfo.firstName} onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">Middle Name</label>
              <input type="text" name="middleName" id="middleName" value={formData.personalInfo.middleName} onChange={(e) => handleInputChange('personalInfo', 'middleName', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="lastName" id="lastName" value={formData.personalInfo.lastName} onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
             <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input type="date" name="dob" id="dob" value={formData.personalInfo.dob} onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
            <div>
              <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">Aadhaar Number (Optional)</label>
              <input type="text" name="aadhaarNumber" id="aadhaarNumber" value={formData.personalInfo.aadhaarNumber} onChange={(e) => handleInputChange('personalInfo', 'aadhaarNumber', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
            </div>
          </div>
        </section>

        {/* Income Details Section */}
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Part B: Income Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary (Excluding allowances, perquisites, etc.)</label>
              <input type="number" name="salary" id="salary" value={formData.incomeDetails.salary} onChange={(e) => handleInputChange('incomeDetails', 'salary', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
            <div>
              <label htmlFor="housePropertyIncome" className="block text-sm font-medium text-gray-700">Income from House Property (Let-out)</label>
              <input type="number" name="housePropertyIncome" id="housePropertyIncome" value={formData.incomeDetails.housePropertyIncome} onChange={(e) => handleInputChange('incomeDetails', 'housePropertyIncome', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount (can be negative)" />
            </div>
            <div>
              <label htmlFor="otherSourcesIncome" className="block text-sm font-medium text-gray-700">Income from Other Sources (e.g., Interest)</label>
              <input type="number" name="otherSourcesIncome" id="otherSourcesIncome" value={formData.incomeDetails.otherSourcesIncome} onChange={(e) => handleInputChange('incomeDetails', 'otherSourcesIncome', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-3">Capital Gains</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stcgNormalRate" className="block text-sm font-medium text-gray-700">STCG (Slab Rates)</label>
              <input type="number" name="stcgNormalRate" id="stcgNormalRate" value={formData.incomeDetails.capitalGains.stcgNormalRate} onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.stcgNormalRate', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
            <div>
              <label htmlFor="stcg111A" className="block text-sm font-medium text-gray-700">STCG Sec 111A (15%)</label>
              <input type="number" name="stcg111A" id="stcg111A" value={formData.incomeDetails.capitalGains.stcg111A} onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.stcg111A', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
            <div>
              <label htmlFor="ltcg112" className="block text-sm font-medium text-gray-700">LTCG Sec 112 (20%)</label>
              <input type="number" name="ltcg112" id="ltcg112" value={formData.incomeDetails.capitalGains.ltcg112} onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.ltcg112', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount (indexed)" />
            </div>
            <div>
              <label htmlFor="ltcg112A_Equity" className="block text-sm font-medium text-gray-700">LTCG Sec 112A (Equity > 1L @10%)</label>
              <input type="number" name="ltcg112A_Equity" id="ltcg112A_Equity" value={formData.incomeDetails.capitalGains.ltcg112A_Equity} onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.ltcg112A_Equity', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
             <div>
              <label htmlFor="ltcgOther" className="block text-sm font-medium text-gray-700">LTCG (Other)</label>
              <input type="number" name="ltcgOther" id="ltcgOther" value={formData.incomeDetails.capitalGains.ltcgOther} onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.ltcgOther', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
          </div>
        </section>

        {/* Deductions Section */}
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Part C: Deductions (Chapter VI-A)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="section80C" className="block text-sm font-medium text-gray-700">Section 80C (e.g., LIC, PPF, EPF, NSC, ELSS, Tuition Fees)</label>
              <input type="number" name="section80C" id="section80C" value={formData.deductions.chapterVIA.section80C} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80C', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 1,50,000 (aggregate)" />
            </div>
            <div>
              <label htmlFor="section80D" className="block text-sm font-medium text-gray-700">Section 80D (Medical Insurance Premium)</label>
              <input type="number" name="section80D" id="section80D" value={formData.deductions.chapterVIA.section80D} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80D', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Enter amount" />
            </div>
            <div>
              <label htmlFor="section80TTA" className="block text-sm font-medium text-gray-700">Section 80TTA (Interest on Savings Account)</label>
              <input type="number" name="section80TTA" id="section80TTA" value={formData.deductions.chapterVIA.section80TTA} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80TTA', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 10,000 (non-seniors)" />
            </div>
            {/* Additional Deduction Fields */}
            <div>
              <label htmlFor="section80CCC" className="block text-sm font-medium text-gray-700">Section 80CCC (Pension Fund Contribution)</label>
              <input type="number" name="section80CCC" id="section80CCC" value={formData.deductions.chapterVIA.section80CCC} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCC', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Part of 80C limit" />
            </div>
            <div>
              <label htmlFor="section80CCD1" className="block text-sm font-medium text-gray-700">Section 80CCD(1) (NPS Employee Contribution)</label>
              <input type="number" name="section80CCD1" id="section80CCD1" value={formData.deductions.chapterVIA.section80CCD1} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCD1', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Part of 80C limit" />
            </div>
            <div>
              <label htmlFor="section80CCD1B" className="block text-sm font-medium text-gray-700">Section 80CCD(1B) (Additional NPS)</label>
              <input type="number" name="section80CCD1B" id="section80CCD1B" value={formData.deductions.chapterVIA.section80CCD1B} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCD1B', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 50,000" />
            </div>
            <div>
              <label htmlFor="section80DD" className="block text-sm font-medium text-gray-700">Section 80DD (Disabled Dependent)</label>
              <input type="number" name="section80DD" id="section80DD" value={formData.deductions.chapterVIA.section80DD} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80DD', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Fixed deduction amount" />
            </div>
            <div>
              <label htmlFor="section80DDB" className="block text-sm font-medium text-gray-700">Section 80DDB (Specified Diseases)</label>
              <input type="number" name="section80DDB" id="section80DDB" value={formData.deductions.chapterVIA.section80DDB} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80DDB', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Actual or limit" />
            </div>
            <div>
              <label htmlFor="section80E" className="block text-sm font-medium text-gray-700">Section 80E (Interest on Education Loan)</label>
              <input type="number" name="section80E" id="section80E" value={formData.deductions.chapterVIA.section80E} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80E', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full interest amount" />
            </div>
            <div>
              <label htmlFor="section80EEA" className="block text-sm font-medium text-gray-700">Section 80EEA (Affordable Housing Loan Interest)</label>
              <input type="number" name="section80EEA" id="section80EEA" value={formData.deductions.chapterVIA.section80EEA} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80EEA', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 1,50,000" />
            </div>
            <div>
              <label htmlFor="section80G" className="block text-sm font-medium text-gray-700">Section 80G (Donations)</label>
              <input type="number" name="section80G" id="section80G" value={formData.deductions.chapterVIA.section80G} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80G', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Eligible amount" />
            </div>
            <div>
              <label htmlFor="section80TTA" className="block text-sm font-medium text-gray-700">Section 80TTA (Interest on Savings Account)</label>
              <input type="number" name="section80TTA" id="section80TTA" value={formData.deductions.chapterVIA.section80TTA} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80TTA', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 10,000 (non-seniors)" />
            </div>
            {/* Additional Deduction Fields UI */}
            <div>
              <label htmlFor="section80CCC" className="block text-sm font-medium text-gray-700">Section 80CCC (Pension Fund Contribution)</label>
              <input type="number" name="section80CCC" id="section80CCC" value={formData.deductions.chapterVIA.section80CCC} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCC', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Part of 80C limit" />
            </div>
            <div>
              <label htmlFor="section80CCD1" className="block text-sm font-medium text-gray-700">Section 80CCD(1) (NPS Employee Contribution)</label>
              <input type="number" name="section80CCD1" id="section80CCD1" value={formData.deductions.chapterVIA.section80CCD1} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCD1', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Part of 80C limit" />
            </div>
            <div>
              <label htmlFor="section80CCD1B" className="block text-sm font-medium text-gray-700">Section 80CCD(1B) (Additional NPS)</label>
              <input type="number" name="section80CCD1B" id="section80CCD1B" value={formData.deductions.chapterVIA.section80CCD1B} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80CCD1B', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 50,000" />
            </div>
            <div>
              <label htmlFor="section80DD" className="block text-sm font-medium text-gray-700">Section 80DD (Disabled Dependent)</label>
              <input type="number" name="section80DD" id="section80DD" value={formData.deductions.chapterVIA.section80DD} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80DD', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Fixed deduction amount" />
            </div>
            <div>
              <label htmlFor="section80DDB" className="block text-sm font-medium text-gray-700">Section 80DDB (Specified Diseases)</label>
              <input type="number" name="section80DDB" id="section80DDB" value={formData.deductions.chapterVIA.section80DDB} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80DDB', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Actual or limit" />
            </div>
            <div>
              <label htmlFor="section80E" className="block text-sm font-medium text-gray-700">Section 80E (Interest on Education Loan)</label>
              <input type="number" name="section80E" id="section80E" value={formData.deductions.chapterVIA.section80E} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80E', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Full interest amount" />
            </div>
            <div>
              <label htmlFor="section80EEA" className="block text-sm font-medium text-gray-700">Section 80EEA (Affordable Housing Loan Interest)</label>
              <input type="number" name="section80EEA" id="section80EEA" value={formData.deductions.chapterVIA.section80EEA} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80EEA', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 1,50,000" />
            </div>
            <div>
              <label htmlFor="section80G" className="block text-sm font-medium text-gray-700">Section 80G (Donations)</label>
              <input type="number" name="section80G" id="section80G" value={formData.deductions.chapterVIA.section80G} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80G', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Eligible amount" />
            </div>
            <div>
              <label htmlFor="section80TTB" className="block text-sm font-medium text-gray-700">Section 80TTB (Interest - Senior Citizens)</label>
              <input type="number" name="section80TTB" id="section80TTB" value={formData.deductions.chapterVIA.section80TTB} onChange={(e) => handleInputChange('deductions', 'chapterVIA.section80TTB', e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Max 50,000 (seniors)" />
            </div>
          </div>
        </section>
        
        {/* TODO: Add other sections: Tax Paid, Bank Details, Verification */}

        <div className="mt-8 flex justify-end space-x-3">
          <button 
            type="button" 
            onClick={handleSaveDraft}
            disabled={loading || !currentFilingId}
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-primary-light disabled:opacity-50"
          >
            {loading && !currentFilingId ? 'Saving...' : 'Save Draft'}
          </button>
          <button 
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            Proceed to Next {/* This might become "Calculate Tax" or "Review & Submit" later */}
          </button>
          <button
            type="button"
            onClick={handleSubmitReturn}
            disabled={loading || !currentFilingId}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Return (Mock)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItrFiling;
