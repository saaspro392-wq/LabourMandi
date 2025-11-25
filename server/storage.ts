import {
  type User,
  type InsertUser,
  type TechnicianProfile,
  type InsertTechnicianProfile,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Job,
  type InsertJob,
  type Bid,
  type InsertBid,
  type WalletTransaction,
  type InsertWalletTransaction,
  users,
  technicianProfiles,
  portfolioItems,
  jobs,
  bids,
  walletTransactions,
  otpVerifications,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined>;
  getTechnicianProfileByUserId(userId: string): Promise<TechnicianProfile | undefined>;
  createTechnicianProfile(profile: InsertTechnicianProfile): Promise<TechnicianProfile>;
  updateTechnicianProfile(userId: string, updates: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined>;
  getAllTechnicianProfiles(): Promise<TechnicianProfile[]>;
  
  getPortfolioItems(technicianId: string): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  
  getJob(id: string): Promise<Job | undefined>;
  getAllJobs(): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined>;
  
  getBid(id: string): Promise<Bid | undefined>;
  getBidsByJob(jobId: string): Promise<Bid[]>;
  getBidsByTechnician(technicianId: string): Promise<Bid[]>;
  createBid(bid: InsertBid): Promise<Bid>;
  updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined>;
  
  addWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction>;
  getWalletTransactions(userId: string): Promise<WalletTransaction[]>;
  
  createOtp(phone: string, otp: string): Promise<void>;
  verifyOtp(phone: string, otp: string): Promise<boolean>;
  
  createSession(userId: string): Promise<string>;
  getSession(token: string): Promise<string | undefined>;
  deleteSession(token: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  private sessions: Map<string, string> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByPhone(phone: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const newUser = await db.insert(users).values(user).returning();
    return newUser[0];
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getTechnicianProfile(userId: string): Promise<TechnicianProfile | undefined> {
    const result = await db.select().from(technicianProfiles).where(eq(technicianProfiles.userId, userId)).limit(1);
    return result[0];
  }

  async getTechnicianProfileByUserId(userId: string): Promise<TechnicianProfile | undefined> {
    const result = await db.select().from(technicianProfiles).where(eq(technicianProfiles.userId, userId)).limit(1);
    return result[0];
  }

  async createTechnicianProfile(profile: InsertTechnicianProfile): Promise<TechnicianProfile> {
    const newProfile = await db.insert(technicianProfiles).values(profile).returning();
    return newProfile[0];
  }

  async updateTechnicianProfile(userId: string, updates: Partial<TechnicianProfile>): Promise<TechnicianProfile | undefined> {
    const result = await db.update(technicianProfiles).set(updates).where(eq(technicianProfiles.userId, userId)).returning();
    return result[0];
  }

  async getAllTechnicianProfiles(): Promise<TechnicianProfile[]> {
    return await db.select().from(technicianProfiles);
  }

  async getPortfolioItems(technicianId: string): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).where(eq(portfolioItems.technicianId, technicianId));
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const newItem = await db.insert(portfolioItems).values(item).returning();
    return newItem[0];
  }

  async getJob(id: string): Promise<Job | undefined> {
    const result = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
    return result[0];
  }

  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs);
  }

  async createJob(job: InsertJob): Promise<Job> {
    const newJob = await db.insert(jobs).values(job).returning();
    return newJob[0];
  }

  async updateJob(id: string, updates: Partial<Job>): Promise<Job | undefined> {
    const result = await db.update(jobs).set(updates).where(eq(jobs.id, id)).returning();
    return result[0];
  }

  async getBid(id: string): Promise<Bid | undefined> {
    const result = await db.select().from(bids).where(eq(bids.id, id)).limit(1);
    return result[0];
  }

  async getBidsByJob(jobId: string): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.jobId, jobId));
  }

  async getBidsByTechnician(technicianId: string): Promise<Bid[]> {
    return await db.select().from(bids).where(eq(bids.technicianId, technicianId));
  }

  async createBid(bid: InsertBid): Promise<Bid> {
    const newBid = await db.insert(bids).values(bid).returning();
    return newBid[0];
  }

  async updateBid(id: string, updates: Partial<Bid>): Promise<Bid | undefined> {
    const result = await db.update(bids).set(updates).where(eq(bids.id, id)).returning();
    return result[0];
  }

  async addWalletTransaction(transaction: InsertWalletTransaction): Promise<WalletTransaction> {
    const newTx = await db.insert(walletTransactions).values(transaction).returning();
    return newTx[0];
  }

  async getWalletTransactions(userId: string): Promise<WalletTransaction[]> {
    return await db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId));
  }

  async createOtp(phone: string, otp: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    await db.insert(otpVerifications).values({
      phone,
      otp,
      expiresAt,
      verified: false,
    });
  }

  async verifyOtp(phone: string, otp: string): Promise<boolean> {
    const result = await db.select().from(otpVerifications)
      .where(and(eq(otpVerifications.phone, phone), eq(otpVerifications.otp, otp)))
      .limit(1);
    
    if (!result[0]) return false;
    
    const otpRecord = result[0];
    if (new Date() > otpRecord.expiresAt) {
      return false;
    }
    
    await db.delete(otpVerifications).where(eq(otpVerifications.id, otpRecord.id));
    return true;
  }

  async createSession(userId: string): Promise<string> {
    const token = randomUUID();
    this.sessions.set(token, userId);
    return token;
  }

  async getSession(token: string): Promise<string | undefined> {
    return this.sessions.get(token);
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }
}

export const storage = new PostgresStorage();
