import { gte } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import db from "@/src/db";
import { usersTable } from "@/src/db/schema";
import env from "@/src/lib/env/index.mjs";
import {
    handleApiAuthError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";

export async function POST(req: NextRequest) {
    try {
        const { secret } = await req.json();

        if (!secret || secret !== env.APP_SECRET) {
            return handleApiAuthError();
        }

        const data = await db
            .select()
            .from(usersTable)
            .where(gte(usersTable.nftExpiresAt, new Date()));

        if (!data) {
            throw new Error("No data found!");
        }

        return NextResponse.json(
            successHandler(
                data,
                "Expired business visa nfts fetched successfully!"
            )
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
