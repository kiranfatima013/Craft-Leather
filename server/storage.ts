import { db } from "./db";
import {
  users, products, cartItems, orders, orderItems,
  type User, type InsertUser, type Product, type InsertProduct,
  type CartItem, type InsertCartItem, type Order, type InsertOrder
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(category?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<void>;

  // Cart
  getCartItems(userId: number): Promise<(CartItem & { product: Product })[]>;
  getCartItem(userId: number, productId: number): Promise<CartItem | undefined>;
  addCartItem(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<void>;
  clearCart(userId: number): Promise<void>;

  // Orders
  createOrder(userId: number, items: (CartItem & { product: Product })[]): Promise<Order>;
  getOrders(userId: number): Promise<Order[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Products
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return await db.select().from(products).where(eq(products.category, category));
    }
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const [product] = await db.update(products).set(updates).where(eq(products.id, id)).returning();
    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Cart
  async getCartItems(userId: number): Promise<(CartItem & { product: Product })[]> {
    const items = await db.select({
      cartItem: cartItems,
      product: products
    })
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .innerJoin(products, eq(cartItems.productId, products.id));

    return items.map(item => ({ ...item.cartItem, product: item.product }));
  }

  async getCartItem(userId: number, productId: number): Promise<CartItem | undefined> {
    const [item] = await db.select().from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return item;
  }

  async addCartItem(item: InsertCartItem): Promise<CartItem> {
    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db.update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeCartItem(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Orders
  async createOrder(userId: number, items: (CartItem & { product: Product })[]): Promise<Order> {
    const total = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);
    
    // Create order
    const [order] = await db.insert(orders).values({
      userId,
      total: total.toString(),
      status: "pending"
    }).returning();

    // Create order items
    await db.insert(orderItems).values(items.map(item => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price
    })));

    return order;
  }

  async getOrders(userId: number): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.userId, userId));
  }
}

export const storage = new DatabaseStorage();
