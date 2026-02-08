import { db } from "./db";
import { courses, purchases, type InsertCourse, type InsertPurchase, type Course, type Purchase } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createPurchase(purchase: InsertPurchase): Promise<Purchase>;
  getPurchases(userId: string): Promise<Purchase[]>;
  seedCourses(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const [purchase] = await db.insert(purchases).values(insertPurchase).returning();
    return purchase;
  }

  async getPurchases(userId: string): Promise<Purchase[]> {
    return await db.select().from(purchases).where(eq(purchases.userId, userId));
  }

  async seedCourses(): Promise<void> {
    const existing = await this.getCourses();
    if (existing.length === 0) {
      await db.insert(courses).values([
        {
          title: "Mathematics Masterclass",
          description: "Master advanced calculus and algebra with this comprehensive course.",
          price: 2500,
          paddleProductId: "pri_01k5rc29qvp5geryhewd7we5d9",
        },
        {
          title: "Science Explorer",
          description: "Explore the wonders of physics, chemistry, and biology.",
          price: 2500,
          paddleProductId: "pri_01kgz68g5pkmgra6vszk0kk434",
        },
        {
          title: "Arabic Language",
          description: "Learn to read, write, and speak Arabic fluently.",
          price: 2500,
          paddleProductId: "pri_01kgz6ab2dwm7eqs528hh63c9f",
        },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
