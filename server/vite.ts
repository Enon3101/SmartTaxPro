import fs from "fs";
import { type Server } from "http";
import path from "path";

import express, { type Express } from "express";
import { nanoid } from "nanoid";
import { createServer as createViteServer, createLogger, type ServerOptions } from "vite";


import viteConfig from "../vite.config";
import logger from './logger'; // Import shared logger

export async function setupVite(app: Express, server: Server) {
  const serverOptions: ServerOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: { // Use the shared logger, map methods if necessary or use Pino's structure
      info: (msg, options) => logger.info({ ...options, vite: true }, msg),
      warn: (msg, options) => logger.warn({ ...options, vite: true }, msg),
      error: (msg, options) => {
        logger.error({ ...options, vite: true }, msg);
        // Consider if process.exit(1) is still desired here for Vite errors
        // process.exit(1); // Removed to prevent server crash on all Vite errors during development
      },
      clearScreen: () => {}, // Vite expects this, can be a no-op
      hasWarned: false, // Vite expects this
      warnOnce: (msg, options) => logger.warn({ ...options, vite: true, once: true }, msg), // Add warnOnce
      hasErrorLogged: (_err) => false, // Add hasErrorLogged, assuming simple state
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // always reload the index.html file from disk incase it changes
      const template = await fs.promises.readFile(clientTemplate, "utf-8");
      // Removed manual cache busting with nanoid for main.tsx
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "..", "dist", "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
