import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { customerOrders, InsertCustomerOrder, InsertOrderItem, InsertSupportTicket, InsertUser, orderItems, supportTickets, User, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCustomerOrder(order: InsertCustomerOrder, items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(customerOrders).values(order);
  const created = await db.select().from(customerOrders).where(eq(customerOrders.orderNumber, order.orderNumber)).limit(1);
  if (!created[0]) throw new Error("Order could not be created");
  await db.insert(orderItems).values(items.map(item => ({ ...item, orderId: created[0].id })));
  const createdItems = await db.select().from(orderItems).where(eq(orderItems.orderId, created[0].id));
  return { order: created[0], items: createdItems };
}

export async function getOrdersForUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const orders = await db.select().from(customerOrders).where(eq(customerOrders.userId, userId)).orderBy(desc(customerOrders.createdAt));
  const result = [];
  for (const order of orders) {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
    result.push({ order, items });
  }
  return result;
}

export async function createSupportTicket(ticket: InsertSupportTicket) {
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  await db.insert(supportTickets).values(ticket);
  const created = await db.select().from(supportTickets).where(eq(supportTickets.ticketNumber, ticket.ticketNumber)).limit(1);
  if (!created[0]) throw new Error("Support ticket could not be created");
  return created[0];
}
