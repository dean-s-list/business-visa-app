import axios from "axios";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
    BUSINESS_VISA_APPLICANTS_BASE_ID,
    BUSINESS_VISA_APPLICANTS_PROJECT_ID,
} from "@/src/constants/AIRTABLE";
import { DEANSLIST_EMAIL } from "@/src/constants/EMAIL";
import USER_ROLES from "@/src/constants/USER_ROLES";
import VisaRejectedEmail from "@/src/emails/visa-rejected";
import env from "@/src/lib/env/index.mjs";
import { getAuthorizedUser } from "@/src/lib/middlewares/getAuthorizedUser";
import type { Applicant } from "@/src/lib/types/applicant";
import airtable from "@/src/lib/utils/airtable";
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

        const { status } = bodyValidationResult.data;

        const data = await airtable
            .base(BUSINESS_VISA_APPLICANTS_BASE_ID)
            .table(BUSINESS_VISA_APPLICANTS_PROJECT_ID)
            .find(applicantId);

        if (!data) {
            throw new Error("Failed to find applicant from airtable!");
        }

        const applicantData = data.fields as Applicant;

        if (status === "accepted") {
            const response = await axios.post(
                `${env.BACKEND_API_SERVER_URL}/applicants`,
                {
                    secret: env.APP_SECRET,
                    applicant: {
                        walletAddress: applicantData.solana_wallet_address,
                        name: applicantData.name,
                        email: applicantData.email,
                        discordId: applicantData.discord_id,
                        country: applicantData.country,
                    },
                }
            );

            if (!response.data || !response.data.success) {
                throw new Error("Failed to accept applicant!");
            }
        } else {
            await resend.sendEmail({
                to: applicantData.email,
                from: DEANSLIST_EMAIL,
                subject: "Your business visa application has been rejected.",
                react: VisaRejectedEmail(),
            });
        }

        await airtable
            .base(BUSINESS_VISA_APPLICANTS_BASE_ID)
            .table(BUSINESS_VISA_APPLICANTS_PROJECT_ID)
            .update(applicantId, { status });

        return NextResponse.json(
            successHandler({ applicantId }, "Applicant updated successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
