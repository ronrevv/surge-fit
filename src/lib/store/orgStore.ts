/**
 * ⚡ SURGEFIT ENTERPRISE IN-MEMORY STORE
 * Simulates a full multi-tenant PostgreSQL/Supabase backend with
 * reactive state shared across all role views. No static data.
 * Replace with real Supabase calls by swapping the store.* methods.
 */

import { RoleType } from "@/components/navigation/TopNavBar";

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type OrgStatus = "pending" | "active" | "suspended";
export type BranchStatus = "active" | "maintenance" | "closed";
export type UserStatus = "invited" | "active" | "suspended";

export interface GymChain {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  ownerName: string;
  tier: "starter" | "professional" | "enterprise";
  status: OrgStatus;
  mrr: number;
  branches: string[]; // branch IDs
  createdAt: string;
  city: string;
  country: string;
}

export interface Branch {
  id: string;
  chainId: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  status: BranchStatus;
  managerId?: string;
  trainers: string[]; // user IDs
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: UserStatus;
  organizationId?: string; // chainId or null for independent
  branchId?: string;
  trainerId?: string; // for trainees — which trainer owns them
  phone?: string;
  joinedAt: string;
  // trainer-specific
  specialization?: string;
  rating?: number;
  // trainee-specific
  goal?: string;
  weightKg?: number;
  heightCm?: number;
  // independent trainer
  monthlyRevenue?: number;
  totalClients?: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actorRole: RoleType;
  actorName: string;
  targetName: string;
  timestamp: string;
  severity: "info" | "warn" | "critical";
}

// ─── INITIAL SEED DATA ────────────────────────────────────────────────────────

const SEED_CHAINS: GymChain[] = [
  {
    id: "chain_001",
    name: "MetroFit Fitness Labs",
    slug: "metrofit",
    ownerEmail: "owner@metrofit.com",
    ownerName: "Alex Vance",
    tier: "enterprise",
    status: "active",
    mrr: 84200,
    branches: ["branch_001", "branch_002"],
    createdAt: "2024-01-15",
    city: "New York",
    country: "USA",
  },
  {
    id: "chain_002",
    name: "Apex Athletics Group",
    slug: "apex",
    ownerEmail: "owner@apex.com",
    ownerName: "Marcus Thorne",
    tier: "professional",
    status: "pending",
    mrr: 52100,
    branches: ["branch_003"],
    createdAt: "2024-06-20",
    city: "Los Angeles",
    country: "USA",
  },
  {
    id: "chain_003",
    name: "Iron Vault Performance",
    slug: "ironvault",
    ownerEmail: "owner@ironvault.com",
    ownerName: "Elena Rostova",
    tier: "professional",
    status: "active",
    mrr: 38900,
    branches: [],
    createdAt: "2024-09-01",
    city: "Chicago",
    country: "USA",
  },
];

const SEED_BRANCHES: Branch[] = [
  {
    id: "branch_001",
    chainId: "chain_001",
    name: "Downtown Flagship",
    address: "100 Main Street",
    city: "Manhattan, NY",
    capacity: 500,
    status: "active",
    managerId: "user_bm_001",
    trainers: ["user_tr_001", "user_tr_002"],
    createdAt: "2024-01-20",
  },
  {
    id: "branch_002",
    chainId: "chain_001",
    name: "Westside High-Performance Center",
    address: "450 West Ave",
    city: "Brooklyn, NY",
    capacity: 350,
    status: "active",
    managerId: "user_bm_002",
    trainers: ["user_tr_003"],
    createdAt: "2024-03-10",
  },
  {
    id: "branch_003",
    chainId: "chain_002",
    name: "Apex Sunset District",
    address: "7800 Sunset Blvd",
    city: "Los Angeles, CA",
    capacity: 400,
    status: "active",
    trainers: [],
    createdAt: "2024-06-25",
  },
];

