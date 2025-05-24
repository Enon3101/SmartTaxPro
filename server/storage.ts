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
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserGoogleId(userId: number, googleId: string): Promise<User>;
  
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
import { hashPassword } from "./auth"; // Import hashPassword

export class DatabaseStorage implements IStorage {
  private checkDb(): void {
    if (!db) {
      console.error("Database service is not available.");
      throw new Error("Database service is currently unavailable.");
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    this.checkDb();
    const [user] = await db!.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    this.checkDb();
    const [user] = await db!.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async getUserByPhone(phone: string): Promise<User | undefined> {
    this.checkDb();
    const [user] = await db!.select().from(users).where(eq(users.phone, phone));
    return user || undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    this.checkDb();
    if (!email) return undefined;
    const [user] = await db!.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }
  
  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    this.checkDb();
    if (!googleId) return undefined;
    const [user] = await db!.select().from(users).where(eq(users.googleId, googleId));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    this.checkDb();
    const [user] = await db!
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  async updateUserGoogleId(userId: number, googleId: string): Promise<User> {
    this.checkDb();
    const [updatedUser] = await db!
      .update(users)
      .set({ 
        googleId, 
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
      
    return updatedUser;
  }
  
  // OTP verification methods
  async createOtpVerification(otpVerification: InsertOtpVerification): Promise<OtpVerification> {
    this.checkDb();
    const [verification] = await db!
      .insert(otpVerifications)
      .values(otpVerification)
      .returning();
    return verification;
  }
  
  async getLatestOtpForPhone(phone: string): Promise<OtpVerification | undefined> {
    this.checkDb();
    const [latestOtp] = await db!
      .select()
      .from(otpVerifications)
      .where(eq(otpVerifications.phone, phone))
      .orderBy(desc(otpVerifications.createdAt))
      .limit(1);
    return latestOtp || undefined;
  }
  
  async verifyOtp(phone: string, plaintextOtp: string): Promise<boolean> { // Renamed otp to plaintextOtp for clarity
    this.checkDb();
    const hashedInputOtp = await hashPassword(plaintextOtp); // Hash the input OTP
    // Get latest non-expired OTP for this phone
    const [otpRecord] = await db!
      .select()
      .from(otpVerifications)
      .where(
        and(
          eq(otpVerifications.phone, phone),
          eq(otpVerifications.otp, hashedInputOtp), // Compare HASHED input with STORED HASH
          eq(otpVerifications.verified, false),
          gte(otpVerifications.expiresAt, new Date())
        )
      )
      .limit(1);
    
    if (!otpRecord) {
      return false;
    }
    
    // Mark OTP as verified
    await db!
      .update(otpVerifications)
      .set({ verified: true })
      .where(eq(otpVerifications.id, otpRecord.id));
    
    return true;
  }
  
  async updateOtpVerificationStatus(id: number, verified: boolean): Promise<OtpVerification | undefined> {
    this.checkDb();
    const [updatedVerification] = await db!
      .update(otpVerifications)
      .set({ verified })
      .where(eq(otpVerifications.id, id))
      .returning();
      
    return updatedVerification || undefined;
  }

  // Tax form operations
  async createTaxForm(insertTaxForm: InsertTaxForm): Promise<TaxForm> {
    this.checkDb();
    const createdAt = new Date();
    const updatedAt = new Date();
    
    // Fields in insertTaxForm are id, userId, status, formType, assessmentYear
    // Other fields (personalInfo, incomeData etc.) are jsonb and will default to null in DB or be updated later.
    const taxFormData = {
      ...insertTaxForm, // Contains all fields from InsertTaxForm type
      createdAt,
      updatedAt
    };
    
    const [taxForm] = await db!
      .insert(taxForms)
      .values(taxFormData)
      .returning();
      
    return taxForm;
  }

  async getTaxFormById(id: string): Promise<TaxForm | undefined> {
    this.checkDb();
    const [taxForm] = await db!.select().from(taxForms).where(eq(taxForms.id, id));
    return taxForm || undefined;
  }

  async getTaxFormsByUserId(userId: number): Promise<TaxForm[]> {
    this.checkDb();
    return db!.select().from(taxForms).where(eq(taxForms.userId, userId));
  }

  async updateTaxFormPersonalInfo(id: string, personalInfo: any): Promise<TaxForm | undefined> {
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [updatedTaxForm] = await db!
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
    this.checkDb();
    const [document] = await db!
      .insert(documents)
      .values({
        ...insertDocument,
        uploadedAt: new Date()
      })
      .returning();
      
    return document;
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    this.checkDb();
    const [document] = await db!
      .select()
      .from(documents)
      .where(eq(documents.id, id));
      
    return document || undefined;
  }

  async getDocumentsByTaxFormId(taxFormId: string): Promise<Document[]> {
    this.checkDb();
    return db!
      .select()
      .from(documents)
      .where(eq(documents.taxFormId, taxFormId));
  }

  async deleteDocument(id: string): Promise<void> {
    this.checkDb();
    await db!
      .delete(documents)
      .where(eq(documents.id, id));
  }
  
  // Blog post operations
  async createBlogPost(blogPost: InsertBlogPost): Promise<BlogPost> {
    this.checkDb();
    const [post] = await db!
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
    this.checkDb();
    const [post] = await db!
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id));
    return post || undefined;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    this.checkDb();
    const [post] = await db!
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
    this.checkDb();
    
    const conditions: SQL[] = [];
    
    if (options?.published !== undefined) {
      conditions.push(eq(blogPosts.published, options.published));
    }
    
    if (options?.category) {
      conditions.push(eq(blogPosts.category, options.category));
    }
    
    if (options?.searchTerm) {
      const searchTermCondition = or(
        like(blogPosts.title, `%${options.searchTerm}%`),
        like(blogPosts.content, `%${options.searchTerm}%`),
        like(blogPosts.summary, `%${options.searchTerm}%`)
      );
      if (searchTermCondition) { // Ensure 'or' didn't return undefined
        conditions.push(searchTermCondition);
      }
    }

    // Base query for data, to be built step-by-step
    let dataQueryBuilder = db!.select().from(blogPosts).$dynamic(); // Use $dynamic for type flexibility

    if (conditions.length > 0) {
      dataQueryBuilder = dataQueryBuilder.where(and(...conditions));
    }
    
    dataQueryBuilder = dataQueryBuilder.orderBy(desc(blogPosts.createdAt));
    
    if (options?.limit !== undefined) { // Check for undefined explicitly for limit/offset
      dataQueryBuilder = dataQueryBuilder.limit(options.limit);
    }
    
    if (options?.offset !== undefined) {
      dataQueryBuilder = dataQueryBuilder.offset(options.offset);
    }
    
    const posts = await dataQueryBuilder;

    // Base query for total count
    let countQueryBuilder = db!.select({ count: sql<number>`count(*)` }).from(blogPosts).$dynamic();
    if (conditions.length > 0) {
      countQueryBuilder = countQueryBuilder.where(and(...conditions));
    }
    const totalCountResult = await countQueryBuilder;
    
    return {
      posts,
      total: totalCountResult[0]?.count || 0
    };
  }

  async updateBlogPost(id: number, blogPost: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    this.checkDb();
    const [updatedPost] = await db!
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
    this.checkDb();
    await db!
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
  }
}

export const storage = new DatabaseStorage();
