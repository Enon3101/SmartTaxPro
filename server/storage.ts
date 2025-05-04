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

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import("./db");
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Tax form operations
  async createTaxForm(insertTaxForm: InsertTaxForm): Promise<TaxForm> {
    const { db } = await import("./db");
    const createdAt = new Date();
    const updatedAt = new Date();
    
    const taxFormData = {
      ...insertTaxForm,
      personalInfo: insertTaxForm.personalInfo ?? null,
      formType: insertTaxForm.formType || "ITR-1",
      incomeData: insertTaxForm.incomeData ?? null,
      deductions80C: insertTaxForm.deductions80C ?? null,
      deductions80D: insertTaxForm.deductions80D ?? null,
      otherDeductions: insertTaxForm.otherDeductions ?? null,
      taxPaid: insertTaxForm.taxPaid ?? null,
      assessmentYear: insertTaxForm.assessmentYear || "2024-25",
      createdAt,
      updatedAt
    };
    
    const [taxForm] = await db
      .insert(taxForms)
      .values(taxFormData)
      .returning();
      
    return taxForm;
  }

  async getTaxFormById(id: string): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    const [taxForm] = await db.select().from(taxForms).where(eq(taxForms.id, id));
    return taxForm || undefined;
  }

  async getTaxFormsByUserId(userId: number): Promise<TaxForm[]> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    return db.select().from(taxForms).where(eq(taxForms.userId, userId));
  }

  async updateTaxFormPersonalInfo(id: string, personalInfo: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        personalInfo, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormIncomeData(id: string, incomeData: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        incomeData, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormDeductions80C(id: string, deductions80C: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        deductions80C, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormDeductions80D(id: string, deductions80D: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        deductions80D, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormOtherDeductions(id: string, otherDeductions: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        otherDeductions, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormTaxPaid(id: string, taxPaid: any): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        taxPaid, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormType(id: string, formType: string): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        formType, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  async updateTaxFormStatus(id: string, status: string): Promise<TaxForm | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [updatedTaxForm] = await db
      .update(taxForms)
      .set({ 
        status, 
        updatedAt: new Date() 
      })
      .where(eq(taxForms.id, id))
      .returning();
      
    return updatedTaxForm || undefined;
  }

  // Document operations
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const { db } = await import("./db");
    
    const [document] = await db
      .insert(documents)
      .values({
        ...insertDocument,
        uploadedAt: new Date()
      })
      .returning();
      
    return document;
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
      
    return document || undefined;
  }

  async getDocumentsByTaxFormId(taxFormId: string): Promise<Document[]> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    return db
      .select()
      .from(documents)
      .where(eq(documents.taxFormId, taxFormId));
  }

  async deleteDocument(id: string): Promise<void> {
    const { db } = await import("./db");
    const { eq } = await import("drizzle-orm");
    
    await db
      .delete(documents)
      .where(eq(documents.id, id));
  }
}

export const storage = new DatabaseStorage();
