import {
    mysqlTable,
    mysqlSchema,
    AnyMySqlColumn,
    unique,
    serial,
    varchar,
    text,
    mysqlEnum,
    int,
    timestamp,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable(
    "users",
    {
        id: serial("id").primaryKey().notNull(),
        walletAddress: varchar("walletAddress", { length: 50 }).notNull(),
        name: varchar("name", { length: 250 }),
        email: varchar("email", { length: 250 }).notNull(),
        profileImage: text("profileImage"),
        discordId: varchar("discordId", { length: 250 }).notNull(),
        country: varchar("country", { length: 100 }),
        nftType: mysqlEnum("nftType", ["business", "member"]).notNull(),
        role: mysqlEnum("role", [
            "master-admin",
            "admin",
            "client",
            "user",
        ]).default("user"),
        nftId: int("nftId"),
        nftExpiresAt: timestamp("nftExpiresAt", { mode: "string" }),
        createdAt: timestamp("createdAt", { mode: "string" }).defaultNow(),
        updatedAt: timestamp("updatedAt", { mode: "string" }).onUpdateNow(),
    },
    (table) => {
        return {
            addressIdx: unique("address_idx").on(table.walletAddress),
        };
    }
);
