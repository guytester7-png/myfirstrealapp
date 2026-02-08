import { z } from "zod";
import { insertPurchaseSchema, courses, purchases } from "./schema";

export const api = {
  courses: {
    list: {
      method: "GET" as const,
      path: "/api/courses" as const,
      responses: {
        200: z.array(z.custom<typeof courses.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/courses/:id" as const,
      responses: {
        200: z.custom<typeof courses.$inferSelect>(),
        404: z.object({ message: z.string() }),
      },
    },
  },
  purchases: {
    create: {
      method: "POST" as const,
      path: "/api/purchases" as const,
      input: insertPurchaseSchema,
      responses: {
        201: z.custom<typeof purchases.$inferSelect>(),
        400: z.object({ message: z.string() }),
      },
    },
    list: {
      method: "GET" as const,
      path: "/api/purchases" as const,
      responses: {
        200: z.array(z.custom<typeof purchases.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
