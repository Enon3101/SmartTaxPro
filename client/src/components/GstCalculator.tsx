import React, { useState, useEffect } from 'react';

const GstCalculator: React.FC = () => {
  const [amount, setAmount] = useState<number | string>('');
  const [gstRate, setGstRate] = useState<number | string>(5); // Default GST rate
  const [isGstIncluded, setIsGstIncluded] = useState<boolean>(false);

  const [gstAmount, setGstAmount] = useState<number>(0);
  const [netAmount, setNetAmount] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);

  useEffect(() => {
    calculateGst();
  }, [amount, gstRate, isGstIncluded]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value === '' ? '' : parseFloat(e.target.value));
  };

  const handleGstRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGstRate(e.target.value === '' ? '' : parseFloat(e.target.value));
  };

  const calculateGst = () => {
    const numAmount = parseFloat(String(amount));
    const numGstRate = parseFloat(String(gstRate));

    if (isNaN(numAmount) || isNaN(numGstRate) || numGstRate < 0) {
      setGstAmount(0);
      setNetAmount(0);
      setGrossAmount(0);
      return;
    }

    if (isGstIncluded) {
      // GST is included in the amount
      const calculatedGrossAmount = numAmount;
      const calculatedNetAmount = numAmount / (1 + numGstRate / 100);
      const calculatedGstAmount = calculatedGrossAmount - calculatedNetAmount;

      setGrossAmount(parseFloat(calculatedGrossAmount.toFixed(2)));
      setNetAmount(parseFloat(calculatedNetAmount.toFixed(2)));
      setGstAmount(parseFloat(calculatedGstAmount.toFixed(2)));
    } else {
      // GST is excluded (to be added to the amount)
      const calculatedNetAmount = numAmount;
      const calculatedGstAmount = calculatedNetAmount * (numGstRate / 100);
      const calculatedGrossAmount = calculatedNetAmount + calculatedGstAmount;

      setNetAmount(parseFloat(calculatedNetAmount.toFixed(2)));
      setGstAmount(parseFloat(calculatedGstAmount.toFixed(2)));
      setGrossAmount(parseFloat(calculatedGrossAmount.toFixed(2)));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">GST Calculator</h2>

      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Enter amount"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="gstRate" className="block text-sm font-medium text-gray-700 mb-1">
          GST Rate (%)
        </label>
        <input
          type="number"
          id="gstRate"
          value={gstRate}
          onChange={handleGstRateChange}
          placeholder="Enter GST rate"
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="mb-6">
        <fieldset>
          <legend className="text-sm font-medium text-gray-700 mb-1">GST Treatment</legend>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input
                id="gstExclusive"
                name="gstTreatment"
                type="radio"
                checked={!isGstIncluded}
                onChange={() => setIsGstIncluded(false)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="gstExclusive" className="ml-3 block text-sm font-medium text-gray-700">
                Exclude GST (GST will be added to the amount)
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="gstInclusive"
                name="gstTreatment"
                type="radio"
                checked={isGstIncluded}
                onChange={() => setIsGstIncluded(true)}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="gstInclusive" className="ml-3 block text-sm font-medium text-gray-700">
                Include GST (Amount already includes GST)
              </label>
            </div>
          </div>
        </fieldset>
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Calculation Results:</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Base Amount:</span>
            <span className="text-sm font-semibold text-gray-800">
              {isGstIncluded ? netAmount.toFixed(2) : amount !== '' ? parseFloat(String(amount)).toFixed(2) : '0.00'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">GST Amount:</span>
            <span className="text-sm font-semibold text-gray-800">{gstAmount.toFixed(2)}</span>
          </div>
          <hr className="my-1 border-gray-300"/>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Total Amount (Gross):</span>
            <span className="text-sm font-bold text-indigo-600">
              {isGstIncluded ? (amount !== '' ? parseFloat(String(amount)).toFixed(2) : '0.00') : grossAmount.toFixed(2)}
            </span>
          </div>
           {isGstIncluded && (
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">(Original input amount was inclusive of GST)</span>
            </div>
          )}
           {!isGstIncluded && amount !== '' && (
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">(Original input amount was exclusive of GST)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GstCalculator;
