import { createMiddleware } from "hono/factory";
import type { AppType } from "./types";
import { createDbWithSchema } from "@/database/db";

const D1DbMiddleware = createMiddleware<AppType>(async (c, next) => {
    const db = createDbWithSchema(c.env.DB);
    
    c.set("Database", db);
    await next();
});

export { D1DbMiddleware };