const SEED_USERS: AppUser[] = [
  // Branch Managers
  {
    id: "user_bm_001",
    name: "James Harrington",
    email: "james@metrofit.com",
    role: "branch_manager",
    status: "active",
    organizationId: "chain_001",
    branchId: "branch_001",
    phone: "+1-212-555-0101",
    joinedAt: "2024-01-20",
  },
  {
    id: "user_bm_002",
    name: "Priya Sharma",
    email: "priya@metrofit.com",
    role: "branch_manager",
    status: "active",
    organizationId: "chain_001",
    branchId: "branch_002",
    phone: "+1-718-555-0202",
    joinedAt: "2024-03-10",
  },
  // Trainers
  {
    id: "user_tr_001",
    name: "Coach Dave Reynolds",
    email: "dave@metrofit.com",
    role: "trainer",
    status: "active",
    organizationId: "chain_001",
    branchId: "branch_001",
    specialization: "Powerlifting & Strength",
    rating: 4.9,
    joinedAt: "2024-02-01",
  },
  {
    id: "user_tr_002",
    name: "Coach Sarah Kim",
    email: "sarah@metrofit.com",
    role: "trainer",
    status: "active",
    organizationId: "chain_001",
    branchId: "branch_001",
    specialization: "HIIT & Conditioning",
    rating: 4.8,
    joinedAt: "2024-02-15",
  },
  {
    id: "user_tr_003",
    name: "Coach Marcus West",
    email: "marcus@metrofit.com",
    role: "trainer",
    status: "active",
    organizationId: "chain_001",
    branchId: "branch_002",
    specialization: "Hypertrophy & Nutrition",
    rating: 5.0,
    joinedAt: "2024-04-01",
  },
  // Trainees
  {
    id: "user_tn_001",
    name: "Sarah Jenkins",
    email: "sarah.j@gmail.com",
    role: "trainee",
    status: "active",
    branchId: "branch_001",
    trainerId: "user_tr_001",
    goal: "Hypertrophy & Strength",
    weightKg: 68,
    heightCm: 165,
    joinedAt: "2024-03-01",
  },
  {
    id: "user_tn_002",
    name: "Marcus Brody",
    email: "marcus.b@gmail.com",
    role: "trainee",
    status: "active",
    branchId: "branch_001",
    trainerId: "user_tr_001",
    goal: "Fat Loss & Conditioning",
    weightKg: 95,
    heightCm: 182,
    joinedAt: "2024-03-15",
  },
  {
    id: "user_tn_003",
    name: "Elena Rostova",
    email: "elena@gmail.com",
    role: "trainee",
    status: "active",
    branchId: "branch_001",
    trainerId: "user_tr_002",
    goal: "Powerlifting",
    weightKg: 72,
    heightCm: 170,
    joinedAt: "2024-04-10",
  },
  // Independent Trainer
  {
    id: "user_it_001",
    name: "Ryan Owens",
    email: "ryan@independentfit.com",
    role: "independent_trainer",
    status: "active",
    specialization: "Online Coaching & Nutrition",
    rating: 4.7,
    monthlyRevenue: 14800,
    totalClients: 34,
    joinedAt: "2024-05-01",
  },
  {
    id: "user_it_002",
    name: "Ava Chen",
    email: "ava@fitpro.com",
    role: "trainee",
    status: "active",
    trainerId: "user_it_001",
    goal: "Lean Muscle & Mobility",
    weightKg: 55,
    heightCm: 160,
    joinedAt: "2024-05-10",
  },
];

const SEED_AUDIT: AuditLog[] = [
  {
    id: "audit_001",
    action: "Gym Chain Onboarded",
    actorRole: "super_admin",
    actorName: "Super Admin",
    targetName: "MetroFit Fitness Labs",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    severity: "info",
  },
  {
    id: "audit_002",
    action: "Branch Created",
    actorRole: "chain_owner",
    actorName: "Alex Vance",
    targetName: "Downtown Flagship",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    severity: "info",
  },
  {
    id: "audit_003",
    action: "Trainer Onboarded",
    actorRole: "branch_manager",
    actorName: "James Harrington",
    targetName: "Coach Dave Reynolds",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    severity: "info",
  },
  {
    id: "audit_004",
    action: "Pending Chain Approval Needed",
    actorRole: "super_admin",
    actorName: "System",
    targetName: "Apex Athletics Group",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    severity: "warn",
  },
];

