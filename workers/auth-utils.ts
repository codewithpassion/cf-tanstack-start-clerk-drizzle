import { createClerkClient } from "@clerk/backend";
import { getAuth } from "@hono/clerk-auth";
import type { Context } from "hono";
import { hasPermission, hasRole, isAdmin } from "./permissions";
import type { AppType, Permission, UserRole, AuthUser } from "./types";

export function getClerkClient(context: {
	cloudflare: { env: CloudflareBindings };
}) {
	return createClerkClient({
		secretKey: context.cloudflare.env.CLERK_SECRET_KEY,
	});
}
/**
 * Get authenticated user from Hono context
 */
export async function getAuthUser(
	c: Context<AppType>,
): Promise<AuthUser | null> {
	try {
		const auth = getAuth(c);
		const clerk = getClerkClient({ cloudflare: { env: c.env } });

		if (!auth?.userId) {
			return null;
		}

		// Fetch user from Clerk API
		const clerkUser = await clerk.users.getUser(auth.userId);

		const firstName = clerkUser.firstName || "";
		const lastName = clerkUser.lastName || "";
		const displayName = `${firstName} ${lastName}`.trim() || "User";

		return {
			email: clerkUser.emailAddresses[0]?.emailAddress || "",
			id: clerkUser.id,
			name: displayName,
			permissions: (clerkUser.publicMetadata?.permissions as string[]) || [],
			role: ((clerkUser.publicMetadata?.role as UserRole) ||
				"user") as UserRole,
		};
	} catch (error) {
		console.error("Error getting auth user:", error);
		return null;
	}
}

/**
 * Require authentication for a request
 */
export async function requireAuth(c: Context): Promise<AuthUser> {
	const user = await getAuthUser(c);
	if (!user) {
		throw new Error("Authentication required");
	}
	return user;
}

/**
 * Require specific permission for a request
 */
export async function requirePermission(
	c: Context,
	permission: Permission,
): Promise<AuthUser> {
	const user = await requireAuth(c);

	if (!hasPermission(user, permission)) {
		throw new Error(`Permission required: ${permission}`);
	}

	return user;
}

/**
 * Require specific role for a request
 */
export async function requireRole(
	c: Context,
	role: UserRole,
): Promise<AuthUser> {
	const user = await requireAuth(c);

	if (!hasRole(user, role)) {
		throw new Error(`Role required: ${role}`);
	}

	return user;
}

/**
 * Require admin access for a request
 */
export async function requireAdmin(c: Context): Promise<AuthUser> {
	const user = await requireAuth(c);

	if (!isAdmin(user)) {
		throw new Error("Admin access required");
	}

	return user;
}

/**
 * Check if user owns a resource or is admin
 */
export async function requireOwnershipOrAdmin(
	c: Context,
	resourceUserId: string,
): Promise<AuthUser> {
	const user = await requireAuth(c);

	if (user.id !== resourceUserId && !isAdmin(user)) {
		throw new Error("Access denied: insufficient permissions");
	}

	return user;
}
