// server/index-prod.ts
import fs from "node:fs";
import path from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull().unique(),
  email: text("email"),
  name: text("name").notNull(),
  userType: text("user_type").notNull(),
  // 'customer' or 'technician'
  city: text("city"),
  pin: text("pin"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  isOnline: boolean("is_online").default(false),
  walletBalance: integer("wallet_balance").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var technicianProfiles = pgTable("technician_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  category: text("category").notNull(),
  subcategories: text("subcategories").array(),
  yearsExperience: integer("years_experience"),
  dailyWage: integer("daily_wage"),
  hourlyWage: integer("hourly_wage"),
  rating: integer("rating").default(45),
  // out of 50
  certifications: text("certifications"),
  whatsappNumber: text("whatsapp_number"),
  whatsappUnlockedBy: text("whatsapp_unlocked_by").array().default(sql`ARRAY[]::text[]`),
  socialLinks: text("social_links")
});
var portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  technicianId: varchar("technician_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  price: integer("price"),
  completedAt: timestamp("completed_at")
});
var jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category"),
  city: text("city"),
  pin: text("pin"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  status: text("status").default("open"),
  // 'open', 'in_progress', 'completed', 'cancelled'
  imageUrls: text("image_urls").array(),
  createdAt: timestamp("created_at").defaultNow()
});
var bids = pgTable("bids", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull(),
  technicianId: varchar("technician_id").notNull(),
  amount: integer("amount").notNull(),
  deliveryTime: text("delivery_time"),
  // e.g., "2 days", "4 hours"
  note: text("note"),
  isDefault: boolean("is_default").default(false),
  status: text("status").default("pending"),
  // 'pending', 'accepted', 'rejected'
  createdAt: timestamp("created_at").defaultNow()
});
var walletTransactions = pgTable("wallet_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  amount: integer("amount").notNull(),
  type: text("type").notNull(),
  // 'recharge', 'unlock_contact', 'refund'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow()
});
var otpVerifications = pgTable("otp_verifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  verified: boolean("verified").default(false)
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertTechnicianProfileSchema = createInsertSchema(technicianProfiles).omit({
  id: true
});
var insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  completedAt: true
});
var insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  createdAt: true,
  status: true
});
var insertBidSchema = createInsertSchema(bids).omit({
  id: true,
  createdAt: true,
  status: true
});
var insertWalletTransactionSchema = createInsertSchema(walletTransactions).omit({
  id: true,
  createdAt: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
var databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}
var sql2 = neon(databaseUrl);
var db = drizzle(sql2);

// server/storage.ts
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";
var PostgresStorage = class {
  sessions = /* @__PURE__ */ new Map();
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }
  async getUserByPhone(phone) {
    const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    return result[0];
  }
  async createUser(user) {
    const newUser = await db.insert(users).values(user).returning();
    return newUser[0];
  }
  async updateUser(id, updates) {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }
  async getAllUsers() {
    return await db.select().from(users);
  }
  async getTechnicianProfile(userId) {
    const result = await db.select().from(technicianProfiles).where(eq(technicianProfiles.userId, userId)).limit(1);
    return result[0];
  }
  async getTechnicianProfileByUserId(userId) {
    const result = await db.select().from(technicianProfiles).where(eq(technicianProfiles.userId, userId)).limit(1);
    return result[0];
  }
  async createTechnicianProfile(profile) {
    const newProfile = await db.insert(technicianProfiles).values(profile).returning();
    return newProfile[0];
  }
  async updateTechnicianProfile(userId, updates) {
    const result = await db.update(technicianProfiles).set(updates).where(eq(technicianProfiles.userId, userId)).returning();
    return result[0];
  }
  async getAllTechnicianProfiles() {
    return await db.select().from(technicianProfiles);
  }
  async getPortfolioItems(technicianId) {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.technicianId, technicianId));
  }
  async createPortfolioItem(item) {
    const newItem = await db.insert(portfolioItems).values(item).returning();
    return newItem[0];
  }
  async getJob(id) {
    const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return result[0];
  }
  async getAllJobs() {
    return await db.select().from(jobs);
  }
  async createJob(job) {
    const newJob = await db.insert(jobs).values(job).returning();
    return newJob[0];
  }
  async updateJob(id, updates) {
    const result = await db.update(jobs).set(updates).where(eq(jobs.id, id)).returning();
    return result[0];
  }
  async getBid(id) {
    const result = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
    return result[0];
  }
  async getBidsByJob(jobId) {
    return await db.select().from(bids).where(eq(bids.jobId, jobId));
  }
  async getBidsByTechnician(technicianId) {
    return await db.select().from(bids).where(eq(bids.technicianId, technicianId));
  }
  async createBid(bid) {
    const newBid = await db.insert(bids).values(bid).returning();
    return newBid[0];
  }
  async updateBid(id, updates) {
    const result = await db.update(bids).set(updates).where(eq(bids.id, id)).returning();
    return result[0];
  }
  async addWalletTransaction(transaction) {
    const newTx = await db.insert(walletTransactions).values(transaction).returning();
    return newTx[0];
  }
  async getWalletTransactions(userId) {
    return await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId));
  }
  async createOtp(phone, otp) {
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    await db.insert(otpVerifications).values({
      phone,
      otp,
      expiresAt,
      verified: false
    });
  }
  async verifyOtp(phone, otp) {
    const result = await db.select().from(otpVerifications).where(and(eq(otpVerifications.phone, phone), eq(otpVerifications.otp, otp))).limit(1);
    if (!result[0]) return false;
    const otpRecord = result[0];
    if (/* @__PURE__ */ new Date() > otpRecord.expiresAt) {
      return false;
    }
    await db.delete(otpVerifications).where(eq(otpVerifications.id, otpRecord.id));
    return true;
  }
  async createSession(userId) {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }
  async getSession(token) {
    return this.sessions.get(token);
  }
  async deleteSession(token) {
    this.sessions.delete(token);
  }
};
var storage = new PostgresStorage();

