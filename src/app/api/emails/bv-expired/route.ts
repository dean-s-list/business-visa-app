import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { DEANSLIST_EMAIL } from "@/src/constants/EMAIL";
import VisaExpiredEmail from "@/src/emails/visa-expired";
import env from "@/src/lib/env/index.mjs";
import {
    handleApiAuthError,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";
import resend from "@/src/lib/utils/resend";
import { visaExpiredEmailValidator } from "@/src/lib/validators/emails";

export async function POST(req: NextRequest) {
    try {
        const bodyValidationResult = visaExpiredEmailValidator.safeParse(
            await req.json()
        );

        if (!bodyValidationResult.success) {
            return handleApiClientError();
        }

        const secret = req.headers.get("Authorization");

        if (secret !== env.APP_SECRET) {
            return handleApiAuthError();
        }

        const { to, subject, paymentLink } = bodyValidationResult.data;

        const { id } = await resend.sendEmail({
            from: DEANSLIST_EMAIL,
            to,
            subject,
            react: VisaExpiredEmail({ paymentLink }),
        });

        return NextResponse.json(
            successHandler(id, "Email sent successfully!")
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
