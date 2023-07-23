import "dotenv/config";

export default {
    schema: "./src/db/schema/index.ts",
    out: "./src/db/migrations",
    driver: "mysql2",
    dbCredentials: {
        connectionString: process.env.DB_URL,
    },
    breakpoints: true,
};
