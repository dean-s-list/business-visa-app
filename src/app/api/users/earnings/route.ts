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
import { updateEarningsValidator } from "@/src/lib/validators/earnings";
import axios from "axios";

export async function POST(req: NextRequest) {
    try {
        const user = await getAuthorizedUser();

        if (!user) {
            return handleApiAuthError();
        }

        if (user.role !== USER_ROLES.ADMIN) {
            return handleApiAuthError();
        }

        const bodyValidationResult = updateEarningsValidator.safeParse(
            await req.json()
        );

        if (!bodyValidationResult.success) {
            return handleApiClientError();
        }

        const { wallets } = bodyValidationResult.data;

        const response = await axios.post(
            `${env.BACKEND_API_SERVER_URL}/users/earnings`,
            {
                secret: env.APP_SECRET,
                wallets,
            },
            {
                validateStatus: () => true,
            }
        );

        if (!response.data || !response.data.success) {
            throw new Error(
                response?.data?.message || "Failed to update user earnings!"
            );
        }

        return NextResponse.json(
            successHandler(wallets, "User earnings updated successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
