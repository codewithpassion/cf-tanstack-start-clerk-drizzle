// import { relations } from "drizzle-orm";
import { index, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const demo = sqliteTable(
    "demo",
    {
        id: text("id").primaryKey(),
        description: text("description"),
    },
    (table) => ({
        demoIdx: index("demo_demo_idx").on(table.id),
    }),
);

// Relations
// export const competitionsRelations = relations(competitions, ({ many }) => ({
//     categories: many(categories),
//     photos: many(photos),
// }));
