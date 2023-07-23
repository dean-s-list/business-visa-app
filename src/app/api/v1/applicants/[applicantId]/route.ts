import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
    BUSINESS_VISA_APPLICANTS_BASE_ID,
    BUSINESS_VISA_APPLICANTS_PROJECT_ID,
} from "@/src/constants/AIRTABLE";
import USER_ROLES from "@/src/constants/USER_ROLES";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import airtable from "@/src/lib/utils/airtable";
import {
    handleApiAuthError,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";
import { updateApplicantValidator } from "@/src/lib/validators/applicants";

export async function PUT(
    req: NextRequest,
    { params }: { params: { applicantId: string } }
) {
    try {
        const { applicantId } = params;

        if (!applicantId) {
            return handleApiClientError();
        }

        const user = await getAuthorizedUser();

        if (!user) {
            return handleApiAuthError();
        }

        if (user.role !== USER_ROLES.ADMIN) {
            return handleApiAuthError();
        }

        const bodyValidationResult = updateApplicantValidator.safeParse(
            await req.json()
        );

        if (!bodyValidationResult.success) {
            return handleApiClientError();
        }

        const { status } = bodyValidationResult.data;

        const data = await airtable
            .base(BUSINESS_VISA_APPLICANTS_BASE_ID)
            .table(BUSINESS_VISA_APPLICANTS_PROJECT_ID)
            .update(applicantId, { status });

        return NextResponse.json(
            successHandler(data.id, "Applicant updated successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
