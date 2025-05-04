import { 
  User, InsertUser, users, 
  TaxForm, InsertTaxForm, taxForms,
  Document, InsertDocument, documents
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tax form operations
  createTaxForm(taxForm: InsertTaxForm): Promise<TaxForm>;
  getTaxFormById(id: string): Promise<TaxForm | undefined>;
  getTaxFormsByUserId(userId: number): Promise<TaxForm[]>;
  updateTaxFormPersonalInfo(id: string, personalInfo: any): Promise<TaxForm | undefined>;
  updateTaxFormIncomeData(id: string, incomeData: any): Promise<TaxForm | undefined>;
  updateTaxFormDeductions80C(id: string, deductions80C: any): Promise<TaxForm | undefined>;
  updateTaxFormDeductions80D(id: string, deductions80D: any): Promise<TaxForm | undefined>;
  updateTaxFormOtherDeductions(id: string, otherDeductions: any): Promise<TaxForm | undefined>;
  updateTaxFormTaxPaid(id: string, taxPaid: any): Promise<TaxForm | undefined>;
  updateTaxFormType(id: string, formType: string): Promise<TaxForm | undefined>;
  updateTaxFormStatus(id: string, status: string): Promise<TaxForm | undefined>;
  
  // Document operations
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentById(id: string): Promise<Document | undefined>;
  getDocumentsByTaxFormId(taxFormId: string): Promise<Document[]>;
  deleteDocument(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private taxForms: Map<string, TaxForm>;
  private documents: Map<string, Document>;
  private currentUserId: number;

  constructor() {
    this.users = new Map();
    this.taxForms = new Map();
    this.documents = new Map();
    this.currentUserId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Tax form operations
  async createTaxForm(insertTaxForm: InsertTaxForm): Promise<TaxForm> {
    const createdAt = new Date();
    const updatedAt = new Date();
    const taxForm: TaxForm = {
      ...insertTaxForm,
      personalInfo: null,
      formType: insertTaxForm.formType || "ITR-1",
      incomeData: null,
      deductions80C: null,
      deductions80D: null,
      otherDeductions: null,
      taxPaid: null,
      assessmentYear: insertTaxForm.assessmentYear || "2024-25",
      createdAt,
      updatedAt
    };
    this.taxForms.set(insertTaxForm.id, taxForm);
    return taxForm;
  }

  async getTaxFormById(id: string): Promise<TaxForm | undefined> {
    return this.taxForms.get(id);
  }

  async getTaxFormsByUserId(userId: number): Promise<TaxForm[]> {
    return Array.from(this.taxForms.values()).filter(
      (taxForm) => taxForm.userId === userId
    );
  }

  async updateTaxFormPersonalInfo(id: string, personalInfo: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      personalInfo,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormIncomeData(id: string, incomeData: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      incomeData,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormDeductions80C(id: string, deductions80C: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      deductions80C,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormDeductions80D(id: string, deductions80D: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      deductions80D,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormOtherDeductions(id: string, otherDeductions: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      otherDeductions,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormTaxPaid(id: string, taxPaid: any): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      taxPaid,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormType(id: string, formType: string): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      formType,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  async updateTaxFormStatus(id: string, status: string): Promise<TaxForm | undefined> {
    const taxForm = this.taxForms.get(id);
    if (!taxForm) return undefined;

    const updatedTaxForm: TaxForm = {
      ...taxForm,
      status,
      updatedAt: new Date()
    };
    this.taxForms.set(id, updatedTaxForm);
    return updatedTaxForm;
  }

  // Document operations
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const uploadedAt = new Date();
    const document: Document = {
      ...insertDocument,
      uploadedAt
    };
    this.documents.set(insertDocument.id, document);
    return document;
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByTaxFormId(taxFormId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.taxFormId === taxFormId
    );
  }

  async deleteDocument(id: string): Promise<void> {
    this.documents.delete(id);
  }
}

export const storage = new MemStorage();
