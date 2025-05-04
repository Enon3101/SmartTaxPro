import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { insertTaxFormSchema, insertDocumentSchema } from "@shared/schema";

// Configure multer for file uploads
const uploadDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, JPEG, and PNG are allowed.") as any);
    }
  },
});

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

  // Update deductions data in a tax form
  apiRouter.post("/tax-forms/:id/deductions", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormDeductionsData(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating deductions data:", error);
      res.status(500).json({ message: "Failed to update deductions data" });
    }
  });

  // Update credits data in a tax form
  apiRouter.post("/tax-forms/:id/credits", async (req, res) => {
    try {
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const updatedTaxForm = await storage.updateTaxFormCreditsData(req.params.id, req.body);
      res.json(updatedTaxForm);
    } catch (error) {
      console.error("Error updating credits data:", error);
      res.status(500).json({ message: "Failed to update credits data" });
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

  // Upload a document
  apiRouter.post("/tax-forms/:id/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const taxForm = await storage.getTaxFormById(req.params.id);
      if (!taxForm) {
        return res.status(404).json({ message: "Tax form not found" });
      }
      
      const { filename, originalname, mimetype, size } = req.file;
      const documentType = req.body.documentType || "Other";
      
      // Create a path that can be used to serve the file
      const url = `/uploads/${filename}`;
      
      const documentData = {
        id: nanoid(),
        taxFormId: req.params.id,
        name: originalname,
        type: mimetype,
        size: size,
        documentType: documentType,
        url: url,
      };
      
      // Validate with Zod schema
      const validatedData = insertDocumentSchema.parse(documentData);
      
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

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

  // Mount the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
