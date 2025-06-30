import { Router } from 'express';
import passport from "passport";

import { UserRole, AuthenticatedRequest } from "./auth"; // Import AuthenticatedRequest
import { storage } from "./storage";

// Create a router for user profile routes
const userProfileRouter = Router();

// Get specific user by ID (admin or self only)
userProfileRouter.get("/:id", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const requestedUserId = Number(req.params.id);
    const requestingUserId = Number(req.user.sub);
    
    // Check if user has permission to view this profile
    // Must be admin or the same user
    const requestingUser = await storage.getUser(requestingUserId);
    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }
    
    const isAdmin = requestingUser.role === UserRole.ADMIN;
    const isSelf = requestedUserId === requestingUserId;
    
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "You do not have permission to view this user" });
    }
    
    // Get the requested user
    const user = await storage.getUser(requestedUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // SECURITY: Don't return the password hash (Req E)
    const { passwordHash: _, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Get tax forms for a specific user (admin or self only)
userProfileRouter.get("/:id/tax-forms", passport.authenticate('jwt', { session: false }), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const requestedUserId = Number(req.params.id);
    const requestingUserId = Number(req.user.sub);
    
    // Check if user has permission to view these forms
    // Must be admin or the same user
    const requestingUser = await storage.getUser(requestingUserId);
    if (!requestingUser) {
      return res.status(404).json({ message: "Requesting user not found" });
    }
    
    const isAdmin = requestingUser.role === UserRole.ADMIN;
    const isSelf = requestedUserId === requestingUserId;
    
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ message: "You do not have permission to view these tax forms" });
    }
    
    // Get the requested user's tax forms
    const taxForms = await storage.getTaxFormsByUserId(requestedUserId);
    
    res.status(200).json(taxForms);
  } catch (error) {
    console.error("Error fetching user tax forms:", error);
    res.status(500).json({ message: "Failed to fetch tax forms" });
  }
});

export default userProfileRouter;
