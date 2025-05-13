import { 
  User, InsertUser, users, 
  TaxForm, InsertTaxForm, taxForms,
  Document, InsertDocument, documents,
  OtpVerification, InsertOtpVerification, otpVerifications,
  BlogPost, InsertBlogPost, blogPosts
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // OTP operations
  createOtpVerification(otpVerification: InsertOtpVerification): Promise<OtpVerification>;
  getLatestOtpForPhone(phone: string): Promise<OtpVerification | undefined>;
  verifyOtp(phone: string, otp: string): Promise<boolean>;
  updateOtpVerificationStatus(id: number, verified: boolean): Promise<OtpVerification | undefined>;
  
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
  
  // Blog post operations
  createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getAllBlogPosts(options?: { limit?: number, offset?: number, published?: boolean, category?: string, searchTerm?: string }): Promise<{ posts: BlogPost[], total: number }>;
  updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<void>;
}

import { desc, eq, and, like, or, sql, asc, SQL, gte } from "drizzle-orm";
import { db } from "./db";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // OTP verification methods
  async createOtpVerification(otpVerification: InsertOtpVerification): Promise<OtpVerification> {
    const [verification] = await db
      .insert(otpVerifications)
      .values(otpVerification)
      .returning();
    return verification;
  }
  
  async getLatestOtpForPhone(phone: string): Promise<OtpVerification | undefined> {
    const [latestOtp] = await db
      .select()
      .from(otpVerifications)
      .where(eq(otpVerifications.phone, phone))
      .orderBy(desc(otpVerifications.createdAt))
      .limit(1);
    return latestOtp || undefined;
  }
  
  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    // Get latest non-expired OTP for this phone
    const [otpRecord] = await db
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.phone, phone),
          eq(otpVerifications.otp, otp),
          eq(otpVerifications.verified, false),
          gte(otpVerifications.expiresAt, new Date())
        )
      )
      .limit(1);
    
    if (!otpRecord) {
      return false;
    }
    
    // Mark OTP as verified
    await db
      .update(otpVerifications)
      .set({ verified: true })
      .where(eq(otpVerifications.id, otpRecord.id));
    
    return true;
  }
  
  async updateOtpVerificationStatus(id: number, verified: boolean): Promise<OtpVerification | undefined> {
    const [updatedVerification] = await db
      .update(otpVerifications)
      .set({ verified })
      .where(eq(otpVerifications.id, id))
      .returning();
      
    return updatedVerification || undefined;
  }

  // Tax form operations
  async createTaxForm(insertTaxForm: InsertTaxForm): Promise<TaxForm> {
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
    const [taxForm] = await db.select().from(taxForms).where(eq(taxForms.id, id));
    return taxForm || undefined;
  }

  async getTaxFormsByUserId(userId: number): Promise<TaxForm[]> {
    return db.select().from(taxForms).where(eq(taxForms.userId, userId));
  }

  async updateTaxFormPersonalInfo(id: string, personalInfo: any): Promise<TaxForm | undefined> {
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
    const [document] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id));
      
    return document || undefined;
  }

  async getDocumentsByTaxFormId(taxFormId: string): Promise<Document[]> {
    return db
      .select()
      .from(documents)
      .where(eq(documents.taxFormId, taxFormId));
  }

  async deleteDocument(id: string): Promise<void> {
    await db
      .delete(documents)
      .where(eq(documents.id, id));
  }
  
  // Blog post operations
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...blogPost,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    return post;
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async getAllBlogPosts(options?: { 
    limit?: number; 
    offset?: number; 
    published?: boolean; 
    category?: string;
    searchTerm?: string;
  }): Promise<{ posts: BlogPost[]; total: number }> {
    let query = db.select().from(blogPosts);
    
    // Apply filters
    const conditions = [];
    
    if (options?.published !== undefined) {
      conditions.push(eq(blogPosts.published, options.published));
    }
    
    if (options?.category) {
      conditions.push(eq(blogPosts.category, options.category));
    }
    
    if (options?.searchTerm) {
      conditions.push(
        or(
          like(blogPosts.title, `%${options.searchTerm}%`),
          like(blogPosts.content, `%${options.searchTerm}%`),
          like(blogPosts.summary, `%${options.searchTerm}%`)
        )
      );
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    // Get total count
    const totalCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(blogPosts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);
    
    // Apply pagination
    query = query.orderBy(desc(blogPosts.createdAt));
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    const posts = await query;
    
    return {
      posts,
      total: totalCount[0]?.count || 0
    };
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blogPosts)
      .set({
        ...blogPost,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return updatedPost || undefined;
  }

  async deleteBlogPost(id: number): Promise<void> {
    await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
