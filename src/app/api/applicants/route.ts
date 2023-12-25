import axios from "axios";
import { NextResponse } from "next/server";

import USER_ROLES from "@/src/constants/USER_ROLES";
import env from "@/src/lib/env/index.mjs";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import type { ApiResponseType } from "@/src/lib/types";
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

        const response = await axios.get(
            `${env.BACKEND_API_SERVER_URL}/applicants`,
            {
                headers: { Authorization: env.APP_SECRET },
            }
        );

        const data = response.data as ApiResponseType;

        if (!data || !data.success) {
            throw new Error("No data found!");
        }

        return NextResponse.json(
            successHandler(data.result, "Applicants fetched successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
