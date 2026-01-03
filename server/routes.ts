import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import passport from "passport";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // === AUTH ===
  // No public registration for this brochure site
  
  app.post(api.auth.login.path, (req, res, next) => {
    const passportAuth = (passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(200).json(user);
      });
    }));
    passportAuth(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    res.json(req.user);
  });

  // === PRODUCTS ===
  app.get(api.products.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const products = await storage.getProducts(category);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.products.create.input.parse(req.body);
      const product = await storage.createProduct(input);
      res.status(201).json(product);
    } catch (err) {
       if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.put(api.products.update.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      const input = api.products.update.input.parse(req.body);
      const product = await storage.updateProduct(Number(req.params.id), input);
      if (!product) return res.status(404).json({ message: "Product not found" });
      res.json(product);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.delete(api.products.delete.path, async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    try {
      await storage.deleteProduct(Number(req.params.id));
      res.sendStatus(204);
    } catch (err) {
      res.status(404).json({ message: "Product not found" });
    }
  });

  app.post(api.contact.submit.path, async (req, res) => {
    try {
      api.contact.submit.input.parse(req.body);
      // In a real app, send email
      res.json({ message: "Message sent successfully" });
    } catch (err) {
      res.status(400).json({ message: "Invalid form data" });
    }
  });

  // Seeding
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const products = await storage.getProducts();
  if (products.length === 0) {
    console.log("Seeding database...");
    
    const seedProducts = [
      {
        name: "Classic Biker Leather Jacket",
        description: "Timeless biker-style jacket made from premium full-grain cowhide leather. Features a vintage distressed finish, heavy-duty asymmetrical zippers, and a quilted lining for superior comfort and durability.",
        price: "299.99",
        category: "jackets",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Cafe Racer Leather Jacket",
        description: "Sleek and minimalist cafe racer jacket crafted from supple lambskin leather. Features a snap-tab collar, streamlined silhouette, and reinforced shoulder panels for a clean, sophisticated look.",
        price: "349.99",
        category: "jackets",
        imageUrl: "https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Heritage Bomber Jacket",
        description: "Classic flight-inspired bomber jacket made from heavy-duty leather. Features rib-knit cuffs and hem, a plush shearling collar, and multiple functional pockets for a rugged yet refined style.",
        price: "399.99",
        category: "jackets",
        imageUrl: "https://images.unsplash.com/photo-1521223890158-f9f7c3d5bab3?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Slim Bifold Leather Wallet",
        description: "Handcrafted minimalist bifold wallet made from premium Italian vegetable-tanned leather. Features six card slots, a full-length bill compartment, and RFID protection to keep your data secure.",
        price: "49.99",
        category: "wallets",
        imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Rustic Trifold Wallet",
        description: "Rugged trifold wallet crafted from durable crazy horse leather. Develops a unique patina over time. Features a spacious interior with multiple card slots and a secure coin pocket.",
        price: "59.99",
        category: "wallets",
        imageUrl: "https://images.unsplash.com/photo-1559564484-e484c2043902?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Leather Messenger Bag",
        description: "Handmade full-grain leather messenger bag designed for the modern professional. Spacious enough for a 15-inch laptop, featuring antique brass hardware and a padded adjustable shoulder strap.",
        price: "159.99",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800"
      },
      {
        name: "Vintage Leather Belt",
        description: "Premium handcrafted leather belt with a solid brass buckle. Made from thick, durable leather that will last for years and gain character with every wear.",
        price: "39.99",
        category: "accessories",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800"
      }
    ];

    for (const p of seedProducts) {
      await storage.createProduct(p);
    }
    
    // Create admin user if not exists
    const adminUser = await storage.getUserByUsername("admin");
    if (!adminUser) {
      const hashedAdminPassword = await hashPassword("admin123");
      await storage.createUser({
        username: "admin",
        password: hashedAdminPassword,
        role: "admin"
      });
    }
    
    console.log("Seeding complete.");
  }
}
