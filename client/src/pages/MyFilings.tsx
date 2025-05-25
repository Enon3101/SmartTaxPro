import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';

import { useAuth } from '@/context/AuthContext';
import { apiRequest } from '@/lib/queryClient';

interface TaxFormSummary {
  id: string;
  formType: string | null;
  assessmentYear: string | null;
  status: string;
  updatedAt: string; // Or Date
}

const MyFilings: React.FC = () => {
  const { user } = useAuth(); // Removed token, apiRequest handles it
  const [filings, setFilings] = useState<TaxFormSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { // Check only for user, as apiRequest handles token
      setLoading(false);
      setError("User not authenticated.");
      return;
    }

    const fetchFilings = async () => {
      setLoading(true);
      setError(null);
      try {
        // apiRequest will get token from localStorage
        const response = await apiRequest('GET', '/api/tax-forms'); 
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: response.statusText }));
          throw new Error(errorData.message || `Failed to fetch filings: ${response.status}`);
        }
        const data = await response.json();
        setFilings(data);
      } catch (err) {
        console.error("Failed to fetch filings:", err);
        setError("Failed to load your tax filings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFilings();
  }, [user]);

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading your filings...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Tax Filings</h1>
      {filings.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl text-gray-600 mb-4">You haven't started any tax filings yet.</p>
          <Link href="/itr-filing">
            <a className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold">
              Start a New Filing
            </a>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filings.map((filing) => (
            <div key={filing.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h2 className="text-xl font-semibold text-primary">
                    {filing.formType || 'ITR'} - AY {filing.assessmentYear || 'N/A'}
                  </h2>
                  <p className="text-sm text-gray-500">Last updated: {new Date(filing.updatedAt).toLocaleDateString()}</p>
                </div>
                <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    filing.status === 'draft' || filing.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    filing.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    filing.status === 'filed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {filing.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <Link href={`/itr-filing/${filing.id}`}>
                    <a className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md text-sm font-medium">
                      {filing.status === 'draft' || filing.status === 'in_progress' ? 'Resume Filing' : 'View Details'}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
           <div className="mt-8 text-center">
             <Link href="/itr-filing">
                <a className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-semibold">
                Start Another New Filing
                </a>
            </Link>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyFilings;
