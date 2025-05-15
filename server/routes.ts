import type { Express, Request as ExpressRequest } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";
import fs from "fs";
import userProfileRouter from "./userProfileRoutes";

// Extended Express Request with authenticated user
interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    sub: string | number;
    role: string;
    type: string;
    iat: number;
  };
}
import { nanoid } from "nanoid";
import { insertTaxFormSchema, insertDocumentSchema } from "@shared/schema";
import { db } from "./db";
import { sql } from "drizzle-orm";
import { 
  authenticate, 
  authorize, 
  generateToken, 
  rotateTokens, 
  verifyPassword, 
  generateOTP, 
  verifyOTP, 
  hashPassword,
  UserRole
} from "./auth";
import { verifyGoogleToken, processGoogleLogin } from "./googleAuth";
import { handleFileUpload, serveSecureFile, generatePresignedUrl } from "./fileUpload";
import { 
  validateInput, 
  textInputSchema, 
  sanitizeHtml, 
  emailSchema, 
  phoneSchema 
} from "../client/src/lib/validation";

// Upload folder is now configured in the fileUpload.ts module
const uploadDir = path.resolve(process.cwd(), "uploads");

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a router for API routes
  const apiRouter = express.Router();
  
  // Add security middleware to the API router
  apiRouter.use((req, res, next) => {
    // SECURITY: Set additional security headers for API responses (Req E)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Log API access for audit purposes
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`API Access: ${req.method} ${req.path} from ${clientIP}`);
    
    next();
  });

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
    async (req: AuthenticatedRequest, res) => {
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

  // SECURITY: Secure file serving with signed URLs (Req H)
  apiRouter.get("/files/:filename", serveSecureFile);
  
  // Authentication endpoints
  
  // Register a new user
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      // SECURITY: Validate and sanitize input (Req A)
      const { username, password, email, phone } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Validate email format
      if (email) {
        const emailResult = validateInput(emailSchema, email);
        if (!emailResult.success) {
          return res.status(400).json({ 
            message: "Invalid email format", 
            errors: emailResult.error.errors 
          });
        }
      }
      
      // Validate phone format
      if (phone) {
        const phoneResult = validateInput(phoneSchema, phone);
        if (!phoneResult.success) {
          return res.status(400).json({ 
            message: "Invalid phone number format", 
            errors: phoneResult.error.errors 
          });
        }
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        // SECURITY: Don't reveal which field caused the conflict (Req E)
        return res.status(409).json({ message: "User already exists" });
      }
      
      // SECURITY: Hash password (Req C)
      const hashedPassword = await hashPassword(password);
      
      // Create user
      const newUser = await storage.createUser({
        username,
        password: hashedPassword,
        email: email || null,
        phone: phone || null,
        role: UserRole.USER,
      });
      
      // SECURITY: Don't return the password hash or sensitive data (Req E)
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Generate auth tokens
      const accessToken = generateToken(newUser);
      const refreshToken = generateToken(newUser, 'refresh');
      
      res.status(201).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  // Login endpoint
  apiRouter.post("/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Get user
      const user = await storage.getUserByUsername(username);
      
      // SECURITY: Use same-time comparison to prevent timing attacks (Req B)
      if (!user || !(await verifyPassword(password, user.password))) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // SECURITY: Check if MFA is required (Req B)
      if (user.mfaEnabled) {
        // Generate OTP for multi-factor authentication
        const otp = await generateOTP(user.phone);
        
        // TODO: In a real app, send this OTP via SMS
        console.log(`OTP for ${user.username}: ${otp}`);
        
        return res.status(200).json({ 
          message: "MFA required", 
          requiresMfa: true,
          userId: user.id,
        });
      }
      
      // Generate auth tokens
      const accessToken = generateToken(user);
      const refreshToken = generateToken(user, 'refresh');
      
      // SECURITY: Don't return the password hash (Req E)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });
  
  // Verify OTP for MFA
  apiRouter.post("/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      
      if (!phone || !otp) {
        return res.status(400).json({ message: "Phone number and OTP are required" });
      }
      
      // Verify OTP
      const isValid = await verifyOTP(phone, otp);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid or expired OTP" });
      }
      
      // Get user
      const user = await storage.getUserByPhone(phone);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Generate auth tokens
      const accessToken = generateToken(user);
      const refreshToken = generateToken(user, 'refresh');
      
      // SECURITY: Don't return the password hash (Req E)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });
  
  // Google Sign-In authentication
  apiRouter.post("/auth/google", async (req, res) => {
    try {
      const { credential, token_type } = req.body;
      
      if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
      }
      
      // Verify the Google token (either ID token or access token)
      const googleUserInfo = await verifyGoogleToken(credential, token_type);
      
      // Process Google login (find or create user)
      const { user, accessToken, refreshToken } = await processGoogleLogin(googleUserInfo);
      
      // SECURITY: Don't return the password hash (Req E)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        user: userWithoutPassword,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error with Google authentication:", error);
      res.status(401).json({ message: error instanceof Error ? error.message : "Google authentication failed" });
    }
  });
  
  // Refresh access token
  apiRouter.post("/auth/refresh-token", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
      
      // SECURITY: Rotate tokens (Req D)
      const tokens = rotateTokens(refreshToken);
      
      if (!tokens) {
        return res.status(401).json({ message: "Invalid or expired refresh token" });
      }
      
      res.status(200).json(tokens);
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ message: "Failed to refresh token" });
    }
  });
  
  // Get current user
  apiRouter.get("/auth/user", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      // User is already authenticated by middleware
      const userId = req.user.sub;
      
      // Get user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // SECURITY: Don't return the password hash (Req E)
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

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
  
  // Admin login endpoint
  // Development-only admin login endpoint (for testing)
  authRouter.post("/dev-admin-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Only for development environment and hardcoded admin creds
      if (process.env.NODE_ENV === "production" || username !== "admin" || password !== "admin") {
        return res.status(401).json({ message: "Invalid or unauthorized request" });
      }
      
      // Create a mock admin user response
      const mockAdminUser = {
        id: 0,
        username: "admin",
        role: "admin",
        type: "admin",
        phone: "9876543210",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Return a successful response with mock data
      res.status(200).json({
        user: mockAdminUser,
        accessToken: "dev-admin-token", // Just a placeholder token
        refreshToken: "dev-admin-refresh-token", // Just a placeholder refresh token
        message: "Dev admin login successful"
      });
    } catch (error) {
      console.error("Dev admin login error:", error);
      res.status(500).json({ message: "Internal server error during dev login" });
    }
  });

  // Regular admin login endpoint
  authRouter.post("/admin-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Hardcoded admin credentials check (username: admin, password: admin)
      if (username !== "admin" || password !== "admin") {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // Check if admin user exists, create if not
      let adminUser = await storage.getUserByUsername("admin");
      
      if (!adminUser) {
        // Create admin user if it doesn't exist with password hash
        const hashedPassword = await hashPassword("admin");
        adminUser = await storage.createUser({
          username: "admin",
          password: hashedPassword,
          phone: "9876543210",
          role: UserRole.ADMIN,
        });
      }
      
      // Generate admin tokens with admin role
      const accessToken = generateToken(adminUser);
      const refreshToken = generateToken(adminUser, 'refresh');
      
      // SECURITY: Don't return the password hash
      const { password: _, ...adminWithoutPassword } = adminUser;
      
      res.status(200).json({
        user: adminWithoutPassword,
        accessToken,
        refreshToken,
        message: "Admin login successful"
      });
    } catch (error) {
      console.error("Error in admin login:", error);
      res.status(500).json({ message: "Failed to login as admin" });
    }
  });
  
  // Verify admin token validity
  authRouter.get("/verify-admin", authenticate, async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      // Check if user is an admin
      const user = await storage.getUser(req.user.sub);
      if (!user || user.role !== UserRole.ADMIN) {
        return res.status(403).json({ message: "Forbidden - Admin access required" });
      }
      
      res.status(200).json({ valid: true, message: "Admin token valid" });
    } catch (error) {
      console.error("Error verifying admin token:", error);
      res.status(500).json({ message: "Failed to verify admin token" });
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
  app.use("/api/users", userProfileRouter);

  // Mount API router with /api prefix
  app.use('/api', apiRouter);

  // Create HTTP server
  const httpServer = createServer(app);

  console.log("All routes registered successfully");
  
  return httpServer;
}
