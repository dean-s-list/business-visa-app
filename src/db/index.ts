import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";

import env from "@/src/lib/env/index.mjs";

// create the connection
const connection = connect({
    url: env.DB_URL,
});

const db = drizzle(connection);

export default db;
