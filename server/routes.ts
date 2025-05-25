import fs from "fs";
import { createServer, type Server } from "http";
import path from "path";

// Removed duplicate imports of fs, createServer, Server, path

import { sql, eq as drizzleEq, gte } from "drizzle-orm";
import express, { type Express } from "express";
import { nanoid } from "nanoid";
import passport from 'passport';

import { 
  InsertBlogPost,
  insertTaxFormSchema,
  insertDocumentSchema,
  userRoleEnum as sharedUserRoleEnum,
} from "@shared/schema";

// Local/Project specific imports - final attempt at ordering
import { 
  AuthenticatedRequest,
  UserRole,
  authorize, 
  generateToken, 
  hashPassword,
  registerUser,
  rotateTokens, 
  verifyPassword, 
} from "./auth"; 
import blogRouter from "./blogRoutes"; 
import calculatorRouter from "./calculatorRoutes"; // Updated to use the new calculatorRoutes.ts
import { db } from "./db"; 
import { handleFileUpload, serveSecureFile, generatePresignedUrl } from "./fileUpload";
import { verifyGoogleToken, processGoogleLogin } from "./googleAuth"; 
import { storage } from "./storage"; 
import userProfileRouter from "./userProfileRoutes";
import { 
  validateInput, 
  textInputSchema, 
  sanitizeHtml,
} from "../client/src/lib/validation";

