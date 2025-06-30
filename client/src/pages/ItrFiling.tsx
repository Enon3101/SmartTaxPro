import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import FileUpload from '@/components/FileUpload';

// Auth hook (replace with your real auth logic)
const useAuth = () => {
  // TODO: Replace with real authentication logic
  const userStr = localStorage.getItem('user');
  return {
    user: userStr ? JSON.parse(userStr) : null,
  };
};

// Real API request helper
const apiRequest = async (method: string, url: string, options?: RequestInit) => {
  const config: RequestInit = {
    method,
    credentials: 'include', // send cookies if needed
    ...options,
  };
  try {
    const response = await fetch(url, config);
    return response;
  } catch (err) {
    throw new Error('Network error or server unavailable');
  }
};

const generateItr1Json = (formData: Itr1FormData): Record<string, any> => {
  return {
    itrType: 'ITR-1',
    assessmentYear: '2025-26',
    personalInfo: formData.personalInfo,
    incomeDetails: formData.incomeDetails,
    deductions: formData.deductions,
    generatedAt: new Date().toISOString()
  };
};

const downloadJson = (data: Record<string, any>, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

interface PersonalInfo {
  pan: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
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

interface CapitalGainsData {
  stcgNormalRate: number | string;
  stcg111A: number | string;
  ltcg112: number | string;
  ltcg112A_Equity: number | string;
  ltcgOther: number | string;
}

interface IncomeDetails {
  salary: number | string;
  housePropertyIncome: number | string;
  otherSourcesIncome: number | string;
  capitalGains: CapitalGainsData;
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
  const [, setLocation] = useLocation();
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
          const response = await apiRequest('GET', `/api/tax-forms/${params.filingId}`);
          if (!response.ok) throw new Error('Failed to load filing data');
          const existingFiling = await response.json();
          
          setFormData(() => { 
            const updatedState = JSON.parse(JSON.stringify(initialFormData)); 

            if (existingFiling && typeof existingFiling.personalInfo === 'string') { 
              try { 
                updatedState.personalInfo = { ...updatedState.personalInfo, ...JSON.parse(existingFiling.personalInfo) }; 
              } catch (e) { 
                console.error("Error parsing personalInfo", e); 
              }
            }
            
            if (existingFiling && typeof existingFiling.incomeData === 'string') { 
              try {
                const parsedIncome = JSON.parse(existingFiling.incomeData);
                updatedState.incomeDetails = { ...updatedState.incomeDetails, ...parsedIncome };
                if (parsedIncome.capitalGains) {
                  updatedState.incomeDetails.capitalGains = { ...initialFormData.incomeDetails.capitalGains, ...parsedIncome.capitalGains };
                } else {
                   updatedState.incomeDetails.capitalGains = { ...initialFormData.incomeDetails.capitalGains };
                }
              } catch (e) { 
                console.error("Error parsing incomeData", e); 
              }
            }
            // TODO: Add parsing for deductions from existingFiling if provided by mock (e.g. existingFiling.deductions80c)

            return updatedState;
          });

          if (existingFiling && existingFiling.id) { // Check if id exists
            setCurrentFilingId(existingFiling.id);
          }
        } else {
          const newFilingResponse = await apiRequest('POST', '/api/tax-forms', {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              formType: 'ITR-1',
              assessmentYear: '2025-26',
              status: 'draft'
            }),
          });
          
          if (!newFilingResponse.ok) throw new Error('Failed to create new filing');
          const newFilingData = await newFilingResponse.json();
          if (newFilingData && newFilingData.id) { // Check if id exists
            setCurrentFilingId(newFilingData.id);
            setLocation(`/itr-filing/${newFilingData.id}`, { replace: true });
          }
          setFormData(initialFormData);
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
      const newData = { ...prev }; // prev is used here
      const sectionData = newData[section];
      
      if (typeof sectionData === 'object' && sectionData !== null) {
        if (field.includes('.')) {
          const [parentField, childField] = field.split('.');
          // Ensure parentField exists and is an object before trying to spread and assign
          if (Object.prototype.hasOwnProperty.call(sectionData, parentField) && typeof (sectionData as Record<string, any>)[parentField] === 'object') {
            (sectionData as Record<string, any>)[parentField] = {
              ...((sectionData as Record<string, any>)[parentField] as object),
              [childField]: value
            };
          }
        } else if (Object.prototype.hasOwnProperty.call(sectionData, field)) {
          (sectionData as Record<string, any>)[field] = value;
        }
      }
      
      return newData;
    });
  };

  const handleSaveDraft = async () => {
  if (!currentFilingId || !user) {
    setError("No active filing to save or user not authenticated.");
    return;
  }
  setLoading(true);
  setError(null);
  try {
    // Save all filing sections
    const savePersonal = apiRequest('POST', `/api/tax-forms/${currentFilingId}/personal-info`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.personalInfo),
    });
    const saveIncome = apiRequest('POST', `/api/tax-forms/${currentFilingId}/income`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.incomeDetails),
    });
    const saveDeductions = apiRequest('POST', `/api/tax-forms/${currentFilingId}/deductions-80c`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData.deductions.chapterVIA),
    });
    const responses = await Promise.all([savePersonal, saveIncome, saveDeductions]);
    for (const response of responses) {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Save failed for a section' })) as { message?: string };
        throw new Error(errorData.message || `Failed to save a section`);
      }
    }
    alert("Draft saved successfully!");
  } catch (err) {
    console.error("Error saving draft:", err);
    setError(err instanceof Error ? err.message : "Failed to save draft.");
  } finally {
    setLoading(false);
  }
};

  const handleSubmitReturn = async () => {
  if (!currentFilingId || !user) {
    setError("No active filing to submit or user not authenticated.");
    return;
  }
  setLoading(true);
  setError(null);
  try {
    // Save draft before submitting
    await handleSaveDraft();
    // Submit the return (update status)
    const resp = await apiRequest('POST', `/api/tax-forms/${currentFilingId}/status`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'submitted' }),
    });
    if (!resp.ok) {
      const errorData = await resp.json().catch(() => ({ message: 'Failed to submit return' })) as { message?: string };
      throw new Error(errorData.message || 'Failed to submit return');
    }
    const data = await resp.json();
    alert(`Return submitted successfully! Acknowledgment: ${data.acknowledgmentNo || currentFilingId}`);
  } catch (err) {
    console.error("Error submitting return:", err);
    setError(err instanceof Error ? err.message : "Failed to submit return.");
  } finally {
    setLoading(false);
  }
};

  const handleDownloadJson = () => {
    if (!formData || !currentFilingId) {
      alert("No filing data to download or filing ID is missing.");
      return;
    }
    
    try {
      const itrJson = generateItr1Json(formData);
      downloadJson(itrJson, `ITR1_AY2025-26_${formData.personalInfo.pan || 'draft'}.json`);
    } catch (err) {
      console.error("Error generating or downloading ITR JSON:", err);
      alert(err instanceof Error ? `Error: ${err.message}` : "An unknown error occurred while preparing the JSON file.");
    }
  };

  if (loading && !currentFilingId) {
    return <div className="container mx-auto p-4 text-center">Loading or creating filing...</div>;
  }

  if (error && error !== "Draft saved successfully!") {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        ITR Filing (ITR-1) - {currentFilingId ? `ID: ${currentFilingId}` : 'New Filing'}
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        ITR-1 Sahaj Form for individuals being a resident (other than not ordinarily resident) 
        having total income upto Rs.50 lakh, having Income from Salaries, one house property, 
        other sources (Interest etc.), and agricultural income upto Rs.5 thousand.
      </p>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        {/* Personal Information Section */}
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Part A: Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="pan" className="block text-sm font-medium text-gray-700">PAN</label>
              <input 
                type="text" 
                name="pan" 
                id="pan" 
                value={formData.personalInfo.pan} 
                onChange={(e) => handleInputChange('personalInfo', 'pan', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              />
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={formData.personalInfo.firstName} 
                onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                id="lastName" 
                value={formData.personalInfo.lastName} 
                onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                id="dob" 
                value={formData.personalInfo.dob} 
                onChange={(e) => handleInputChange('personalInfo', 'dob', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              />
            </div>
          </div>
        </section>

        {/* Document Upload Section */}
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Upload Required Documents</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Please upload your latest <strong>Bank Statement</strong> and any other supporting documents (Form 16, investment proofs, etc.). Our tax experts will review your documents and contact you to help file your return. You will receive updates by email/SMS.
          </p>
          {currentFilingId && (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Bank Statement</label>
                <FileUpload taxFormId={currentFilingId} documentType="Bank Statement" />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Other Documents</label>
                <FileUpload taxFormId={currentFilingId} documentType="Other" />
              </div>
            </>
          )}
        </section>

        {/* (Income, Deductions, and Calculation sections are hidden for now) */}
        {/*
        <section className="p-6 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4">Part B: Income Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
                Salary (Excluding allowances, perquisites, etc.)
              </label>
              <input 
                type="number" 
                name="salary" 
                id="salary" 
                value={formData.incomeDetails.salary} 
                onChange={(e) => handleInputChange('incomeDetails', 'salary', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Enter amount" 
              />
            </div>
            <div>
              <label htmlFor="housePropertyIncome" className="block text-sm font-medium text-gray-700">
                Income from House Property (Let-out)
              </label>
              <input 
                type="number" 
                name="housePropertyIncome" 
                id="housePropertyIncome" 
                value={formData.incomeDetails.housePropertyIncome} 
                onChange={(e) => handleInputChange('incomeDetails', 'housePropertyIncome', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Enter amount (can be negative)" 
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3">Capital Gains</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stcgNormalRate" className="block text-sm font-medium text-gray-700">
                STCG (Slab Rates)
              </label>
              <input 
                type="number" 
                name="stcgNormalRate" 
                id="stcgNormalRate" 
                value={formData.incomeDetails.capitalGains.stcgNormalRate} 
                onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.stcgNormalRate', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Enter amount" 
              />
            </div>
            <div>
              <label htmlFor="ltcg112" className="block text-sm font-medium text-gray-700">
                LTCG Sec 112 (20%)
              </label>
              <input 
                type="number" 
                name="ltcg112" 
                id="ltcg112" 
                value={formData.incomeDetails.capitalGains.ltcg112} 
                onChange={(e) => handleInputChange('incomeDetails', 'capitalGains.ltcg112', e.target.value)} 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                placeholder="Enter amount (indexed)" 
              />
            </div>
          </div>
        </section>

        {/* Deductions and calculation buttons are hidden for now */}
        {/*
        <section className="p-6 border rounded-lg shadow-md bg-white">
          ...
        </section>

        <div className="mt-8 flex justify-end space-x-3">
          ...
        </div>
        */}
      </form>
    </div>
  );
};

export default ItrFiling;
