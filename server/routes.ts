import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, hashPassword } from "./auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // === AUTH ===
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const { username, password } = api.auth.register.input.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({ username, password: hashedPassword, role: "user" });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      next(err);
    }
  });

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

  // === CART ===
  app.get(api.cart.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    const items = await storage.getCartItems((req.user as any).id);
    res.json(items);
  });

  app.post(api.cart.addItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    try {
      const { productId, quantity } = api.cart.addItem.input.parse(req.body);
      const userId = (req.user as any).id;
      
      const existingItem = await storage.getCartItem(userId, productId);
      let item;
      if (existingItem) {
        item = await storage.updateCartItem(existingItem.id, existingItem.quantity + quantity);
      } else {
        item = await storage.addCartItem({ userId, productId, quantity });
      }
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.patch(api.cart.updateItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    try {
      const { quantity } = api.cart.updateItem.input.parse(req.body);
      const item = await storage.updateCartItem(Number(req.params.id), quantity);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (err) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.delete(api.cart.removeItem.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    await storage.removeCartItem(Number(req.params.id));
    res.sendStatus(200);
  });

  // === ORDERS ===
  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    
    const userId = (req.user as any).id;
    const cartItems = await storage.getCartItems(userId);
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = await storage.createOrder(userId, cartItems);
    await storage.clearCart(userId);
    
    res.status(201).json(order);
  });

  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Login required" });
    const orders = await storage.getOrders((req.user as any).id);
    res.json(orders);
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
        name: "Classic Leather Jacket",
        description: "Premium full-grain leather jacket with vintage finish.",
        price: "299.99",
        category: "jackets",
        imageUrl: "https://placehold.co/600x400/5D4037/FFFFFF?text=Classic+Leather+Jacket"
      },
      {
        name: "Slim Bifold Wallet",
        description: "Minimalist leather wallet with RFID protection.",
        price: "49.99",
        category: "wallets",
        imageUrl: "https://placehold.co/600x400/8D6E63/FFFFFF?text=Slim+Wallet"
      },
      {
        name: "Leather Messenger Bag",
        description: "Durable laptop bag for professionals.",
        price: "159.99",
        category: "accessories",
        imageUrl: "https://placehold.co/600x400/4E342E/FFFFFF?text=Messenger+Bag"
      },
       {
        name: "Vintage Belt",
        description: "Handcrafted leather belt with brass buckle.",
        price: "39.99",
        category: "accessories",
        imageUrl: "https://placehold.co/600x400/A1887F/FFFFFF?text=Vintage+Belt"
      }
    ];

    for (const p of seedProducts) {
      await storage.createProduct(p);
    }
    
    // Create admin user
    const hashedAdminPassword = await hashPassword("admin123");
    await storage.createUser({
      username: "admin",
      password: hashedAdminPassword,
      role: "admin"
    });
    
    console.log("Seeding complete.");
  }
}
