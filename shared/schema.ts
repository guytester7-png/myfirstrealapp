import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export * from "./models/auth";
import { users } from "./models/auth";

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(), // in cents, so 2500 for $25.00
  paddleProductId: text("paddle_product_id").notNull(),
  imageUrl: text("image_url"),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  amountPaid: integer("amount_paid").notNull(), // in cents
  currency: text("currency").default("USD"),
  status: text("status").notNull(), // 'completed', 'pending'
  paddleTransactionId: text("paddle_transaction_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [purchases.courseId],
    references: [courses.id],
  }),
}));

export const insertCourseSchema = createInsertSchema(courses);
export const insertPurchaseSchema = createInsertSchema(purchases);

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
