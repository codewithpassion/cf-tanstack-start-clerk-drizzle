/// <reference types="../../workers/worker-configuration.d.ts" />

import { drizzle } from "drizzle-orm/d1";
import { schema } from "./index";

// Combine all schemas
const allSchemas = {
    ...schema,
};

// Enhanced drizzle instance with full schema for type safety
export function createDbWithSchema(d1: D1Database) {
    return drizzle(d1, { schema: allSchemas });
}

// Type for the database instance
export type Database = ReturnType<typeof createDbWithSchema>;
