import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { insertTaxFormSchema, insertDocumentSchema } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { authenticate, authorize } from "./auth";
import { handleFileUpload, serveSecureFile, generatePresignedUrl } from "./fileUpload";
import { validateInput, textInputSchema, sanitizeHtml } from "../client/src/lib/validation";

// Upload folder is now configured in the fileUpload.ts module
const uploadDir = path.resolve(process.cwd(), "uploads");

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a router for API routes
  const apiRouter = express.Router();

  // Tax Forms API

  // Create a new tax form
  apiRouter.post("/tax-forms", async (req, res) => {
    try {
      const { id, userId, status } = req.body;
      
      // Validate with Zod schema
      const validatedData = insertTaxFormSchema.parse({
        id: id || nanoid(),
        userId: userId || null,
        status: status || "in_progress",
      });
      
      const newTaxForm = await storage.createTaxForm(validatedData);
      res.status(201).json(newTaxForm);
    } catch (error) {
      console.error("Error creating tax form:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create tax form" });
    }
  });

  // Get a tax form by ID
  apiRouter.get("/tax-forms/:id", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      res.json(taxForm);
    } catch (error) {
      console.error("Error fetching tax form:", error);
      res.status(500).json({ message: "Failed to fetch tax form" });
    }
  });

  // Update personal info in a tax form
  apiRouter.post("/tax-forms/:id/personal-info", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormPersonalInfo(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating personal info:", error);
      res.status(500).json({ message: "Failed to update personal information" });
    }
  });

  // Update income data in a tax form
  apiRouter.post("/tax-forms/:id/income", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormIncomeData(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating income data:", error);
      res.status(500).json({ message: "Failed to update income data" });
    }
  });

  // Update Section 80C deductions data
  apiRouter.post("/tax-forms/:id/deductions-80c", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormDeductions80C(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating Section 80C deductions data:", error);
      res.status(500).json({ message: "Failed to update Section 80C deductions data" });
    }
  });

  // Update Section 80D deductions data
  apiRouter.post("/tax-forms/:id/deductions-80d", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormDeductions80D(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating Section 80D deductions data:", error);
      res.status(500).json({ message: "Failed to update Section 80D deductions data" });
    }
  });

  // Update other deductions data
  apiRouter.post("/tax-forms/:id/other-deductions", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormOtherDeductions(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating other deductions data:", error);
      res.status(500).json({ message: "Failed to update other deductions data" });
    }
  });

  // Update tax paid data
  apiRouter.post("/tax-forms/:id/tax-paid", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormTaxPaid(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating tax paid data:", error);
      res.status(500).json({ message: "Failed to update tax paid data" });
    }
  });
  
  // Update form type
  apiRouter.post("/tax-forms/:id/form-type", async (req, res) => {
    try {
      const { formType } = req.body;
      if (!formType || !["ITR-1", "ITR-2", "ITR-3", "ITR-4"].includes(formType)) {
        return res.status(400).json({ message: "Invalid form type" });
      }
      
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormType(req.params.id, formType);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating form type:", error);
      res.status(500).json({ message: "Failed to update form type" });
    }
  });

  // Set tax form status
  apiRouter.post("/tax-forms/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || !["in_progress", "completed", "filed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormStatus(req.params.id, status);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating tax form status:", error);
      res.status(500).json({ message: "Failed to update tax form status" });
    }
  });

  // Documents API

  // Upload a document with security measures
  apiRouter.post(
    "/tax-forms/:id/documents", 
    authenticate, // SECURITY: Require authentication (Req B)
    authorize("upload_documents"), // SECURITY: Check authorization (Req B)
    ...handleFileUpload("file", "document"), // SECURITY: Secure file upload (Req H)
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        
        // SECURITY: Sanitize and validate input (Req A)
        const documentType = validateInput(
          textInputSchema(1, 50, "Document Type"),
          req.body.documentType || "Other"
        );
        
        if (!documentType.success) {
          return res.status(400).json({ 
            message: "Invalid document type", 
            errors: documentType.error.errors 
          });
        }
        
        const taxForm = await storage.getTaxFormById(req.params.id);
        if (!taxForm) {
          return res.status(404).json({ message: "Tax form not found" });
        }
        
        // SECURITY: Verify ownership of tax form (Req B)
        if (req.user && taxForm.userId !== req.user.sub) {
          return res.status(403).json({ message: "You don't have permission to add documents to this tax form" });
        }
        
        const { filename, originalname, mimetype, size } = req.file;
        
        // SECURITY: Generate a secure URL with expiration (Req H)
        const secureUrl = generatePresignedUrl(`/uploads/${filename}`, 60); // 60 minute expiry
        
        const documentData = {
          id: nanoid(),
          taxFormId: req.params.id,
          name: sanitizeHtml(originalname), // SECURITY: Sanitize filename (Req A)
          type: mimetype,
          size: size,
          documentType: documentType.data,
          url: secureUrl,
        };
        
        // Validate with Zod schema
        const validatedData = insertDocumentSchema.parse(documentData);
        
        const document = await storage.createDocument(validatedData);
        res.status(201).json(document);
      } catch (error) {
        console.error("Error uploading document:", error);
        res.status(500).json({ message: "Failed to upload document" });
      }
    }
  );

  // Get all documents for a tax form
  apiRouter.get("/tax-forms/:id/documents", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const documents = await storage.getDocumentsByTaxFormId(req.params.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Delete a document
  apiRouter.delete("/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      // Remove the file from the filesystem
      const filePath = path.join(uploadDir, path.basename(document.url));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      await storage.deleteDocument(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Set up the uploads directory to serve files
  app.use("/uploads", express.static(uploadDir));

  // Test endpoint for OpenRouter API
  apiRouter.get("/test-openrouter", async (req, res) => {
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.json({
          success: false,
          message: "OpenRouter API key is missing"
        });
      }
      
      // Try a super simple request to the API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com", // Replace with your domain
          "X-Title": "Indian Tax Expert"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // Use a free-tier model
          messages: [
            {
              role: "user",
              content: "Hello, what is 2+2?"
            }
          ],
          temperature: 0.2
        })
      });
      
      const data = await response.json();
      console.log("Test API response:", JSON.stringify(data));
      
      res.json({
        success: true,
        response: data
      });
    } catch (error) {
      console.error("Error testing OpenRouter API:", error);
      res.json({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Tax Expert Chatbot API Status Check
  apiRouter.get("/tax-expert-chat/status", async (req, res) => {
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.json({
          configured: false,
          message: "OpenRouter API key is missing"
        });
      }
      
      // Try to get the list of available models
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com" // Replace with your domain
        }
      });
      
      const data = await response.json();
      console.log("Available models:", JSON.stringify(data).substring(0, 500) + "...");
      
      if (data.data && data.data.length > 0) {
        // Get available models
        const availableModels = data.data.map((model: any) => model.id);
        
        console.log("Available OpenRouter models:", availableModels);
        
        res.json({
          configured: true,
          message: "OpenRouter API is configured",
          availableModels
        });
      } else {
        res.json({
          configured: true,
          message: "OpenRouter API is configured, but no models were found",
          error: data.error || "Unknown error"
        });
      }
    } catch (error) {
      console.error("Error checking API status:", error);
      res.json({
        configured: !!process.env.OPENROUTER_API_KEY,
        message: "Error checking API status",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Tax Expert Chatbot API
  apiRouter.post("/tax-expert-chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Check if API key is provided
      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({ 
          error: "Missing OpenRouter API key", 
          details: "The API key for OpenRouter is not configured."
        });
      }

      // Fetch from OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com", // Replace with your domain
          "X-Title": "Indian Tax Expert"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo", // Use a free-tier model
          messages: [
            {
              role: "system",
              content: `You are TaxGuru, an expert on Indian Income Tax laws and regulations. You provide accurate, helpful information about Indian tax regulations, forms, deductions, exemptions, and filing requirements. Current date: ${new Date().toLocaleDateString()}`
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.2,
          max_tokens: 800
        })
      });

      const data = await response.json();
      
      // Handle response format from OpenRouter API
      if (data.error) {
        console.error("OpenRouter API error:", data.error);
        return res.status(500).json({ 
          error: "Error getting response from tax expert", 
          details: JSON.stringify(data.error)
        });
      }

      console.log("OpenRouter API response format:", JSON.stringify(data).substring(0, 200) + "...");

      let responseText = "";
      try {
        console.log("Full API response:", JSON.stringify(data));
        
        // The OpenRouter API response follows OpenAI format
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
          responseText = data.choices[0].message.content;
        } else if (data && data.error) {
          // Error response
          throw new Error(JSON.stringify(data.error));
        } else {
          // If we can't find the text in expected locations, return the raw data
          responseText = "I couldn't format my response properly. Here's what I received: " + 
                         JSON.stringify(data).substring(0, 500);
        }
      } catch (e) {
        console.error("Error parsing OpenRouter response:", e);
        console.error("OpenRouter response:", JSON.stringify(data));
        return res.status(500).json({ error: "Error parsing response from tax expert" });
      }

      res.json({ response: responseText });
    } catch (error) {
      console.error("Tax chatbot error:", error);
      res.status(500).json({ error: "Failed to get response from tax expert" });
    }
  });

  // Admin API routes
  const adminRouter = express.Router();

  // Get all users (admin only)
  adminRouter.get("/users", async (req, res) => {
    try {
      const { users } = await import("@shared/schema");
      const { db } = await import("./db");
      const allUsers = await db.select().from(users);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Create new user (admin only)
  adminRouter.post("/users", async (req, res) => {
    try {
      const { username, email, password, role } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const user = await storage.createUser({
        username,
        email,
        password,
        role: role || "user"
      });
      
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ message: error instanceof Error ? error.message : "Failed to create user" });
    }
  });

  // Delete user (admin only)
  adminRouter.delete("/users/:id", async (req, res) => {
    try {
      const { users } = await import("@shared/schema");
      const { db } = await import("./db");
      const { eq } = await import("drizzle-orm");
      const userId = Number(req.params.id);
      
      await db.delete(users).where(eq(users.id, userId));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Get all tax forms (admin only)
  adminRouter.get("/tax-forms", async (req, res) => {
    try {
      const { taxForms } = await import("@shared/schema");
      const { db } = await import("./db");
      const allForms = await db.select().from(taxForms);
      res.json(allForms);
    } catch (error) {
      console.error("Error fetching tax forms:", error);
      res.status(500).json({ message: "Failed to fetch tax forms" });
    }
  });

  // Update tax form status (admin only)
  adminRouter.patch("/tax-forms/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const taxForm = await storage.updateTaxFormStatus(req.params.id, status);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      res.json(taxForm);
    } catch (error) {
      console.error("Error updating tax form status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Get all documents (admin only)
  adminRouter.get("/documents", async (req, res) => {
    try {
      const { documents } = await import("@shared/schema");
      const { db } = await import("./db");
      const allDocuments = await db.select().from(documents);
      res.json(allDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // Get dashboard stats (admin only)
  adminRouter.get("/stats", async (req, res) => {
    try {
      const { users, taxForms, documents } = await import("@shared/schema");
      const { db } = await import("./db");
      const { count, eq, sql } = await import("drizzle-orm");
      
      // Get total user count
      const [userCount] = await db.select({ value: count() }).from(users);
      
      // Get new users this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      
      const [newUserCount] = await db
        .select({ value: count() })
        .from(users)
        .where(sql`${users.createdAt} >= ${firstDayOfMonth}`);
      
      // Get tax form counts
      const [totalTaxForms] = await db.select({ value: count() }).from(taxForms);
      
      // Get tax form counts by status
      const draftCount = await db
        .select({ value: count() })
        .from(taxForms)
        .where(eq(taxForms.status, "in_progress"))
        .then(res => res[0]?.value || 0);
        
      const submittedCount = await db
        .select({ value: count() })
        .from(taxForms)
        .where(eq(taxForms.status, "completed"))
        .then(res => res[0]?.value || 0);
        
      const filedCount = await db
        .select({ value: count() })
        .from(taxForms)
        .where(eq(taxForms.status, "filed"))
        .then(res => res[0]?.value || 0);
      
      // Get document count
      const [documentCount] = await db.select({ value: count() }).from(documents);
      
      // Mock revenue data (in a real app, would come from payment tracking)
      const totalRevenue = 12500;
      const thisMonthRevenue = 3400;
      
      res.json({
        users: {
          total: userCount.value,
          new: newUserCount.value
        },
        taxForms: {
          total: totalTaxForms.value,
          draft: draftCount,
          submitted: submittedCount,
          processing: 0,
          completed: 0,
          filed: filedCount,
          rejected: 0
        },
        documents: {
          total: documentCount.value
        },
        revenue: {
          total: totalRevenue, 
          thisMonth: thisMonthRevenue
        }
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });

  // Authentication routes
  const authRouter = express.Router();
  
  // TEMPORARY: Direct admin login for testing purposes only
  // REMOVE THIS IN PRODUCTION
  authRouter.post("/dev-admin-login", async (req, res) => {
    try {
      // Check if user exists, if not create admin user
      let adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        // Create admin user if it doesn't exist
        adminUser = await storage.createUser({
          username: "admin",
          password: "admin123", // In a real app, hash this password
          phone: "9876543210",
          role: "admin"
        });
      }
      
      // Return admin user for immediate login
      res.status(200).json({ 
        message: "Admin login successful", 
        user: {
          id: adminUser.id,
          username: adminUser.username,
          phone: adminUser.phone,
          role: adminUser.role
        } 
      });
    } catch (error) {
      console.error("Error in dev admin login:", error);
      res.status(500).json({ message: "Failed to login as admin" });
    }
  });
  
  // Send OTP to mobile number
  authRouter.post("/send-otp", async (req, res) => {
    try {
      const { phone } = req.body;
      
      if (!phone || phone.length < 10) {
        return res.status(400).json({ message: "Valid phone number is required" });
      }
      
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // OTP expires in 10 minutes
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);
      
      // Save OTP in database
      await storage.createOtpVerification({
        phone,
        otp,
        expiresAt,
      });
      
      // In a production environment, you would send OTP via SMS using a service like Twilio
      // For now, we'll just return it in the response (for testing purposes only)
      console.log(`OTP for ${phone}: ${otp}`);
      
      res.status(200).json({ 
        message: "OTP sent successfully",
        phone,
        // In production, don't return the OTP in the response!
        // This is only for development purposes
        otp: process.env.NODE_ENV === "development" ? otp : undefined
      });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });
  
  // Verify OTP and login or register
  authRouter.post("/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ message: "Phone and OTP are required" });
      }
      
      // Verify the OTP
      const isValid = await storage.verifyOtp(phone, otp);
      
      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      
      // Check if user exists
      let user = await storage.getUserByPhone(phone);
      
      if (!user) {
        // Auto-register new user with phone number as username
        const username = `user_${phone.slice(-5)}${Math.floor(Math.random() * 1000)}`;
        const password = Math.random().toString(36).slice(-8);
        
        user = await storage.createUser({
          username,
          password, // In a real app, hash this password
          phone,
          role: "user"
        });
      }
      
      // In a real app, you'd create a session here
      // For now, just return the user object
      res.status(200).json({ 
        message: "Login successful", 
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          role: user.role
        } 
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
  
  // Check user login status
  authRouter.get("/me", async (req, res) => {
    try {
      // In a real app with sessions, check for logged in user
      // For now, we'll mock this
      const userId = req.query.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(Number(userId));
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({
        id: user.id,
        username: user.username,
        phone: user.phone,
        role: user.role
      });
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Database editor routes (admin only)
  const dbEditorRouter = express.Router();
  
  // Get all tables in the database
  dbEditorRouter.get("/tables", async (req, res) => {
    try {
      const result = await db.execute(sql`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ message: "Failed to fetch database tables" });
    }
  });
  
  // Get table schema
  dbEditorRouter.get("/tables/:tableName/schema", async (req, res) => {
    try {
      const { tableName } = req.params;
      
      // Get column information
      const result = await db.execute(sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        ORDER BY ordinal_position
      `);
      
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching table schema:", error);
      res.status(500).json({ message: "Failed to fetch table schema" });
    }
  });
  
  // Get table data with pagination
  dbEditorRouter.get("/tables/:tableName/data", async (req, res) => {
    try {
      const { tableName } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;
      
      // Get table data with pagination
      const dataResult = await db.execute(sql`
        SELECT * FROM ${sql.identifier(tableName)}
        LIMIT ${pageSize} OFFSET ${offset}
      `);
      
      // Get total count for pagination
      const countResult = await db.execute(sql`
        SELECT COUNT(*) FROM ${sql.identifier(tableName)}
      `);
      
      const totalCount = parseInt(countResult.rows[0]?.count || "0");
      const totalPages = Math.ceil(totalCount / pageSize);
      
      res.json({
        data: dataResult.rows,
        pagination: {
          page,
          pageSize,
          totalCount,
          totalPages
        }
      });
    } catch (error) {
      console.error("Error fetching table data:", error);
      res.status(500).json({ message: "Failed to fetch table data" });
    }
  });
  
  // Run custom SQL query
  dbEditorRouter.post("/query", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query) {
        return res.status(400).json({ message: "SQL query is required" });
      }
      
      // Limit to SELECT queries for safety
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery.startsWith('select')) {
        return res.status(403).json({ 
          message: "Only SELECT queries are allowed through this endpoint for safety" 
        });
      }
      
      const result = await db.execute(sql.raw(query));
      res.json({
        rows: result.rows,
        rowCount: result.rowCount
      });
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).json({ 
        message: "Failed to execute SQL query", 
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Mount the API routers
  app.use("/api", apiRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/admin/db", dbEditorRouter);

  const httpServer = createServer(app);

  return httpServer;
}
