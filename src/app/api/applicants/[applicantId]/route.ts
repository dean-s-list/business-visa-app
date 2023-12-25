import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEANSLIST_EMAIL } from "@/src/constants/EMAIL";
import USER_ROLES from "@/src/constants/USER_ROLES";
import VisaRejectedEmail from "@/src/emails/visa-rejected";
import env from "@/src/lib/env/index.mjs";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import {
    handleApiAuthError,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";
import resend from "@/src/lib/utils/resend";
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

        const { status, email } = bodyValidationResult.data;

        const response = await axios.put(
            `${env.BACKEND_API_SERVER_URL}/applicants`,
            {
                secret: env.APP_SECRET,
                applicantId,
                status,
            }
        );

        if (!response.data || !response.data.success) {
            throw new Error("Failed to accept or reject applicant!");
        }

        if (status === "rejected") {
            await resend.sendEmail({
                to: email,
                from: DEANSLIST_EMAIL,
                subject: "Your business visa application has been rejected.",
                react: VisaRejectedEmail(),
            });
        }

        return NextResponse.json(
            successHandler({ applicantId }, "Applicant updated successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