// server/routes.ts
var authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = await storage.getSession(token);
  if (!userId) {
    return res.status(401).json({ error: "Invalid session" });
  }
  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }
  req.user = user;
  next();
};
async function registerRoutes(app2) {
  app2.post("/api/auth/signup", async (req, res) => {
    try {
      const { userType, phone, name, email, city, pin, bio, category, subcategories, yearsExperience, dailyWage, hourlyWage, certifications, whatsappNumber } = req.body;
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ error: "User with this phone number already exists" });
      }
      const user = await storage.createUser({
        phone,
        name,
        email: email || null,
        userType,
        city: city || null,
        pin: pin || null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, "")}&scale=80`,
        bio: bio || null,
        isOnline: true,
        walletBalance: 100
        // Start with ₹100 for demo
      });
      if (userType === "technician" && category) {
        await storage.createTechnicianProfile({
          userId: user.id,
          category,
          subcategories: subcategories || [],
          yearsExperience: parseInt(yearsExperience) || null,
          dailyWage: parseInt(dailyWage) || null,
          hourlyWage: parseInt(hourlyWage) || null,
          rating: 45,
          certifications: certifications || null,
          whatsappNumber: whatsappNumber || phone,
          whatsappUnlockedBy: [],
          socialLinks: null
        });
      }
      const token = await storage.createSession(user.id);
      res.json({ ...user, token });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Failed to create account" });
    }
  });
  app2.post("/api/auth/signin", async (req, res) => {
    try {
      const { phone } = req.body;
      const otp = Math.floor(1e5 + Math.random() * 9e5).toString();
      await storage.createOtp(phone, otp);
      console.log(`\u{1F4F1} OTP for ${phone}: ${otp} (Firebase will send SMS)`);
      res.json({ success: true, message: "OTP sent to your phone" });
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });
  app2.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { phone, otp } = req.body;
      const isValid = await storage.verifyOtp(phone, otp);
      if (!isValid) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ error: "User not found. Please sign up first." });
      }
      await storage.updateUser(user.id, { isOnline: true });
      const token = await storage.createSession(user.id);
      res.json({ ...user, token });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ error: "Failed to verify OTP" });
    }
  });
  app2.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;
      if (!idToken) {
        return res.status(400).json({ error: "ID token required" });
      }
      const parts = idToken.split(".");
      if (parts.length !== 3) {
        return res.status(400).json({ error: "Invalid token format" });
      }
      const payload = parts[1];
      const padded = payload + "=".repeat((4 - payload.length % 4) % 4);
      const decoded = JSON.parse(Buffer.from(padded, "base64").toString());
      const { email, name, picture, uid } = decoded;
      if (!email) {
        return res.status(400).json({ error: "Email required from Google account" });
      }
      let user = await storage.getUserByPhone(email);
      if (!user) {
        user = await storage.createUser({
          phone: email,
          // Use email as phone field for uniqueness
          name: name || email.split("@")[0],
          email,
          userType: "customer",
          city: null,
          pin: null,
          avatarUrl: picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}&scale=80`,
          bio: null,
          isOnline: true,
          walletBalance: 100
        });
      } else {
        await storage.updateUser(user.id, { isOnline: true });
      }
      const token = await storage.createSession(user.id);
      res.json({ ...user, token });
    } catch (error) {
      console.error("Google sign-in error:", error);
      res.status(500).json({ error: error.message || "Failed to sign in with Google" });
    }
  });
  app2.get("/api/users/me", authenticate, async (req, res) => {
    res.json(req.user);
  });
  app2.patch("/api/users/profile", authenticate, async (req, res) => {
    try {
      const updates = req.body;
      const updatedUser = await storage.updateUser(req.user.id, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
  app2.get("/api/technicians", async (req, res) => {
    try {
      const { category, pin, search, online } = req.query;
      const allUsers = await storage.getAllUsers();
      const technicianUsers = allUsers.filter((u) => u.userType === "technician");
      const technicians = await Promise.all(
        technicianUsers.map(async (user) => {
          const profile = await storage.getTechnicianProfile(user.id);
          const portfolio = await storage.getPortfolioItems(user.id);
          return { ...user, profile, portfolio };
        })
      );
      let filtered = technicians.filter((t) => t.profile);
      if (category && category !== "all") {
        filtered = filtered.filter((t) => t.profile?.category?.toLowerCase().includes(category.toString().toLowerCase()));
      }
      if (pin) {
        filtered = filtered.filter((t) => t.pin === pin);
      }
      if (search) {
        const searchLower = search.toString().toLowerCase();
        filtered = filtered.filter(
          (t) => t.name.toLowerCase().includes(searchLower) || t.city?.toLowerCase().includes(searchLower) || t.profile?.category?.toLowerCase().includes(searchLower)
        );
      }
      if (online === "true") {
        filtered = filtered.filter((t) => t.isOnline);
      }
      res.json(filtered);
    } catch (error) {
      console.error("Get technicians error:", error);
      res.status(500).json({ error: "Failed to fetch technicians" });
    }
  });
  app2.get("/api/technicians/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user || user.userType !== "technician") {
        return res.status(404).json({ error: "Technician not found" });
      }
      const profile = await storage.getTechnicianProfile(user.id);
      const portfolio = await storage.getPortfolioItems(user.id);
      res.json({ ...user, profile, portfolio });
    } catch (error) {
      console.error("Get technician error:", error);
      res.status(500).json({ error: "Failed to fetch technician" });
    }
  });
  app2.get("/api/jobs", async (req, res) => {
    try {
      const allJobs = await storage.getAllJobs();
      const jobsWithDetails = await Promise.all(
        allJobs.map(async (job) => {
          const customer = await storage.getUser(job.customerId);
          const jobBids = await storage.getBidsByJob(job.id);
          const bidsWithTechnicians = await Promise.all(
            jobBids.map(async (bid) => {
              const technician = await storage.getUser(bid.technicianId);
              return { ...bid, technician };
            })
          );
          return { ...job, customer, bids: bidsWithTechnicians };
        })
      );
      jobsWithDetails.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      res.json(jobsWithDetails);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });
  app2.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      const customer = await storage.getUser(job.customerId);
      const jobBids = await storage.getBidsByJob(job.id);
      const bidsWithTechnicians = await Promise.all(
        jobBids.map(async (bid) => {
          const technician = await storage.getUser(bid.technicianId);
          return { ...bid, technician };
        })
      );
      res.json({ ...job, customer, bids: bidsWithTechnicians });
    } catch (error) {
      console.error("Get job error:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });
  app2.post("/api/jobs", authenticate, async (req, res) => {
    try {
      const jobData = {
        customerId: req.user.id,
        title: req.body.title,
        description: req.body.description,
        category: req.body.category || null,
        city: req.body.city || null,
        pin: req.body.pin || null,
        budgetMin: req.body.budgetMin || null,
        budgetMax: req.body.budgetMax || null,
        imageUrls: req.body.imageUrls || null
      };
      const job = await storage.createJob(jobData);
      res.json(job);
    } catch (error) {
      console.error("Create job error:", error);
      res.status(500).json({ error: "Failed to create job" });
    }
  });
  app2.patch("/api/jobs/:id/status", authenticate, async (req, res) => {
    try {
      const { status } = req.body;
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      if (job.customerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      const updatedJob = await storage.updateJob(job.id, { status });
      res.json(updatedJob);
    } catch (error) {
      console.error("Update job status error:", error);
      res.status(500).json({ error: "Failed to update job status" });
    }
  });
  app2.post("/api/bids", authenticate, async (req, res) => {
    try {
      const bidData = {
        jobId: req.body.jobId,
        technicianId: req.user.id,
        amount: req.body.amount,
        deliveryTime: req.body.deliveryTime || null,
        note: req.body.note || null,
        isDefault: req.body.isDefault || false
      };
      const bid = await storage.createBid(bidData);
      res.json(bid);
    } catch (error) {
      console.error("Create bid error:", error);
      res.status(500).json({ error: "Failed to create bid" });
    }
  });
  app2.get("/api/jobs/:id/bids", async (req, res) => {
    try {
      const bids2 = await storage.getBidsByJob(req.params.id);
      const bidsWithTechnicians = await Promise.all(
        bids2.map(async (bid) => {
          const technician = await storage.getUser(bid.technicianId);
          return { ...bid, technician };
        })
      );
      res.json(bidsWithTechnicians);
    } catch (error) {
      console.error("Get bids error:", error);
      res.status(500).json({ error: "Failed to fetch bids" });
    }
  });
  app2.patch("/api/bids/:id/accept", authenticate, async (req, res) => {
    try {
      const bid = await storage.getBid(req.params.id);
      if (!bid) {
        return res.status(404).json({ error: "Bid not found" });
      }
      const job = await storage.getJob(bid.jobId);
      if (!job || job.customerId !== req.user.id) {
        return res.status(403).json({ error: "Unauthorized" });
      }
      await storage.updateBid(bid.id, { status: "accepted" });
      await storage.updateJob(job.id, { status: "in_progress" });
      const allBids = await storage.getBidsByJob(job.id);
      await Promise.all(
        allBids.filter((b) => b.id !== bid.id && b.status === "pending").map((b) => storage.updateBid(b.id, { status: "rejected" }))
      );
      res.json({ success: true });
    } catch (error) {
      console.error("Accept bid error:", error);
      res.status(500).json({ error: "Failed to accept bid" });
    }
  });
  app2.post("/api/wallet/recharge", authenticate, async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount,
        type: "recharge",
        description: `Wallet recharge of \u20B9${amount}`
      });
      const newBalance = (req.user.walletBalance || 0) + amount;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });
      res.json({ success: true, newBalance });
    } catch (error) {
      console.error("Recharge wallet error:", error);
      res.status(500).json({ error: "Failed to recharge wallet" });
    }
  });
  app2.post("/api/wallet/unlock-contact", authenticate, async (req, res) => {
    try {
      const { contactId } = req.body;
      const unlockCost = 10;
      if (req.user.walletBalance < unlockCost) {
        return res.status(400).json({ error: "Insufficient balance" });
      }
      const profile = await storage.getTechnicianProfile(contactId);
      if (!profile) {
        return res.status(404).json({ error: "Contact not found" });
      }
      if (profile.whatsappUnlockedBy?.includes(req.user.id)) {
        return res.json({ success: true, alreadyUnlocked: true, whatsappNumber: profile.whatsappNumber });
      }
      await storage.addWalletTransaction({
        userId: req.user.id,
        amount: -unlockCost,
        type: "unlock_contact",
        description: `Unlocked contact for technician`
      });
      const newBalance = req.user.walletBalance - unlockCost;
      await storage.updateUser(req.user.id, { walletBalance: newBalance });
      const unlockedBy = [...profile.whatsappUnlockedBy || [], req.user.id];
      await storage.updateTechnicianProfile(contactId, { whatsappUnlockedBy: unlockedBy });
      res.json({ success: true, newBalance, whatsappNumber: profile.whatsappNumber });
    } catch (error) {
      console.error("Unlock contact error:", error);
      res.status(500).json({ error: "Failed to unlock contact" });
    }
  });
  app2.post("/api/seed/demo", async (req, res) => {
    try {
      const existingUsers = await storage.getAllUsers();
      if (existingUsers.length > 0) {
        return res.json({ success: true, message: "Demo data already exists" });
      }
      const customer1 = await storage.createUser({
        phone: "9876543210",
        name: "Rajesh Kumar",
        email: "rajesh@example.com",
        userType: "customer",
        city: "Mumbai",
        pin: "400001",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=RajeshKumar&scale=80`,
        bio: "Looking for reliable technicians",
        isOnline: true,
        walletBalance: 500
      });
      const customer2 = await storage.createUser({
        phone: "9876543211",
        name: "Priya Sharma",
        email: "priya@example.com",
        userType: "customer",
        city: "Delhi",
        pin: "110001",
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma&scale=80`,
        bio: null,
        isOnline: false,
        walletBalance: 300
      });
      const technicianData = [
        { name: "Rahul Verma", phone: "9123456780", city: "Mumbai", pin: "400001", category: "Construction & Civil Work", subcategories: ["Mason (Rajmistri)", "Carpenter"], experience: 8, dailyWage: 800, hourlyWage: 100, rating: 48, whatsapp: "9123456780" },
        { name: "Amit Singh", phone: "9123456781", city: "Delhi", pin: "110001", category: "Construction & Civil Work", subcategories: ["Electrician", "Plumber"], experience: 5, dailyWage: 600, hourlyWage: 75, rating: 45, whatsapp: "9123456781" },
        { name: "Suresh Patil", phone: "9123456782", city: "Mumbai", pin: "400002", category: "Specialized Technical Labour (Contract-based)", subcategories: ["AC technician", "RO technician"], experience: 6, dailyWage: 700, hourlyWage: 90, rating: 46, whatsapp: "9123456782" },
        { name: "Vikas Reddy", phone: "9123456783", city: "Bangalore", pin: "560001", category: "Construction & Civil Work", subcategories: ["Welder / Fabricator", "Bar Bender / Steel Fixer"], experience: 10, dailyWage: 900, hourlyWage: 120, rating: 49, whatsapp: "9123456783" },
        { name: "Manish Gupta", phone: "9123456784", city: "Delhi", pin: "110002", category: "Construction & Civil Work", subcategories: ["Painter / POP Technician", "Tile / Marble Worker"], experience: 7, dailyWage: 750, hourlyWage: 95, rating: 47, whatsapp: "9123456784" },
        { name: "Deepak Joshi", phone: "9123456785", city: "Mumbai", pin: "400003", category: "Maintenance & Repair Labour", subcategories: ["House repair workers", "Waterproofing workers"], experience: 4, dailyWage: 550, hourlyWage: 70, rating: 44, whatsapp: "9123456785" },
        { name: "Ravi Kumar", phone: "9123456786", city: "Pune", pin: "411001", category: "Industrial & Factory Labour", subcategories: ["Machine operator", "Production line worker"], experience: 9, dailyWage: 850, hourlyWage: 110, rating: 48, whatsapp: "9123456786" },
        { name: "Ankit Sharma", phone: "9123456787", city: "Delhi", pin: "110003", category: "Household & Domestic Work", subcategories: ["Driver", "Gardener / Mali"], experience: 3, dailyWage: 450, hourlyWage: 60, rating: 42, whatsapp: "9123456787" }
      ];
      for (const tech of technicianData) {
        const user = await storage.createUser({
          phone: tech.phone,
          name: tech.name,
          email: null,
          userType: "technician",
          city: tech.city,
          pin: tech.pin,
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${tech.name.replace(/\s/g, "")}&scale=80`,
          bio: `Experienced ${tech.category.toLowerCase()} professional with ${tech.experience} years of expertise`,
          isOnline: Math.random() > 0.5,
          walletBalance: 0
        });
        await storage.createTechnicianProfile({
          userId: user.id,
          category: tech.category,
          subcategories: tech.subcategories,
          yearsExperience: tech.experience,
          dailyWage: tech.dailyWage,
          hourlyWage: tech.hourlyWage,
          rating: tech.rating,
          certifications: "Certified professional with ITI certification",
          whatsappNumber: tech.whatsapp,
          whatsappUnlockedBy: [],
          socialLinks: null
        });
        if (Math.random() > 0.3) {
          await storage.createPortfolioItem({
            technicianId: user.id,
            title: `${tech.subcategories[0]} project`,
            description: `Successfully completed ${tech.subcategories[0].toLowerCase()} work for residential client`,
            imageUrl: null,
            price: Math.floor(Math.random() * 5e3) + 2e3,
            completedAt: null
          });
        }
      }
      const job1 = await storage.createJob({
        customerId: customer1.id,
        title: "Bathroom plumbing repair needed",
        description: "Need a plumber to fix leaking pipes in bathroom. Urgent work required.",
        category: "Construction & Civil Work",
        city: "Mumbai",
        pin: "400001",
        budgetMin: 2e3,
        budgetMax: 4e3,
        imageUrls: null
      });
      const job2 = await storage.createJob({
        customerId: customer2.id,
        title: "Electrical wiring for new room",
        description: "Complete electrical wiring needed for newly constructed room including switches and lights.",
        category: "Construction & Civil Work",
        city: "Delhi",
        pin: "110001",
        budgetMin: 5e3,
        budgetMax: 8e3,
        imageUrls: null
      });
      const job3 = await storage.createJob({
        customerId: customer1.id,
        title: "AC installation and servicing",
        description: "Need technician to install split AC and service existing AC unit.",
        category: "Specialized Technical Labour (Contract-based)",
        city: "Mumbai",
        pin: "400001",
        budgetMin: 3e3,
        budgetMax: 5e3,
        imageUrls: null
      });
      const job4 = await storage.createJob({
        customerId: customer2.id,
        title: "House painting work",
        description: "Looking for painter to paint 2BHK apartment. Interior walls and ceiling.",
        category: "Construction & Civil Work",
        city: "Delhi",
        pin: "110001",
        budgetMin: 15e3,
        budgetMax: 2e4,
        imageUrls: null
      });
      const allTechnicians = await storage.getAllUsers();
      const technicians = allTechnicians.filter((u) => u.userType === "technician");
      for (let i = 0; i < Math.min(3, technicians.length); i++) {
        await storage.createBid({
          jobId: job1.id,
          technicianId: technicians[i].id,
          amount: 2500 + i * 500,
          deliveryTime: `${i + 1} days`,
          note: "I have experience with similar work",
          isDefault: i === 0
        });
      }
      for (let i = 0; i < Math.min(2, technicians.length); i++) {
        await storage.createBid({
          jobId: job2.id,
          technicianId: technicians[i].id,
          amount: 6e3 + i * 1e3,
          deliveryTime: `${i + 2} days`,
          note: "Professional electrical work guaranteed",
          isDefault: i === 0
        });
      }
      res.json({ success: true, message: "Demo data seeded successfully" });
    } catch (error) {
      console.error("Seed demo error:", error);
      res.status(500).json({ error: "Failed to seed demo data" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