// ─── STORE (Singleton reactive state) ────────────────────────────────────────

class OrgStore {
  private chains: GymChain[] = [...SEED_CHAINS];
  private branches: Branch[] = [...SEED_BRANCHES];
  private users: AppUser[] = [...SEED_USERS];
  private auditLogs: AuditLog[] = [...SEED_AUDIT];
  private listeners: Set<() => void> = new Set();

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // ── ID GENERATOR ──
  private uid(prefix: string) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }

  private addAudit(action: string, actorRole: RoleType, actorName: string, targetName: string, severity: AuditLog["severity"] = "info") {
    this.auditLogs.unshift({
      id: this.uid("audit"),
      action,
      actorRole,
      actorName,
      targetName,
      timestamp: new Date().toISOString(),
      severity,
    });
    if (this.auditLogs.length > 100) this.auditLogs.pop();
  }

  // ── CHAINS ────────────────────────────────────────────────────────────────

  getChains(): GymChain[] {
    return this.chains;
  }

  getChainById(id: string): GymChain | undefined {
    return this.chains.find((c) => c.id === id);
  }

  /** Super Admin: Onboard a new gym chain */
  onboardGymChain(data: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    tier: GymChain["tier"];
    city: string;
    country: string;
  }): GymChain {
    const chain: GymChain = {
      id: this.uid("chain"),
      slug: data.name.toLowerCase().replace(/\s+/g, "-").slice(0, 20),
      name: data.name,
      ownerName: data.ownerName,
      ownerEmail: data.ownerEmail,
      tier: data.tier,
      status: "pending",
      mrr: 0,
      branches: [],
      createdAt: new Date().toISOString().split("T")[0],
      city: data.city,
      country: data.country,
    };
    this.chains.unshift(chain);
    this.addAudit("Gym Chain Onboarded (Pending Approval)", "super_admin", "Super Admin", data.name, "warn");
    this.notify();
    return chain;
  }

  /** Super Admin: Approve / suspend chain */
  updateChainStatus(chainId: string, status: OrgStatus) {
    const chain = this.chains.find((c) => c.id === chainId);
    if (chain) {
      chain.status = status;
      this.addAudit(`Chain ${status.charAt(0).toUpperCase() + status.slice(1)}`, "super_admin", "Super Admin", chain.name, status === "suspended" ? "warn" : "info");
      this.notify();
    }
  }

  // ── BRANCHES ──────────────────────────────────────────────────────────────

  getBranches(): Branch[] {
    return this.branches;
  }

  getBranchesByChain(chainId: string): Branch[] {
    return this.branches.filter((b) => b.chainId === chainId);
  }

  getBranchById(id: string): Branch | undefined {
    return this.branches.find((b) => b.id === id);
  }

  /** Chain Owner: Create a new branch under their chain */
  createBranch(data: {
    chainId: string;
    name: string;
    address: string;
    city: string;
    capacity: number;
  }): Branch {
    const branch: Branch = {
      id: this.uid("branch"),
      chainId: data.chainId,
      name: data.name,
      address: data.address,
      city: data.city,
      capacity: data.capacity,
      status: "active",
      trainers: [],
      createdAt: new Date().toISOString().split("T")[0],
    };
    this.branches.unshift(branch);
    const chain = this.chains.find((c) => c.id === data.chainId);
    if (chain) {
      chain.branches.push(branch.id);
      this.addAudit("Branch Created", "chain_owner", chain.ownerName, data.name);
    }
    this.notify();
    return branch;
  }

  /** Chain Owner: Assign a branch manager */
  assignBranchManager(branchId: string, managerId: string) {
    const branch = this.branches.find((b) => b.id === branchId);
    if (branch) {
      branch.managerId = managerId;
      this.notify();
    }
  }

  // ── USERS ─────────────────────────────────────────────────────────────────

  getUsers(): AppUser[] {
    return this.users;
  }

  getUsersByBranch(branchId: string): AppUser[] {
    return this.users.filter((u) => u.branchId === branchId);
  }

  getTrainersByBranch(branchId: string): AppUser[] {
    return this.users.filter((u) => u.branchId === branchId && u.role === "trainer");
  }

  getTraineesByTrainer(trainerId: string): AppUser[] {
    return this.users.filter((u) => u.trainerId === trainerId && u.role === "trainee");
  }

  getTraineesByBranch(branchId: string): AppUser[] {
    return this.users.filter((u) => u.branchId === branchId && u.role === "trainee");
  }

  getIndependentTrainers(): AppUser[] {
    return this.users.filter((u) => u.role === "independent_trainer");
  }

  getUserById(id: string): AppUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  /** Branch Manager: Onboard a new trainer for their branch */
  onboardTrainer(data: {
    branchId: string;
    organizationId: string;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    actorName: string;
  }): AppUser {
    const trainer: AppUser = {
      id: this.uid("user_tr"),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "trainer",
      status: "invited",
      organizationId: data.organizationId,
      branchId: data.branchId,
      specialization: data.specialization,
      rating: 0,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    this.users.push(trainer);
    const branch = this.branches.find((b) => b.id === data.branchId);
    if (branch) branch.trainers.push(trainer.id);
    this.addAudit("Trainer Onboarded", "branch_manager", data.actorName, data.name);
    this.notify();
    return trainer;
  }

  /** Trainer: Onboard a new trainee */
  onboardTrainee(data: {
    trainerId: string;
    branchId?: string;
    organizationId?: string;
    name: string;
    email: string;
    phone: string;
    goal: string;
    weightKg: number;
    heightCm: number;
    actorName: string;
  }): AppUser {
    const trainee: AppUser = {
      id: this.uid("user_tn"),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "trainee",
      status: "active",
      organizationId: data.organizationId,
      branchId: data.branchId,
      trainerId: data.trainerId,
      goal: data.goal,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    this.users.push(trainee);
    this.addAudit("Trainee Onboarded", "trainer", data.actorName, data.name);
    this.notify();
    return trainee;
  }

  /** Independent Trainer: Onboard a new online client */
  onboardIndependentClient(data: {
    trainerId: string;
    name: string;
    email: string;
    phone: string;
    goal: string;
    weightKg: number;
    heightCm: number;
    actorName: string;
  }): AppUser {
    const client: AppUser = {
      id: this.uid("user_ic"),
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: "trainee",
      status: "active",
      trainerId: data.trainerId,
      goal: data.goal,
      weightKg: data.weightKg,
      heightCm: data.heightCm,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    this.users.push(client);
    const trainer = this.users.find((u) => u.id === data.trainerId);
    if (trainer) {
      trainer.totalClients = (trainer.totalClients || 0) + 1;
    }
    this.addAudit("Client Onboarded", "independent_trainer", data.actorName, data.name);
    this.notify();
    return client;
  }

  updateUserStatus(userId: string, status: UserStatus) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.status = status;
      this.notify();
    }
  }

  // ── AUDIT LOGS ────────────────────────────────────────────────────────────

  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  // ── ANALYTICS ─────────────────────────────────────────────────────────────

  getPlatformStats() {
    const activeChains = this.chains.filter((c) => c.status === "active").length;
    const pendingChains = this.chains.filter((c) => c.status === "pending").length;
    const totalBranches = this.branches.length;
    const totalTrainers = this.users.filter((u) => u.role === "trainer" || u.role === "independent_trainer").length;
    const totalTrainees = this.users.filter((u) => u.role === "trainee").length;
    const totalMRR = this.chains.reduce((a, c) => a + c.mrr, 0);
    return { activeChains, pendingChains, totalBranches, totalTrainers, totalTrainees, totalMRR };
  }

  getChainStats(chainId: string) {
    const branches = this.getBranchesByChain(chainId);
    const branchIds = branches.map((b) => b.id);
    const trainers = this.users.filter((u) => u.role === "trainer" && branchIds.includes(u.branchId || "")).length;
    const trainees = this.users.filter((u) => u.role === "trainee" && branchIds.includes(u.branchId || "")).length;
    const chain = this.getChainById(chainId);
    return { branches: branches.length, trainers, trainees, mrr: chain?.mrr || 0 };
  }
}

// Singleton export
export const store = new OrgStore();
