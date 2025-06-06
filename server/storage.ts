import {
  users,
  employees,
  attendanceRecords,
  salaryPayments,
  wifiSessions,
  anomalies,
  fileUploads,
  type User,
  type UpsertUser,
  type Employee,
  type InsertEmployee,
  type AttendanceRecord,
  type InsertAttendanceRecord,
  type SalaryPayment,
  type InsertSalaryPayment,
  type WifiSession,
  type InsertWifiSession,
  type Anomaly,
  type InsertAnomaly,
  type FileUpload,
  type InsertFileUpload,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Employee operations
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  getEmployeesByUserId(userId: string): Promise<Employee[]>;
  getEmployeeByEmployeeId(employeeId: string, userId: string): Promise<Employee | undefined>;
  
  // Attendance operations
  createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord>;
  getAttendanceRecordsByUserId(userId: string): Promise<AttendanceRecord[]>;
  
  // Salary operations
  createSalaryPayment(payment: InsertSalaryPayment): Promise<SalaryPayment>;
  getSalaryPaymentsByUserId(userId: string): Promise<SalaryPayment[]>;
  
  // WiFi operations
  createWifiSession(session: InsertWifiSession): Promise<WifiSession>;
  getWifiSessionsByUserId(userId: string): Promise<WifiSession[]>;
  
  // Anomaly operations
  createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly>;
  getAnomaliesByUserId(userId: string): Promise<Anomaly[]>;
  updateAnomalyStatus(id: number, status: string, userId: string): Promise<void>;
  
  // File upload operations
  createFileUpload(upload: InsertFileUpload): Promise<FileUpload>;
  getFileUploadsByUserId(userId: string): Promise<FileUpload[]>;
  updateFileUploadStatus(id: number, status: string, recordsCount?: number, errorMessage?: string): Promise<void>;
  
  // Analytics operations
  getDashboardStats(userId: string): Promise<{
    totalEmployees: number;
    flaggedAnomalies: number;
    potentialSavings: number;
    dataAccuracy: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Employee operations
  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async getEmployeesByUserId(userId: string): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.userId, userId));
  }

  async getEmployeeByEmployeeId(employeeId: string, userId: string): Promise<Employee | undefined> {
    const [employee] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.employeeId, employeeId), eq(employees.userId, userId)));
    return employee;
  }

  // Attendance operations
  async createAttendanceRecord(record: InsertAttendanceRecord): Promise<AttendanceRecord> {
    const [newRecord] = await db.insert(attendanceRecords).values(record).returning();
    return newRecord;
  }

  async getAttendanceRecordsByUserId(userId: string): Promise<AttendanceRecord[]> {
    return await db.select().from(attendanceRecords).where(eq(attendanceRecords.userId, userId));
  }

  // Salary operations
  async createSalaryPayment(payment: InsertSalaryPayment): Promise<SalaryPayment> {
    const [newPayment] = await db.insert(salaryPayments).values(payment).returning();
    return newPayment;
  }

  async getSalaryPaymentsByUserId(userId: string): Promise<SalaryPayment[]> {
    return await db.select().from(salaryPayments).where(eq(salaryPayments.userId, userId));
  }

  // WiFi operations
  async createWifiSession(session: InsertWifiSession): Promise<WifiSession> {
    const [newSession] = await db.insert(wifiSessions).values(session).returning();
    return newSession;
  }

  async getWifiSessionsByUserId(userId: string): Promise<WifiSession[]> {
    return await db.select().from(wifiSessions).where(eq(wifiSessions.userId, userId));
  }

  // Anomaly operations
  async createAnomaly(anomaly: InsertAnomaly): Promise<Anomaly> {
    const [newAnomaly] = await db.insert(anomalies).values(anomaly).returning();
    return newAnomaly;
  }

  async getAnomaliesByUserId(userId: string): Promise<Anomaly[]> {
    return await db
      .select()
      .from(anomalies)
      .where(eq(anomalies.userId, userId))
      .orderBy(desc(anomalies.createdAt));
  }

  async updateAnomalyStatus(id: number, status: string, userId: string): Promise<void> {
    await db
      .update(anomalies)
      .set({ status })
      .where(and(eq(anomalies.id, id), eq(anomalies.userId, userId)));
  }

  // File upload operations
  async createFileUpload(upload: InsertFileUpload): Promise<FileUpload> {
    const [newUpload] = await db.insert(fileUploads).values(upload).returning();
    return newUpload;
  }

  async getFileUploadsByUserId(userId: string): Promise<FileUpload[]> {
    return await db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.userId, userId))
      .orderBy(desc(fileUploads.createdAt));
  }

  async updateFileUploadStatus(
    id: number,
    status: string,
    recordsCount?: number,
    errorMessage?: string
  ): Promise<void> {
    await db
      .update(fileUploads)
      .set({ status, recordsCount, errorMessage })
      .where(eq(fileUploads.id, id));
  }

  // Analytics operations
  async getDashboardStats(userId: string): Promise<{
    totalEmployees: number;
    flaggedAnomalies: number;
    potentialSavings: number;
    dataAccuracy: number;
  }> {
    const [employeeCount] = await db
      .select({ count: count() })
      .from(employees)
      .where(eq(employees.userId, userId));

    const [anomalyCount] = await db
      .select({ count: count() })
      .from(anomalies)
      .where(and(eq(anomalies.userId, userId), eq(anomalies.status, "pending")));

    // Calculate potential savings based on flagged employees' salaries
    const flaggedEmployees = await db
      .select({ salary: employees.salary })
      .from(anomalies)
      .innerJoin(employees, eq(anomalies.employeeId, employees.employeeId))
      .where(and(eq(anomalies.userId, userId), eq(anomalies.status, "pending")));

    const potentialSavings = flaggedEmployees.reduce((sum, emp) => {
      return sum + (parseFloat(emp.salary || "0") * 12); // Annual savings
    }, 0);

    return {
      totalEmployees: employeeCount.count,
      flaggedAnomalies: anomalyCount.count,
      potentialSavings: Math.round(potentialSavings),
      dataAccuracy: 98.7, // This would be calculated based on data quality metrics
    };
  }
}

export const storage = new DatabaseStorage();
