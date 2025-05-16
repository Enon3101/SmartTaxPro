import express from "express";
import { storage } from "./storage";

const blogRouter = express.Router();

// Get all blog posts with pagination and filtering
blogRouter.get("/", async (req, res) => {
  try {
    const { limit = 10, offset = 0, category, published = true } = req.query;
    
    const options = {
      limit: Number(limit),
      offset: Number(offset),
      category: category ? String(category) : undefined,
      published: published === 'true' || published === true
    };
    
    const result = await storage.getAllBlogPosts(options);
    res.json(result);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

// Get blog post by slug
blogRouter.get("/:slug", async (req, res) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    
    if (!post) {
      return res.status(404).json({ message: "Blog post not found" });
    }
    
    res.json(post);
  } catch (error) {
    console.error("Error fetching blog post:", error);
    res.status(500).json({ message: "Failed to fetch blog post" });
  }
});

export default blogRouter;