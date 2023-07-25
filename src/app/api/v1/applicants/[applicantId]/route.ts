import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
    BUSINESS_VISA_APPLICANTS_BASE_ID,
    BUSINESS_VISA_APPLICANTS_PROJECT_ID,
} from "@/src/constants/AIRTABLE";
import { DEANSLIST_EMAIL } from "@/src/constants/EMAIL";
import USER_ROLES from "@/src/constants/USER_ROLES";
import db from "@/src/db";
import { acceptedApplicantsTable } from "@/src/db/schema";
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
import qstashClient from "@/src/lib/utils/qstash";
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
            const dbRes = await db.insert(acceptedApplicantsTable).values({
                walletAddress: applicantData.solana_wallet_address,
                name: applicantData.name,
                email: applicantData.email,
                discordId: applicantData.discord_id,
                country: applicantData.country,
            });

            const qstashRes = await qstashClient.publishJSON({
                // url: `${env.NEXT_PUBLIC_API_BASE_URL}/mint-visa`,
                url: `https://44c2-2409-40d2-101a-9052-5d65-32c6-38f2-1d2d.ngrok-free.app/api/v1/mint-visa`,
                body: {
                    secret: env.APP_SECRET,
                    applicantId: dbRes.insertId,
                },
            });

            if (!qstashRes?.messageId) {
                await db
                    .delete(acceptedApplicantsTable)
                    .where(
                        eq(
                            acceptedApplicantsTable.walletAddress,
                            applicantData.solana_wallet_address
                        )
                    );

                throw new Error("Failed to publish to qstash!");
            }
        } else {
            await resend.sendEmail({
                to: applicantData.email,
                from: DEANSLIST_EMAIL,
                subject: "Your Business Visa is rejected!",
                text: `Your Business Visa application is rejected!`,
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
