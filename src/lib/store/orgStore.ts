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

/**
 * AssignedPlan — links a trainer's saved workout/diet/schedule
 * to a specific trainee. Written by trainer, read by trainee.
 * This is the core data bridge between the two dashboards.
 */
export interface AssignedPlan {
  id: string;
  trainerId: string;
  traineeId: string;
  type: "workout" | "diet" | "schedule";
  title: string;      // routine.title or diet plan title
  summary: string;    // e.g. "4 exercises" or "3 meals · 2,500 kcal"
  assignedAt: string; // ISO date string
  content?: any;      // Raw JSON (exercises, meals, etc.)
}

/**
 * TrainerSavedPlan — A plan saved by a trainer to their personal library.
 * Can be assigned later.
 */
export interface TrainerSavedPlan {
  id: string;
  trainerId: string;
  type: "workout" | "diet" | "schedule";
  title: string;
  summary: string;
  content: any; // Raw JSON (exercises, meals, etc.)
  createdAt: string;
}

// ─── SESSION CONTEXT ─────────────────────────────────────────────────────────
// Simulates the JWT / auth session. Set when role changes in the UI.
// Every view reads from this so data flows across the full hierarchy.
export interface SessionContext {
  role: RoleType;
  userId?: string;      // the currently-logged-in user's ID
  chainId?: string;     // chain they belong to (chain_owner, chain_manager, branch_manager, trainer)
  branchId?: string;    // branch they manage / work in
  trainerId?: string;   // trainer ID (trainer role only)
  name?: string;        // display name
}

// ─── INITIAL SEED DATA ────────────────────────────────────────────────────────

const SEED_CHAINS: GymChain[] = [];

const SEED_BRANCHES: Branch[] = [];

const SEED_USERS: AppUser[] = [];

const SEED_AUDIT: AuditLog[] = [];

// ─── STORE (Singleton reactive state) ────────────────────────────────────────

class OrgStore {
  private chains: GymChain[] = [...SEED_CHAINS];
  private branches: Branch[] = [...SEED_BRANCHES];
  private users: AppUser[] = [...SEED_USERS];
  private auditLogs: AuditLog[] = [...SEED_AUDIT];
  private assignments: AssignedPlan[] = [];
  private trainerSavedPlans: TrainerSavedPlan[] = [];
  private listeners: Set<() => void> = new Set();

  // Default session maps each role to seed data so it works out of the box
  private session: SessionContext = {
    role: "super_admin",
    name: "Super Admin",
  };

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // ── SESSION ───────────────────────────────────────────────────────────────

  getSession(): SessionContext {
    return this.session;
  }

