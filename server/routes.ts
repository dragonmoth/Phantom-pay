import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import multer from "multer";
import csv from "csv-parser";
import { Readable } from "stream";
import {
  insertEmployeeSchema,
  insertAttendanceRecordSchema,
  insertSalaryPaymentSchema,
  insertWifiSessionSchema,
} from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getDashboardStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Employee routes
  app.get("/api/employees", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const employees = await storage.getEmployeesByUserId(userId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Anomaly routes
  app.get("/api/anomalies", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const anomalies = await storage.getAnomaliesByUserId(userId);
      
      // Join with employee data
      const anomaliesWithEmployees = await Promise.all(
        anomalies.map(async (anomaly) => {
          const employee = await storage.getEmployeeByEmployeeId(anomaly.employeeId, userId);
          return {
            ...anomaly,
            employee,
          };
        })
      );
      
      res.json(anomaliesWithEmployees);
    } catch (error) {
      console.error("Error fetching anomalies:", error);
      res.status(500).json({ message: "Failed to fetch anomalies" });
    }
  });

  app.patch("/api/anomalies/:id/status", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      const { status } = req.body;

      if (!["pending", "reviewed", "resolved", "false_positive"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      await storage.updateAnomalyStatus(parseInt(id), status, userId);
      res.json({ message: "Anomaly status updated successfully" });
    } catch (error) {
      console.error("Error updating anomaly status:", error);
      res.status(500).json({ message: "Failed to update anomaly status" });
    }
  });

  // File upload routes
  app.get("/api/file-uploads", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const uploads = await storage.getFileUploadsByUserId(userId);
      res.json(uploads);
    } catch (error) {
      console.error("Error fetching file uploads:", error);
      res.status(500).json({ message: "Failed to fetch file uploads" });
    }
  });

  app.post("/api/upload/:type", isAuthenticated, upload.single("file"), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { type } = req.params;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!["employee-master", "attendance", "salary", "wifi"].includes(type)) {
        return res.status(400).json({ message: "Invalid file type" });
      }

      // Create file upload record
      const fileUpload = await storage.createFileUpload({
        fileName: file.originalname,
        fileType: type,
        fileSize: file.size,
        userId,
      });

      // Process the CSV file
      const results: any[] = [];
      const stream = Readable.from(file.buffer);

      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          try {
            await processUploadedData(type, results, userId, fileUpload.id);
            await storage.updateFileUploadStatus(fileUpload.id, "completed", results.length);
            
            // Run anomaly detection after processing
            await runAnomalyDetection(userId);
          } catch (error) {
            console.error("Error processing uploaded data:", error);
            await storage.updateFileUploadStatus(
              fileUpload.id,
              "failed",
              undefined,
              error instanceof Error ? error.message : "Processing failed"
            );
          }
        })
        .on("error", async (error) => {
          console.error("Error parsing CSV:", error);
          await storage.updateFileUploadStatus(
            fileUpload.id,
            "failed",
            undefined,
            error.message
          );
        });

      res.json({
        message: "File uploaded successfully",
        fileId: fileUpload.id,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processUploadedData(type: string, data: any[], userId: string, fileId: number) {
  switch (type) {
    case "employee-master":
      await processEmployeeData(data, userId);
      break;
    case "attendance":
      await processAttendanceData(data, userId);
      break;
    case "salary":
      await processSalaryData(data, userId);
      break;
    case "wifi":
      await processWifiData(data, userId);
      break;
    default:
      throw new Error("Unknown file type");
  }
}

async function processEmployeeData(data: any[], userId: string) {
  for (const row of data) {
    try {
      const employeeData = insertEmployeeSchema.parse({
        employeeId: row.employee_id || row.employeeId || row.id,
        firstName: row.first_name || row.firstName,
        lastName: row.last_name || row.lastName,
        email: row.email,
        department: row.department,
        position: row.position,
        hireDate: row.hire_date || row.hireDate,
        salary: row.salary ? parseFloat(row.salary) : undefined,
        status: row.status || "active",
        userId,
      });
      await storage.createEmployee(employeeData);
    } catch (error) {
      console.error("Error processing employee row:", error, row);
    }
  }
}

async function processAttendanceData(data: any[], userId: string) {
  for (const row of data) {
    try {
      const attendanceData = insertAttendanceRecordSchema.parse({
        employeeId: row.employee_id || row.employeeId,
        date: row.date,
        timeIn: row.time_in || row.timeIn ? new Date(row.time_in || row.timeIn) : undefined,
        timeOut: row.time_out || row.timeOut ? new Date(row.time_out || row.timeOut) : undefined,
        status: row.status,
        userId,
      });
      await storage.createAttendanceRecord(attendanceData);
    } catch (error) {
      console.error("Error processing attendance row:", error, row);
    }
  }
}

async function processSalaryData(data: any[], userId: string) {
  for (const row of data) {
    try {
      const salaryData = insertSalaryPaymentSchema.parse({
        employeeId: row.employee_id || row.employeeId,
        paymentDate: row.payment_date || row.paymentDate,
        amount: parseFloat(row.amount),
        payPeriodStart: row.pay_period_start || row.payPeriodStart,
        payPeriodEnd: row.pay_period_end || row.payPeriodEnd,
        userId,
      });
      await storage.createSalaryPayment(salaryData);
    } catch (error) {
      console.error("Error processing salary row:", error, row);
    }
  }
}

async function processWifiData(data: any[], userId: string) {
  for (const row of data) {
    try {
      const wifiData = insertWifiSessionSchema.parse({
        employeeId: row.employee_id || row.employeeId,
        sessionStart: new Date(row.session_start || row.sessionStart),
        sessionEnd: row.session_end || row.sessionEnd ? new Date(row.session_end || row.sessionEnd) : undefined,
        deviceMac: row.device_mac || row.deviceMac,
        ipAddress: row.ip_address || row.ipAddress,
        userId,
      });
      await storage.createWifiSession(wifiData);
    } catch (error) {
      console.error("Error processing wifi row:", error, row);
    }
  }
}

async function runAnomalyDetection(userId: string) {
  // This is a simplified anomaly detection algorithm
  // In a real implementation, this would use Google Gemini or other ML services
  
  const employees = await storage.getEmployeesByUserId(userId);
  const attendanceRecords = await storage.getAttendanceRecordsByUserId(userId);
  const wifiSessions = await storage.getWifiSessionsByUserId(userId);
  const salaryPayments = await storage.getSalaryPaymentsByUserId(userId);

  for (const employee of employees) {
    // Check for Wi-Fi inconsistencies
    const employeeAttendance = attendanceRecords.filter(
      (record) => record.employeeId === employee.employeeId && record.status === "present"
    );
    
    const employeeWifi = wifiSessions.filter(
      (session) => session.employeeId === employee.employeeId
    );

    // Flag employees who are marked present but have no WiFi sessions
    if (employeeAttendance.length > 0 && employeeWifi.length === 0) {
      await storage.createAnomaly({
        employeeId: employee.employeeId,
        type: "wifi_inconsistency",
        riskScore: 95,
        description: `Employee marked present for ${employeeAttendance.length} days but no Wi-Fi connection recorded`,
        details: {
          attendanceDays: employeeAttendance.length,
          wifiSessions: employeeWifi.length,
        },
        userId,
      });
    }

    // Check for payroll irregularities
    const recentAttendance = attendanceRecords.filter(
      (record) => 
        record.employeeId === employee.employeeId && 
        new Date(record.date!) > new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) // Last 45 days
    );

    const recentSalary = salaryPayments.filter(
      (payment) => 
        payment.employeeId === employee.employeeId &&
        new Date(payment.paymentDate!) > new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
    );

    // Flag employees receiving salary but no attendance
    if (recentSalary.length > 0 && recentAttendance.length === 0) {
      await storage.createAnomaly({
        employeeId: employee.employeeId,
        type: "payroll_irregularity",
        riskScore: 78,
        description: `Salary payments continue with no attendance for 45 days`,
        details: {
          salaryPayments: recentSalary.length,
          attendanceDays: recentAttendance.length,
        },
        userId,
      });
    }
  }
}
