import { NextResponse } from "next/server";

import {
    BUSINESS_VISA_APPLICANTS_BASE_ID,
    BUSINESS_VISA_APPLICANTS_PROJECT_ID,
} from "@/src/constants/AIRTABLE";
import USER_ROLES from "@/src/constants/USER_ROLES";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import type { Applicant } from "@/src/lib/types/applicant";
import airtable from "@/src/lib/utils/airtable";
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

        const data = await airtable
            .base(BUSINESS_VISA_APPLICANTS_BASE_ID)
            .table(BUSINESS_VISA_APPLICANTS_PROJECT_ID)
            .select()
            .all();

        if (!data) {
            throw new Error("No data found!");
        }

        let applicants: Applicant[] = [];

        data.forEach((row) => {
            applicants.push({ recordId: row.id, ...row.fields } as Applicant);
        });

        const order = { pending: 1, accepted: 2, rejected: 3 };

        applicants = applicants.sort(
            (a, b) => order[a.status] - order[b.status]
        );

        return NextResponse.json(
            successHandler(applicants, "Applicants fetched successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
