import { integer, pgTable, varchar, text, json, serial } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer(),
});

export const sessionChatTable = pgTable("sessionChatTable", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 256 }).notNull(),
  notes: text("notes").notNull(),
  conversation: json("conversation"),
  report: json("report"),
  createdBy: varchar("createdBy", { length: 256 }).notNull(),
  createdOn: varchar("createdOn", { length: 256 }).notNull(),
  selectedDoctor: json("selectedDoctor").notNull(),
});
