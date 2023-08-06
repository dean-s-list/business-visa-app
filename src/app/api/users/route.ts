import axios from "axios";
import { NextResponse } from "next/server";

import USER_ROLES from "@/src/constants/USER_ROLES";
import env from "@/src/lib/env/index.mjs";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import type { ApiResponseType } from "@/src/lib/types";
import type { User } from "@/src/lib/types/user";
import {
    handleApiAuthError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";

export async function GET() {
    try {
        const user = await getAuthorizedUser();

        if (!user) {
            return handleApiAuthError();
        }

        if (user.role !== USER_ROLES.ADMIN) {
            return handleApiAuthError();
        }

        const res = await axios.get(
            `${env.BACKEND_API_SERVER_URL}/users?secret=${env.APP_SECRET}`
        );

        const data = res.data as ApiResponseType & {
            result: User[];
        };

        if (!data.success) {
            throw new Error("Failed to fetch users from backend!");
        }

        const order = { "master-admin": 1, admin: 2, client: 3, user: 4 };

        const sortedUsers = data?.result?.sort(
            (a, b) => order[a.role] - order[b.role]
        );

        return NextResponse.json(
            successHandler(sortedUsers, "Users fetched successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
