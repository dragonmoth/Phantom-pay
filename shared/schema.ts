import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  date,
  boolean
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: varchar("company"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee master data
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").notNull().unique(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  email: varchar("email"),
  department: varchar("department"),
  position: varchar("position"),
  hireDate: date("hire_date"),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  status: varchar("status").default("active"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Attendance records
export const attendanceRecords = pgTable("attendance_records", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").references(() => employees.employeeId).notNull(),
  date: date("date").notNull(),
  timeIn: timestamp("time_in"),
  timeOut: timestamp("time_out"),
  status: varchar("status").notNull(), // present, absent, late, etc.
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Salary payments
export const salaryPayments = pgTable("salary_payments", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").references(() => employees.employeeId).notNull(),
  paymentDate: date("payment_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  payPeriodStart: date("pay_period_start").notNull(),
  payPeriodEnd: date("pay_period_end").notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// WiFi session logs
export const wifiSessions = pgTable("wifi_sessions", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").references(() => employees.employeeId).notNull(),
  sessionStart: timestamp("session_start").notNull(),
  sessionEnd: timestamp("session_end"),
  deviceMac: varchar("device_mac"),
  ipAddress: varchar("ip_address"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Detected anomalies
export const anomalies = pgTable("anomalies", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id").references(() => employees.employeeId).notNull(),
  type: varchar("type").notNull(), // wifi_inconsistency, payroll_irregularity, attendance_gap
  riskScore: integer("risk_score").notNull(), // 0-100
  description: text("description").notNull(),
  details: jsonb("details"),
  status: varchar("status").default("pending"), // pending, reviewed, resolved, false_positive
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// File uploads
export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name").notNull(),
  fileType: varchar("file_type").notNull(), // employee_master, attendance, salary, wifi
  fileSize: integer("file_size").notNull(),
  recordsCount: integer("records_count"),
  status: varchar("status").default("processing"), // processing, completed, failed
  errorMessage: text("error_message"),
  userId: varchar("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  employees: many(employees),
  attendanceRecords: many(attendanceRecords),
  salaryPayments: many(salaryPayments),
  wifiSessions: many(wifiSessions),
  anomalies: many(anomalies),
  fileUploads: many(fileUploads),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, { fields: [employees.userId], references: [users.id] }),
  attendanceRecords: many(attendanceRecords),
  salaryPayments: many(salaryPayments),
  wifiSessions: many(wifiSessions),
  anomalies: many(anomalies),
}));

export const attendanceRecordsRelations = relations(attendanceRecords, ({ one }) => ({
  employee: one(employees, { fields: [attendanceRecords.employeeId], references: [employees.employeeId] }),
  user: one(users, { fields: [attendanceRecords.userId], references: [users.id] }),
}));

export const salaryPaymentsRelations = relations(salaryPayments, ({ one }) => ({
  employee: one(employees, { fields: [salaryPayments.employeeId], references: [employees.employeeId] }),
  user: one(users, { fields: [salaryPayments.userId], references: [users.id] }),
}));

export const wifiSessionsRelations = relations(wifiSessions, ({ one }) => ({
  employee: one(employees, { fields: [wifiSessions.employeeId], references: [employees.employeeId] }),
  user: one(users, { fields: [wifiSessions.userId], references: [users.id] }),
}));

export const anomaliesRelations = relations(anomalies, ({ one }) => ({
  employee: one(employees, { fields: [anomalies.employeeId], references: [employees.employeeId] }),
  user: one(users, { fields: [anomalies.userId], references: [users.id] }),
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
  user: one(users, { fields: [fileUploads.userId], references: [users.id] }),
}));

// Insert schemas
export const insertEmployeeSchema = createInsertSchema(employees).omit({ id: true, createdAt: true });
export const insertAttendanceRecordSchema = createInsertSchema(attendanceRecords).omit({ id: true, createdAt: true });
export const insertSalaryPaymentSchema = createInsertSchema(salaryPayments).omit({ id: true, createdAt: true });
export const insertWifiSessionSchema = createInsertSchema(wifiSessions).omit({ id: true, createdAt: true });
export const insertAnomalySchema = createInsertSchema(anomalies).omit({ id: true, createdAt: true });
export const insertFileUploadSchema = createInsertSchema(fileUploads).omit({ id: true, createdAt: true });

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type AttendanceRecord = typeof attendanceRecords.$inferSelect;
export type InsertAttendanceRecord = z.infer<typeof insertAttendanceRecordSchema>;
export type SalaryPayment = typeof salaryPayments.$inferSelect;
export type InsertSalaryPayment = z.infer<typeof insertSalaryPaymentSchema>;
export type WifiSession = typeof wifiSessions.$inferSelect;
export type InsertWifiSession = z.infer<typeof insertWifiSessionSchema>;
export type Anomaly = typeof anomalies.$inferSelect;
export type InsertAnomaly = z.infer<typeof insertAnomalySchema>;
export type FileUpload = typeof fileUploads.$inferSelect;
export type InsertFileUpload = z.infer<typeof insertFileUploadSchema>;
