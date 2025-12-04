import serverEntry from "@tanstack/react-start/server-entry"
import { Hono } from "hono";
import { getAuth } from "@hono/clerk-auth";
import { clerkMiddleware } from "@hono/clerk-auth";
import { D1DbMiddleware } from "./middleware";
import { AppType } from "./types";
import { demo } from "@/database/schema";


const app = new Hono<AppType>();

// Apply Clerk authentication middleware globally
app.use('*', clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
}))

app.use(D1DbMiddleware);

app.get("/api/health", (c) => {
    const auth = getAuth(c);
    return c.json({
        status: "ok",
        authenticated: !!auth?.userId,
        userId: auth?.userId || null
    });
});

app.get("/api/db-test", async (c) => {
    const db = c.var.Database;
    const result = await db.select().from(demo).all();
    return c.json({
        dbTest: result,
    });
});

app.use(async (c) => {
    return serverEntry.fetch(c.req.raw);
});


export default {
    fetch: app.fetch,
} satisfies ExportedHandler<globalThis.Cloudflare.Env>;