  /**
   * Called from page.tsx whenever the role switcher or PersonaPickerModal changes.
   * Auto-resolves or explicitly targets chain/branch/trainer IDs from the store
   * so multi-tenant hierarchy supports multiple gym chains, branch managers, trainers, and trainees cleanly.
   */
  setSession(role: RoleType, targetEntityId?: string) {
    switch (role) {
      case "super_admin":
        this.session = { role, name: "Super Admin" };
        break;
      case "chain_owner": {
        let chain: GymChain | undefined;
        let ownerUser: AppUser | undefined;

        if (targetEntityId) {
          chain = this.chains.find((c) => c.id === targetEntityId);
          if (!chain) {
            ownerUser = this.users.find((u) => u.id === targetEntityId);
            if (ownerUser) chain = this.chains.find((c) => c.id === ownerUser?.organizationId);
          } else {
            ownerUser = this.users.find((u) => u.organizationId === chain?.id && u.role === "chain_owner");
          }
        }

        if (!chain) {
          ownerUser = this.users.find((u) => u.role === "chain_owner");
          chain = ownerUser
            ? this.chains.find((c) => c.id === ownerUser?.organizationId)
            : this.chains[0];
        }

        this.session = {
          role,
          userId: ownerUser?.id,
          chainId: chain?.id,
          name: chain?.ownerName || "Chain Owner",
        };
        break;
      }
      case "chain_manager": {
        const mgr = targetEntityId
          ? this.users.find((u) => u.id === targetEntityId)
          : this.users.find((u) => u.role === "chain_manager");
        this.session = {
          role,
          userId: mgr?.id,
          chainId: mgr?.organizationId,
          branchId: mgr?.branchId,
          name: mgr?.name || "Chain Manager",
        };
        break;
      }
      case "branch_manager": {
        const bm = targetEntityId
          ? this.users.find((u) => u.id === targetEntityId)
          : this.users.find((u) => u.role === "branch_manager" && u.status === "active") || this.users.find((u) => u.role === "branch_manager");
        this.session = {
          role,
          userId: bm?.id,
          chainId: bm?.organizationId,
          branchId: bm?.branchId,
          name: bm?.name || "Branch Manager",
        };
        break;
      }
      case "trainer": {
        const tr = targetEntityId
          ? this.users.find((u) => u.id === targetEntityId)
          : this.users.find((u) => u.role === "trainer" && u.status === "active") || this.users.find((u) => u.role === "trainer");
        this.session = {
          role,
          userId: tr?.id,
          trainerId: tr?.id,
          branchId: tr?.branchId,
          chainId: tr?.organizationId,
          name: tr?.name || "Trainer",
        };
        break;
      }
      case "independent_trainer": {
        const it = targetEntityId
          ? this.users.find((u) => u.id === targetEntityId)
          : this.users.find((u) => u.role === "independent_trainer");
        this.session = {
          role,
          userId: it?.id,
          trainerId: it?.id,
          name: it?.name || "Independent Trainer",
        };
        break;
      }
      case "trainee": {
        const tn = targetEntityId
          ? this.users.find((u) => u.id === targetEntityId)
          : this.users.find((u) => u.role === "trainee" && u.status === "active") || this.users.find((u) => u.role === "trainee");
        this.session = {
          role,
          userId: tn?.id,
          trainerId: tn?.trainerId,
          branchId: tn?.branchId,
          name: tn?.name || "Trainee",
        };
        break;
      }
    }
    this.notify();
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

  /** Super Admin: Onboard a new gym chain + auto-creates chain_owner user */
  onboardGymChain(data: {
    name: string;
    ownerName: string;
    ownerEmail: string;
    tier: GymChain["tier"];
    city: string;
    country: string;
  }): GymChain {
    const chainId = this.uid("chain");
    const chain: GymChain = {
      id: chainId,
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

    // Auto-create the chain_owner user so ChainOwnerView has real linked data
    const ownerUser: AppUser = {
      id: this.uid("user_co"),
      name: data.ownerName,
      email: data.ownerEmail,
      role: "chain_owner",
      status: "invited",
      organizationId: chainId,
      joinedAt: new Date().toISOString().split("T")[0],
    };
    this.users.push(ownerUser);

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

  // ── ASSIGNMENTS ───────────────────────────────────────────────────────────
  // Trainer → Trainee plan assignments. The core data bridge.

  /**
   * Assign a workout, diet, or schedule plan to a specific trainee.
   * Called from TrainerView / IndependentTrainerView when trainer hits "Assign".
   */
  assignPlan(data: {
    trainerId: string;
    traineeId: string;
    type: AssignedPlan["type"];
    title: string;
    summary: string;
    content?: any;
  }): AssignedPlan {
    // Remove any existing assignment of the same type for this trainee from this trainer
    // (only one workout plan, one diet plan, one schedule per trainee-trainer pair)
    this.assignments = this.assignments.filter(
      (a) => !(a.trainerId === data.trainerId && a.traineeId === data.traineeId && a.type === data.type)
    );
    const assignment: AssignedPlan = {
      id: this.uid("assign"),
      ...data,
      assignedAt: new Date().toISOString(),
    };
    this.assignments.unshift(assignment);
    this.addAudit(
      `${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Plan Assigned`,
      "trainer",
      this.getUserById(data.trainerId)?.name || "Trainer",
      this.getUserById(data.traineeId)?.name || "Trainee"
    );
    this.notify();
    return assignment;
  }

  /** All plans assigned to a specific trainee (read by TraineeView) */
  getAssignmentsForTrainee(traineeId: string): AssignedPlan[] {
    return this.assignments.filter((a) => a.traineeId === traineeId);
  }

  /** All assignments made by a specific trainer (read by TrainerView calendar/roster) */
  getAssignmentsByTrainer(trainerId: string): AssignedPlan[] {
    return this.assignments.filter((a) => a.trainerId === trainerId);
  }

  /** Remove a specific assignment */
  removeAssignment(assignmentId: string) {
    this.assignments = this.assignments.filter((a) => a.id !== assignmentId);
    this.notify();
  }

  // ─── TRAINER SAVED PLANS (LIBRARY) ────────────────────────────────────────────────

  getTrainerSavedPlans(trainerId: string) {
    return this.trainerSavedPlans.filter((p) => p.trainerId === trainerId);
  }

  saveTrainerPlan(plan: Omit<TrainerSavedPlan, "id" | "createdAt">) {
    const newPlan: TrainerSavedPlan = {
      ...plan,
      id: `saved_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    this.trainerSavedPlans.push(newPlan);
    this.notify();
    return newPlan;
  }

  removeTrainerSavedPlan(planId: string) {
    this.trainerSavedPlans = this.trainerSavedPlans.filter((p) => p.id !== planId);
    this.notify();
  }
}

// Singleton export
export const store = new OrgStore();