// Upload folder is now configured in the fileUpload.ts module
const uploadDir = path.resolve(process.cwd(), "uploads");

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a router for API routes
  const apiRouter = express.Router();
  
  apiRouter.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(`API Access: ${req.method} ${req.path} from ${clientIP}`);
    next();
  });

  apiRouter.get("/config/google-client-id", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (clientId) {
      res.json({ clientId });
    } else {
      res.status(404).json({ error: "Google Client ID not configured" });
    }
  });
  
  apiRouter.use("/calculators", calculatorRouter);
  apiRouter.use("/blog-posts", blogRouter); // Public blog routes

  // Tax Forms API

  // GET all tax forms for the authenticated user
  apiRouter.get("/tax-forms", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user || typeof req.user.sub === 'undefined') {
        return res.status(401).json({ message: "User not authenticated or user ID missing" });
      }
      const userId = Number(req.user.sub);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID format in token" });
      }
      const userTaxForms = await storage.getTaxFormsByUserId(userId);
      res.json(userTaxForms);
    } catch (error) {
      console.error("Error fetching tax forms for user:", error);
      res.status(500).json({ message: "Failed to fetch tax forms for user" });
    }
  });

  apiRouter.post("/tax-forms", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
    try {
      // Ensure req.user and req.user.sub are available after authentication
      if (!req.user || typeof req.user.sub === 'undefined') {
        return res.status(401).json({ message: "User not authenticated or user ID missing" });
      }
      const userIdFromToken = Number(req.user.sub);
      if (isNaN(userIdFromToken)) {
        return res.status(400).json({ message: "Invalid user ID format in token" });
      }

      const { id, status, assessmentYear, formType } = req.body; // userId will come from token
      const validatedData = insertTaxFormSchema.parse({
        id: id || nanoid(),
        userId: userIdFromToken, // Use userId from the authenticated token
        status: status || "in_progress",
        assessmentYear: assessmentYear,
        formType: formType,
      });
      const newTaxForm = await storage.createTaxForm(validatedData);
      res.status(201).json(newTaxForm);
    } catch (error: unknown) { 
      console.error("Error creating tax form:", error);
      const message = error instanceof Error ? error.message : "Failed to create tax form";
      if (error && typeof error === 'object' && error !== null && 'name' in error && (error as {name: string}).name === 'ZodError' && 'errors' in error) { 
        return res.status(400).json({ message: "Validation failed", errors: (error as { errors: any[] }).errors });
      }
      res.status(400).json({ message });
    }
  });

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
  apiRouter.post(
    "/tax-forms/:id/documents", 
    passport.authenticate('jwt', { session: false }), // Use Passport JWT auth
    authorize("upload_documents"), 
    ...handleFileUpload("file", "document"), 
    async (req: AuthenticatedRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        const documentTypeValidation = validateInput(
          textInputSchema(1, 50, "Document Type"),
          req.body.documentType || "Other"
        );
        if (!documentTypeValidation.success) {
          return res.status(400).json({ 
            message: "Invalid document type", 
            errors: (documentTypeValidation.error as { errors?: any[] })?.errors || "Validation failed"
          });
        }
        const taxForm = await storage.getTaxFormById(req.params.id);
        if (!taxForm) {
          return res.status(404).json({ message: "Tax form not found" });
        }
        if (req.user && taxForm.userId !== req.user.sub) {
          return res.status(403).json({ message: "You don't have permission to add documents to this tax form" });
        }
        const { filename, originalname, mimetype, size } = req.file;
        const secureUrl = generatePresignedUrl(`/uploads/${filename}`, 60);
        const documentData = {
          id: nanoid(),
          taxFormId: req.params.id,
          name: sanitizeHtml(originalname),
          type: mimetype,
          size: size,
          documentType: documentTypeValidation.data,
          url: secureUrl,
        };
        const validatedData = insertDocumentSchema.parse(documentData);
        const document = await storage.createDocument(validatedData);
        res.status(201).json(document);
      } catch (error: unknown) { 
      console.error("Error uploading document:", error);
      const message = error instanceof Error ? error.message : "Failed to upload document";
      if (error && typeof error === 'object' && error !== null && 'name' in error && (error as {name: string}).name === 'ZodError' && 'errors' in error) {
            return res.status(400).json({ message: "Validation failed", errors: (error as { errors: any[] }).errors });
        }
      res.status(500).json({ message });
      }
    }
  );

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

  apiRouter.delete("/documents/:id", async (req, res) => {
    try {
      const document = await storage.getDocumentById(req.params.id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
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

  apiRouter.get("/files/:filename", serveSecureFile);
  
  // Authentication endpoints
  const authRouter = express.Router(); 

  authRouter.post("/register", async (req, res) => {
    try {
      const { email, password, username, phone, firstName, lastName } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const optionalFields = { username, phone, firstName, lastName };
      const definedOptionalFields = Object.fromEntries(
        Object.entries(optionalFields).filter(([, value]) => value !== undefined)
      );

      const registeredUser = await registerUser(email, password, definedOptionalFields); // from server/auth.ts
      
      const userForToken = {
        id: registeredUser.id,
        role: registeredUser.role as UserRole, // UserRole from auth.ts
      };
      const accessToken = generateToken(userForToken);
      const refreshToken = generateToken(userForToken, 'refresh');
      
      res.status(201).json({
        user: { 
            id: registeredUser.id,
            email: registeredUser.email,
            username: registeredUser.username,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            phone: registeredUser.phone,
            role: registeredUser.role,
            createdAt: registeredUser.createdAt
        },
        accessToken,
        refreshToken,
      });
    } catch (error: unknown) { // Changed to unknown
      console.error("Error registering user:", error);
      const message = error instanceof Error ? error.message : "Failed to register user";
      if (message.includes("User with this email already exists") || 
          message.includes("User with this username already exists") || 
          message.includes("Validation failed")) {
        return res.status(400).json({ message });
      }
      res.status(500).json({ message });
    }
  });
  
  authRouter.post("/login", (req, res, next) => {
    passport.authenticate('local', { session: false }, async (err: any, user: any, info: any) => {
      if (err) {
        console.error("Error during local authentication:", err);
        return next(err);
      }
      if (!user) {
        // info might contain message like 'Incorrect email or password.'
        return res.status(401).json({ message: info?.message || "Invalid email or password." });
      }
      
      // User is authenticated by Passport, now generate tokens
      // The `loginUser` function in `auth.ts` can be used if it's designed for this,
      // or we can generate tokens directly here.
      // `loginUser` also does validation and password check, which passport already did.
      // So, let's use generateToken directly.
      try {
        const userPayloadForToken = { id: user.id, role: user.role as UserRole };
        const accessToken = generateToken(userPayloadForToken, 'access');
        const refreshToken = generateToken(userPayloadForToken, 'refresh');

        // Exclude passwordHash from the user object returned to client
      // const { passwordHash, ...userWithoutPasswordHash } = user; // passwordHash is not part of user from passport local strategy
      // The user object from passport local strategy should already be safe to return.
      return res.status(200).json({
        user, // user from passport local strategy
          accessToken,
          refreshToken,
        });
      } catch (tokenError) {
        console.error("Error generating tokens after login:", tokenError);
        return res.status(500).json({ message: "Login successful, but failed to generate tokens." });
      }
    })(req, res, next);
  });
  
  // OTP verification route commented out as verifyOTP is not available in auth.ts
  /*
  authRouter.post("/verify-otp", async (req, res) => {
    // ...
  });
  */
  
  authRouter.post("/google", async (req, res) => {
    try {
      const { credential, token_type } = req.body;
      if (!credential) {
        return res.status(400).json({ message: "Google credential is required" });
      }
      const googleUserInfo = await verifyGoogleToken(credential, token_type);
      const { user, accessToken, refreshToken } = await processGoogleLogin(googleUserInfo);
      const { passwordHash: _, ...userWithoutPasswordHash } = user; // Ensure passwordHash is destructured
      res.status(200).json({
        user: userWithoutPasswordHash,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error("Error with Google authentication:", error);
      const message = error instanceof Error ? error.message : "Google authentication failed";
      res.status(401).json({ message });
    }
  });
  
  authRouter.post("/refresh-token", async (req, res) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
      }
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
  
  authRouter.get("/user", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
    // If JWT authentication is successful, req.user is populated by Passport JWT strategy
    if (!req.user) {
      // This case should ideally be caught by passport.authenticate itself
      return res.status(401).json({ message: "Unauthorized - User not authenticated" });
    }
    // The req.user from JWT strategy is already the full user object (minus passwordHash potentially)
    // and includes 'sub' if we added it.
    // The User type from shared/schema does not have passwordHash if selected carefully.
    // Our JWT strategy returns User & { sub: ... }
    // We just need to ensure passwordHash is not part of the req.user if it somehow got there.
    // Assuming req.user is already shaped correctly by the JWT strategy (e.g., by selecting specific fields from DB)
    // If passwordHash could be present, it should be explicitly removed or the JWT strategy adjusted.
    // For now, let's assume req.user is safe. If type errors persist, this needs revisiting.
    const userPayload = req.user;
    // If passwordHash might exist on userPayload:
    // const { passwordHash: _jwtPasswordHash, ...safeUserPayload } = userPayload as any;
    // res.status(200).json(safeUserPayload);
    res.status(200).json(userPayload);
  });

  // Mount the authRouter under /api/auth
  app.use("/api/auth", authRouter);


  // Test endpoint for OpenRouter API
  apiRouter.get("/test-openrouter", async (_req, res) => { // Mark req as unused
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.json({ success: false, message: "OpenRouter API key is missing" });
      }
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com", 
          "X-Title": "Indian Tax Expert"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [{ role: "user", content: "Hello, what is 2+2?" }],
          temperature: 0.2
        })
      });
      const data = await response.json();
      console.log("Test API response:", JSON.stringify(data));
      res.json({ success: true, response: data });
    } catch (error) {
      console.error("Error testing OpenRouter API:", error);
      res.json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  });

  apiRouter.get("/tax-expert-chat/status", async (req, res) => {
    try {
      if (!process.env.OPENROUTER_API_KEY) {
        return res.json({ configured: false, message: "OpenRouter API key is missing" });
      }
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com"
        }
      });
      const data = await response.json();
      console.log("Available models:", JSON.stringify(data).substring(0, 500) + "...");
      if (data.data && data.data.length > 0) {
        const availableModels = data.data.map((model: any) => model.id);
        console.log("Available OpenRouter models:", availableModels);
        res.json({ configured: true, message: "OpenRouter API is configured", availableModels });
      } else {
        res.json({ configured: true, message: "OpenRouter API is configured, but no models were found", error: data.error || "Unknown error" });
      }
    } catch (error) {
      console.error("Error checking API status:", error);
      res.json({ configured: true, message: "OpenRouter API key is present but there was an error checking the service", error: error instanceof Error ? error.message : String(error) });
    }
  });

  apiRouter.post("/tax-expert-chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      if (!process.env.OPENROUTER_API_KEY) {
        return res.status(500).json({ error: "Missing OpenRouter API key", details: "The API key for OpenRouter is not configured."});
      }
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "https://mytaxindia.com",
          "X-Title": "Indian Tax Expert"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            { role: "system", content: `You are TaxGuru, an expert on Indian Income Tax laws and regulations. You provide accurate, helpful information about Indian tax regulations, forms, deductions, exemptions, and filing requirements. Current date: ${new Date().toLocaleDateString()}`},
            { role: "user", content: message }
          ],
          temperature: 0.2,
          max_tokens: 800
        })
      });
      const data = await response.json();
      if (data.error) {
        console.error("OpenRouter API error:", data.error);
        return res.status(500).json({ error: "Error getting response from tax expert", details: JSON.stringify(data.error) });
      }
      const responsePreview = JSON.stringify(data).substring(0, 200) + "...";
      console.log("OpenRouter API response preview:", responsePreview);
      let responseText = "";
      try {
        if (data && data.choices && data.choices.length > 0 && data.choices[0].message) {
          responseText = data.choices[0].message.content;
        } else if (data && data.error) {
          throw new Error(JSON.stringify(data.error));
        } else {
          responseText = "I'm sorry, but I'm having trouble generating a response right now. Please try again later.";
          console.error("Unexpected API response format:", JSON.stringify(data).substring(0, 500));
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

  adminRouter.get("/users", async (req, res) => {
    try {
      const { users: usersTable } = await import("@shared/schema"); 
      if (!db) {
        return res.status(503).json({ message: "Database service unavailable" });
      }
      const allUsers = await db.select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        phone: usersTable.phone,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
        googleId: usersTable.googleId,
        profileImageUrl: usersTable.profileImageUrl
      }).from(usersTable);
      res.json(allUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  adminRouter.post("/users", async (req, res) => {
    try {
      const { username, email, password, role } = req.body; 
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const passwordHashVal = await hashPassword(password); 
      
      let roleToSet: 'user' | 'admin' = 'user'; 
      if (role === sharedUserRoleEnum.enumValues[1]) { 
        roleToSet = sharedUserRoleEnum.enumValues[1];
      } else if (role === sharedUserRoleEnum.enumValues[0]) { 
         roleToSet = sharedUserRoleEnum.enumValues[0];
      }

      const user = await storage.createUser({ 
        username,
        email,
        passwordHash: passwordHashVal, 
        role: roleToSet 
      });
      const { passwordHash: _unusedPasswordHash_adminCreate, ...userToReturn } = user; 
      res.status(201).json(userToReturn);
    } catch (error: unknown) { 
      console.error("Error creating user:", error);
      const message = error instanceof Error ? error.message : "Failed to create user";
      res.status(400).json({ message });
    }
  });

  adminRouter.delete("/users/:id", async (req, res) => {
    try {
      const { users: usersTable } = await import("@shared/schema");
      if (!db) {
        return res.status(503).json({ message: "Database service unavailable" });
      }
      // const { eq: drizzleEq } = await import("drizzle-orm"); // eq is already imported at the top
      const userId = Number(req.params.id);
      await db.delete(usersTable).where(drizzleEq(usersTable.id, userId));
      res.status(204).send();
    } catch (error: unknown) { 
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  adminRouter.get("/tax-forms", async (req, res) => {
    try {
      const { taxForms: taxFormsTable } = await import("@shared/schema");
      if (!db) {
        return res.status(503).json({ message: "Database service unavailable" });
      }
      const allForms = await db.select().from(taxFormsTable);
      res.json(allForms);
    } catch (error) {
      console.error("Error fetching tax forms:", error);
      res.status(500).json({ message: "Failed to fetch tax forms" });
    }
  });

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

  adminRouter.get("/documents", async (req, res) => {
    try {
      const { documents: documentsTable } = await import("@shared/schema");
      if (!db) {
        return res.status(503).json({ message: "Database service unavailable" });
      }
      const allDocuments = await db.select().from(documentsTable);
      res.json(allDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  
  adminRouter.get("/blog-posts", async (req, res) => {
    try {
      const { limit = 50, offset = 0, category, searchTerm, published } = req.query;
      const options = {
        limit: Number(limit),
        offset: Number(offset),
        published: published !== undefined ? published === 'true' : undefined,
        category: category ? String(category) : undefined,
        searchTerm: searchTerm ? String(searchTerm) : undefined
      };
      const result = await storage.getAllBlogPosts(options);
      res.json(result);
    } catch (error) {
      console.error("Error fetching blog posts for admin:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });
  
  adminRouter.get("/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPostById(Number(req.params.id));
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });
  
  adminRouter.post("/blog-posts", async (req, res) => {
    try {
      const { title, slug, summary, content, authorId, featuredImage, category, tags, readTime, published } = req.body;
      if (!title || !slug || !content || !category) {
        return res.status(400).json({ message: "Missing required fields: title, slug, content, and category are required" });
      }
      const existingPost = await storage.getBlogPostBySlug(slug);
      if (existingPost) {
        return res.status(400).json({ message: "A post with this slug already exists" });
      }
      const blogPost = await storage.createBlogPost({
        title, slug, summary: summary || "", content,
        authorId: authorId || 1, 
        featuredImage: featuredImage || "",
        category,
        tags: tags || [],
        readTime: readTime || 5,
        published: published === true
      });
      res.status(201).json(blogPost);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });
  
  adminRouter.put("/blog-posts/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { title, slug, summary, content, authorId, featuredImage, category, tags, readTime, published } = req.body;
      const existingPost = await storage.getBlogPostById(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      if (slug && slug !== existingPost.slug) {
        const postWithSlug = await storage.getBlogPostBySlug(slug);
        if (postWithSlug && postWithSlug.id !== id) {
          return res.status(400).json({ message: "A post with this slug already exists" });
        }
      }
      const updateData: Partial<InsertBlogPost> = {
        title: title || existingPost.title,
        slug: slug || existingPost.slug,
        summary: summary !== undefined ? summary : existingPost.summary,
        content: content || existingPost.content,
        authorId: authorId || existingPost.authorId,
        featuredImage: featuredImage !== undefined ? featuredImage : existingPost.featuredImage,
        category: category || existingPost.category,
        tags: tags || existingPost.tags,
        readTime: readTime || existingPost.readTime
      };
      if (published !== undefined && published !== existingPost.published) {
        updateData.published = published;
      }
      const updatedPost = await storage.updateBlogPost(id, updateData);
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });
  
  adminRouter.delete("/blog-posts/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const existingPost = await storage.getBlogPostById(id);
      if (!existingPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Admin Image Upload Endpoint
  adminRouter.post(
    "/upload-image",
    passport.authenticate('jwt', { session: false }), // Ensure admin is authenticated via JWT
    // TODO: Add specific admin role authorization if needed, e.g., authorize('manage_content')
    // For now, relying on the fact that this is under /api/admin which might have its own broad auth.
    // Or, add a direct role check:
    (req: AuthenticatedRequest, res, next) => {
      if (req.user?.role !== UserRole.ADMIN) { // UserRole from auth.ts
        return res.status(403).json({ message: "Forbidden: Admin access required" });
      }
      next();
    },
    ...handleFileUpload("image", "image"), // Changed "blog-images" to "image"
    async (req: AuthenticatedRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }
        // The handleFileUpload middleware should have saved the file.
        // It adds req.file.filename (the new unique name).
        // We construct the URL based on how files are served.
        // Currently, all uploads go to 'uploads/'. If subfolders are needed, fileUpload.ts storage destination needs an update.
        const fileUrl = `/uploads/${req.file.filename}`; // Path will be relative to 'uploads/'
        res.status(201).json({ imageUrl: fileUrl });
      } catch (error) {
        console.error("Error uploading image:", error);
        const message = error instanceof Error ? error.message : "Failed to upload image";
        res.status(500).json({ message });
      }
    }
  );

  adminRouter.get("/stats", async (req, res) => {
    try {
      const { users: usersTable, taxForms: taxFormsTable, documents: documentsTable } = await import("@shared/schema");
      if (!db) {
        return res.status(503).json({ message: "Database service unavailable" });
      }
      const { count } = await import("drizzle-orm"); // eq and gte are already imported
      
      const [userCountResult] = await db.select({ value: count() }).from(usersTable);
      const userCount = userCountResult?.value || 0;
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);
      const [newUserCountResult] = await db.select({ value: count() }).from(usersTable).where(gte(usersTable.createdAt, firstDayOfMonth));
      const newUserCount = newUserCountResult?.value || 0;

      const [totalTaxFormsResult] = await db.select({ value: count() }).from(taxFormsTable);
      const totalTaxForms = totalTaxFormsResult?.value || 0;

      const draftCount = await db.select({ value: count() }).from(taxFormsTable).where(drizzleEq(taxFormsTable.status, "in_progress")).then(r => r[0]?.value || 0);
      const submittedCount = await db.select({ value: count() }).from(taxFormsTable).where(drizzleEq(taxFormsTable.status, "completed")).then(r => r[0]?.value || 0);
      const filedCount = await db.select({ value: count() }).from(taxFormsTable).where(drizzleEq(taxFormsTable.status, "filed")).then(r => r[0]?.value || 0);
      
      const [documentCountResult] = await db.select({ value: count() }).from(documentsTable);
      const documentCount = documentCountResult?.value || 0;

      const totalRevenue = 12500; // Placeholder
      const thisMonthRevenue = 3400; // Placeholder
      res.json({
        users: { total: userCount, new: newUserCount },
        taxForms: { total: totalTaxForms, draft: draftCount, submitted: submittedCount, processing: 0, completed: 0, filed: filedCount, rejected: 0 },
        documents: { total: documentCount },
        revenue: { total: totalRevenue, thisMonth: thisMonthRevenue }
      });
    } catch (error: unknown) { 
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
  });
  
  authRouter.post("/dev-admin-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (process.env.NODE_ENV === "production" || username !== "admin" || password !== "admin") {
        return res.status(401).json({ message: "Invalid or unauthorized request" });
      }
      const mockAdminUser = { id: 0, username: "admin", role: "admin", type: "admin", phone: "9876543210", createdAt: new Date(), updatedAt: new Date() };
      res.status(200).json({ user: mockAdminUser, accessToken: "dev-admin-token", refreshToken: "dev-admin-refresh-token", message: "Dev admin login successful" });
    } catch (error) {
      console.error("Dev admin login error:", error);
      res.status(500).json({ message: "Internal server error during dev login" });
    }
  });

  authRouter.post("/admin-login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      if (username !== "admin" || password !== "admin") { 
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      let adminUser = await storage.getUserByUsername("admin");
      if (!adminUser) {
        const hashedPassword = await hashPassword("admin");
        adminUser = await storage.createUser({
          username: "admin",
          email: "admin@example.com", // Ensure this email is unique or handle potential conflicts
          passwordHash: hashedPassword,
          role: sharedUserRoleEnum.enumValues[1] as 'admin' // Cast to specific role type
        });
      }
      else if (adminUser.passwordHash && !(await verifyPassword(password, adminUser.passwordHash))) {
         return res.status(401).json({ message: "Invalid admin credentials" });
      }

      const userForToken = { id: adminUser.id, role: adminUser.role as UserRole };
      const accessToken = generateToken(userForToken);
      const refreshToken = generateToken(userForToken, 'refresh');
      const { passwordHash: _unused_phAdmin_login, ...adminWithoutPassword } = adminUser;
      res.status(200).json({ user: adminWithoutPassword, accessToken, refreshToken, message: "Admin login successful" });
    } catch (error: unknown) { 
      console.error("Error in admin login:", error);
      res.status(500).json({ message: "Failed to login as admin" });
    }
  });
  
  authRouter.get("/verify-admin", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
    // If JWT auth is successful, req.user is populated.
    if (!req.user || req.user.role !== UserRole.ADMIN) { // UserRole from auth.ts
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }
    // No need to fetch user again from storage if req.user is already sufficient
    res.status(200).json({ valid: true, message: "Admin token valid" });
  });
  
  /*
  authRouter.post("/send-otp", async (req, res) => {
    // ... 
  });
  authRouter.post("/verify-otp", async (req, res) => {
    // ... 
  });
  */
  
  authRouter.get("/me", async (req, res) => { 
    try {
      const userIdQueryParam = req.query.userId; 
      if (!userIdQueryParam) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      const userId = Number(userIdQueryParam);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID format in query parameter" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { passwordHash: _unused_pwHash_me, ...userToReturn } = user;
      res.status(200).json(userToReturn);
    } catch (error: unknown) { 
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Database editor routes (admin only)
  const dbEditorRouter = express.Router();
  
  dbEditorRouter.get("/tables", async (req, res) => {
    try {
      if (!db) { return res.status(503).json({ message: "Database service unavailable" }); }
      const result = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching tables:", error);
      res.status(500).json({ message: "Failed to fetch database tables" });
    }
  });
  
  dbEditorRouter.get("/tables/:tableName/schema", async (req, res) => {
    try {
      const { tableName } = req.params;
      if (!db) { return res.status(503).json({ message: "Database service unavailable" }); }
      const result = await db.execute(sql`SELECT column_name, data_type, is_nullable, column_default FROM information_schema.columns WHERE table_schema = 'public' AND table_name = ${tableName} ORDER BY ordinal_position`);
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching table schema:", error);
      res.status(500).json({ message: "Failed to fetch table schema" });
    }
  });
  
  dbEditorRouter.get("/tables/:tableName/data", async (req, res) => {
    try {
      const { tableName } = req.params;
      if (!db) { return res.status(503).json({ message: "Database service unavailable" }); }
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const offset = (page - 1) * pageSize;
      const sTableName = tableName.replace(/[^a-zA-Z0-9_]/g, '');
      const rawDataQueryString = `SELECT * FROM "${sTableName}" LIMIT ${Number(pageSize)} OFFSET ${Number(offset)}`;
      const dataResult = await db!.execute(sql.raw(rawDataQueryString));
      const rawCountQueryString = `SELECT COUNT(*) FROM "${sTableName}"`;
      const countResult = await db!.execute(sql.raw(rawCountQueryString));
      const totalCount = parseInt((countResult.rows[0] as { count?: string | number })?.count?.toString() || "0"); // Ensure count is string before parseInt
      const totalPages = Math.ceil(totalCount / pageSize);
      res.json({ data: dataResult.rows, pagination: { page, pageSize, totalCount, totalPages } });
    } catch (error: unknown) {
      console.error("Error fetching table data:", error);
      res.status(500).json({ message: "Failed to fetch table data" });
    }
  });
  
  dbEditorRouter.post("/query", async (req, res) => {
    try {
      const { query } = req.body;
      if (typeof query !== 'string' || !query.trim()) {
        return res.status(400).json({ message: "SQL query must be a non-empty string" });
      }
      const normalizedQuery = query.trim().toLowerCase();
      if (!normalizedQuery.startsWith('select')) {
        return res.status(403).json({ message: "Only SELECT queries are allowed through this endpoint for safety" });
      }
      if (!db) {
        console.error("Database not available for custom query execution");
        throw new Error("Database service is currently unavailable.");
      }
      const result = await db.execute(sql.raw(query)); // sql.raw is okay here as it's an admin-only, restricted endpoint
      res.json({ rows: result.rows, rowCount: result.rowCount });
    } catch (error: unknown) { // Changed to unknown
      console.error("Error executing SQL query:", error);
      const message = error instanceof Error ? error.message : String(error);
      res.status(500).json({ message: "Failed to execute SQL query", error: message });
    }
  });

  // Mount the API routers
  app.use("/api", apiRouter); 
  // app.use("/api/auth", authRouter); // Auth routes are now part of apiRouter, mounted under /api/auth
  app.use("/api/admin", adminRouter); 
  app.use("/api/admin/db", dbEditorRouter); 
  app.use("/api/users", userProfileRouter); 

  const httpServer = createServer(app);
  console.log("All routes registered successfully");
  return httpServer;
}
