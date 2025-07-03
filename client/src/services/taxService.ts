import { TaxFormData, TaxSummary } from '../types/tax';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

class TaxService {
  private baseUrl = `${API_BASE_URL}/tax`;

  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async saveTaxForm(formData: TaxFormData): Promise<{ id: string; message: string }> {
    const response = await fetch(`${this.baseUrl}/forms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save tax form');
    }

    return response.json();
  }

  async getTaxForm(id: string): Promise<TaxFormData> {
    const response = await fetch(`${this.baseUrl}/forms/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get tax form');
    }

    return response.json();
  }

  async updateTaxForm(id: string, formData: Partial<TaxFormData>): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/forms/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update tax form');
    }

    return response.json();
  }

  async getUserTaxForms(): Promise<TaxFormData[]> {
    const response = await fetch(`${this.baseUrl}/forms/user`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get user tax forms');
    }

    return response.json();
  }

  async calculateTax(formData: TaxFormData): Promise<TaxSummary> {
    const response = await fetch(`${this.baseUrl}/calculate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to calculate tax');
    }

    return response.json();
  }

  async submitTaxForm(id: string): Promise<{ message: string; submissionId: string }> {
    const response = await fetch(`${this.baseUrl}/forms/${id}/submit`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit tax form');
    }

    return response.json();
  }

  async downloadTaxDocument(id: string, format: 'pdf' | 'xml' = 'pdf'): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/forms/${id}/download?format=${format}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to download tax document');
    }

    return response.blob();
  }

  async validatePAN(pan: string): Promise<{ isValid: boolean; entityType?: string }> {
    const response = await fetch(`${this.baseUrl}/validate-pan`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ pan }),
    });

    if (!response.ok) {
      throw new Error('Failed to validate PAN');
    }

    return response.json();
  }
}

export const taxService = new TaxService();