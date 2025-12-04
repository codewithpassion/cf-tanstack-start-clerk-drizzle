import {
	type Permission,
	ROLE_HIERARCHY,
	ROLE_PERMISSIONS,
	type UserRole,
} from "./types";

/**
 * Clerk user type with public metadata
 */
export interface ClerkUser {
	id: string;
	publicMetadata?: {
		role?: string;
		permissions?: string[];
	};
}

/**
 * Check if a user has a specific permission
 * Works with Clerk user metadata
 */
export function hasPermission(
	user: { role?: string; permissions?: string[] } | null,
	permission: Permission,
): boolean {
	if (!user) return false;

	// Superadmin has all permissions
	if (user.role === "superadmin") return true;

	// Check explicit permissions in metadata
	if (user.permissions?.includes(permission)) return true;

	// Role-based permissions
	if (user.role) {
		const rolePermissions = ROLE_PERMISSIONS[user.role as UserRole] || [];
		return rolePermissions.includes(permission);
	}

	return false;
}

/**
 * Check if a user has a specific role or higher
 */
export function hasRole(
	user: { role?: string } | null,
	requiredRole: UserRole,
): boolean {
	if (!user || !user.role) {
		return false;
	}

	const userLevel = ROLE_HIERARCHY[user.role as UserRole] || 0;
	const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

	return userLevel >= requiredLevel;
}

/**
 * Check if a user is an admin (admin or superadmin)
 */
export function isAdmin(user: { role?: string } | null): boolean {
	return hasRole(user, "admin");
}

/**
 * Check if a user is a superadmin
 */
export function isSuperAdmin(user: { role?: string } | null): boolean {
	return hasRole(user, "superadmin");
}

/**
 * Check if a user can perform an action on a resource
 */
export function canPerformAction(
	user: { id: string; role?: string; permissions?: string[] } | null,
	permission: Permission,
	resourceUserId?: string,
): boolean {
	if (!user) return false;

	// Check if user has the required permission
	if (!hasPermission(user, permission)) return false;

	// If checking ownership, verify the user owns the resource
	if (resourceUserId && resourceUserId !== user.id) {
		// Only allow if user is admin or higher
		return isAdmin(user);
	}

	return true;
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(
	user: { role?: string; permissions?: string[] } | null,
): Permission[] {
	if (!user) return [];

	const rolePermissions = user.role
		? ROLE_PERMISSIONS[user.role as UserRole] || []
		: [];

	// Combine role permissions with explicit permissions
	const allPermissions = [
		...rolePermissions,
		...(user.permissions || []),
	] as Permission[];

	// Return unique permissions
	return [...new Set(allPermissions)];
}

/**
 * Check if a user can assign a specific role (SuperAdmin only)
 */
export function canAssignRole(
	assigner: { role?: string } | null,
	_targetRole: UserRole,
): boolean {
	if (!assigner) return false;

	// Only superadmins can assign roles
	if (!isSuperAdmin(assigner)) return false;

	// Superadmins can assign any role
	return true;
}

/**
 * Check if a user can modify another user's role (SuperAdmin only)
 */
export function canModifyUser(
	modifier: { id: string; role?: string } | null,
	target: { id: string; role?: string },
): boolean {
	if (!modifier) return false;

	// Users cannot modify themselves
	if (modifier.id === target.id) return false;

	// Only superadmins can modify user roles
	if (!isSuperAdmin(modifier)) return false;

	// Superadmins can modify anyone except other superadmins
	// (prevents accidental lockout)
	return target.role !== "superadmin";
}
