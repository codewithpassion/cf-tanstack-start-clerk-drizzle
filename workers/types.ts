/// <reference path="./worker-configuration.d.ts" />
import { Database } from "@/database/db";
import type { DrizzleD1Database } from "drizzle-orm/d1";

declare global {
	interface CloudflareEnvironment extends CloudflareBindings { }
	interface CloudflareVariables extends DatabaseVariables {
	}
}

export type DatabaseVariables = {
	Database: Database;
};
export type DatabaseClient = DrizzleD1Database<Record<string, never>>;


export type AppType = {
	Bindings: CloudflareEnvironment;
	Variables: CloudflareVariables;
};


export type UserRole = "user" | "admin" | "superadmin";

// Clerk user interface (simplified)
// export interface User {
// 	id: string;
// 	firstName: string;
// 	lastName?: string | null;
// 	email: string;
// 	emailVerified: boolean;
// 	role: UserRole;
// 	createdAt: string;
// 	updatedAt: string;
// }

export interface AuthUser {
	id: string;
	name: string;
	email: string;
	permissions: string[];
	role: UserRole;
}

export interface Session {
	id: string;
	userId: string;
	expiresAt: string;
}

export interface AuthSession extends Session {
	user: AuthUser;
}

export type CloudflareBindings = globalThis.CloudflareBindings;


// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
	admin: 2,
	superadmin: 3,
	user: 1,
} as const;

// Permission definitions
export const PERMISSIONS = {
	// ASSIGN_ROLES: "assign_roles",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Role-permission mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
	admin: [
	],
	superadmin: [
	],
	user: [
	],
};
