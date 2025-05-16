/**
 * Calculator API client for making requests to the calculator endpoints
 */

// Home Loan Calculator
export interface HomeLoanRequest {
  principal: number;
  interestRate: number;
  tenureYears: number;
}

export interface HomeLoanResponse {
  monthlyEmi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  tenureYears: number;
  interestRate: number;
  loanType: string;
  additionalInfo: {
    stampDuty: number;
    registrationFee: number;
    processingFee: number;
  };
}

// Car Loan Calculator
export interface CarLoanRequest {
  principal: number;
  interestRate: number;
  tenureYears: number;
}

export interface CarLoanResponse {
  monthlyEmi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  tenureYears: number;
  interestRate: number;
  loanType: string;
  additionalInfo: {
    insurance: number;
    processingFee: number;
    roadTax: number;
  };
}

// Personal Loan Calculator
export interface PersonalLoanRequest {
  principal: number;
  interestRate: number;
  tenureYears: number;
}

export interface PersonalLoanResponse {
  monthlyEmi: number;
  totalAmount: number;
  totalInterest: number;
  principal: number;
  tenureYears: number;
  interestRate: number;
  loanType: string;
  additionalInfo: {
    processingFee: number;
    prePaymentPenalty: number;
  };
}

// SIP Calculator
export interface SipCalculatorRequest {
  monthlyInvestment: number;
  expectedReturnRate: number;
  tenureYears: number;
}

export interface SipCalculatorResponse {
  totalInvestment: number;
  interestEarned: number;
  maturityValue: number;
  monthlyInvestment: number;
  expectedReturnRate: number;
  tenureYears: number;
}

// Base calculator client for handling API requests
class CalculatorClient {
  private baseUrl: string = '/api/calculators';

  private async makeRequest<T, R>(endpoint: string, data: T): Promise<R> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Calculator API error: ${response.status}`);
      }

      return await response.json() as R;
    } catch (error) {
      console.error(`Error in calculator request to ${endpoint}:`, error);
      throw error;
    }
  }

  // Home Loan Calculator
  async calculateHomeLoan(data: HomeLoanRequest): Promise<HomeLoanResponse> {
    return this.makeRequest<HomeLoanRequest, HomeLoanResponse>('home-loan', data);
  }

  // Car Loan Calculator
  async calculateCarLoan(data: CarLoanRequest): Promise<CarLoanResponse> {
    return this.makeRequest<CarLoanRequest, CarLoanResponse>('car-loan', data);
  }

  // Personal Loan Calculator
  async calculatePersonalLoan(data: PersonalLoanRequest): Promise<PersonalLoanResponse> {
    return this.makeRequest<PersonalLoanRequest, PersonalLoanResponse>('personal-loan', data);
  }

  // SIP Calculator
  async calculateSip(data: SipCalculatorRequest): Promise<SipCalculatorResponse> {
    return this.makeRequest<SipCalculatorRequest, SipCalculatorResponse>('sip', data);
  }

  // Generic Loan EMI Calculator
  async calculateLoanEmi(data: {
    principal: number;
    interestRate: number;
    tenureYears: number;
  }): Promise<{
    monthlyEmi: number;
    totalAmount: number;
    totalInterest: number;
    principal: number;
    tenureYears: number;
    interestRate: number;
  }> {
    return this.makeRequest('loan-emi', data);
  }
}

// Export singleton instance
export const calculatorClient = new CalculatorClient();