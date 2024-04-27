import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import USER_ROLES from "@/src/constants/USER_ROLES";
import env from "@/src/lib/env/index.mjs";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import {
    handleApiAuthError,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";

export async function PUT(
    req: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        const { userId } = params;

        if (!userId) {
            return handleApiClientError();
        }

        const user = await getAuthorizedUser();

        if (!user) {
            return handleApiAuthError();
        }

        if (user.role !== USER_ROLES.ADMIN) {
            return handleApiAuthError();
        }

        const response = await axios.put(
            `${env.BACKEND_API_SERVER_URL}/users/renew`,
            {
                secret: env.APP_SECRET,
                userId: parseInt(userId, 10),
            },
            {
                validateStatus: () => true,
            }
        );

        if (!response.data || !response.data.success) {
            throw new Error(response?.data?.message || "Failed to renew user!");
        }

        return NextResponse.json(
            successHandler({ userId }, "User renewed successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
