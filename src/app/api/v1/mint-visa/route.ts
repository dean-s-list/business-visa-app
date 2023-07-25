import addDays from "date-fns/addDays";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

import { DEANSLIST_EMAIL } from "@/src/constants/EMAIL";
import { UNDERDOG_BUSINESS_VISA_PROJECT_ID } from "@/src/constants/UNDERDOG";
import VISA_STATUS from "@/src/constants/VISA_STATUS";
import db from "@/src/db";
import { acceptedApplicantsTable } from "@/src/db/schema";
import env from "@/src/lib/env/index.mjs";
import {
    handleApiAuthError,
    handleApiClientError,
    handleApiRouteError,
    successHandler,
} from "@/src/lib/utils/api";
import resend from "@/src/lib/utils/resend";
import underdogApiInstance from "@/src/lib/utils/underdog";

const bodyValidator = z.object({
    secret: z.string(),
    applicantId: z.string().transform((value) => parseInt(value, 10)),
});

export async function POST(req: NextRequest) {
    try {
        const bodyValidationResult = bodyValidator.safeParse(await req.json());

        if (!bodyValidationResult.success) {
            return handleApiClientError();
        }

        const { secret, applicantId } = bodyValidationResult.data;

        if (!secret || secret !== env.APP_SECRET) {
            return handleApiAuthError();
        }

        const applicantData = await db
            .select()
            .from(acceptedApplicantsTable)
            .where(eq(acceptedApplicantsTable.id, applicantId));

        const applicant = applicantData[0];

        if (!applicantData || !applicant) {
            throw new Error("No usersData found!");
        }

        if (applicant.nftId) {
            throw new Error("User already has a nft!");
        }

        const issueDate = new Date();

        const expireDate = addDays(issueDate, 30);

        const limit = 1;

        const nftsResponse = await underdogApiInstance.get(
            `/v2/projects/n/${UNDERDOG_BUSINESS_VISA_PROJECT_ID}/nfts?limit=${limit}`
        );

        if (!nftsResponse.data) {
            throw new Error("Error fetching nfts from underdog api!");
        }

        const nftMintedCount: number | null = nftsResponse.data?.totalPages;

        if (!nftMintedCount) {
            throw new Error("Error fetching nfts minted count!");
        }

        const newNftIssueNumber = nftMintedCount + 1;

        const nftMetadata = {
            name: `The Dean's List Business Visa #${newNftIssueNumber}`,
            description:
                "Keep this active to gain access to USDC earning opportunities.",
            symbol: "DLBV",
            image: "https://dev.updg8.com/imgdata/9HdPsLjMBUW8fQTp314kg4LoiqGxQqvCxKk6uhHttjVp",
            attributes: {
                status: VISA_STATUS.ACTIVE,
                issuedAt: issueDate.getTime().toString(),
                expiresAt: expireDate.getTime().toString(),
            },
            receiverAddress: applicant.walletAddress,
        };

        const nftMintResponse = await underdogApiInstance.post(
            `/v2/projects/n/${UNDERDOG_BUSINESS_VISA_PROJECT_ID}/nfts`,
            nftMetadata
        );

        if (!nftMintResponse.data?.id || !nftMintResponse.data?.mintAddress) {
            throw new Error("Error minting nft!");
        }

        const underdogClaimLink = `https://claim.underdogprotocol.com/nfts/${
            nftMintResponse.data.mintAddress
        }?network=${
            env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
                ? "MAINNET_BETA"
                : "DEVNET"
        }`;

        await db.update(acceptedApplicantsTable).set({
            nftId: nftMintResponse.data.id,
            nftIssuedAt: issueDate,
            nftExpiresAt: expireDate,
            hasClaimed: false,
            nftClaimLink: underdogClaimLink,
            nftMintAddress: nftMintResponse.data.mintAddress,
        });

        await resend.sendEmail({
            to: applicant.email,
            from: DEANSLIST_EMAIL,
            subject: "Your Business Visa is ready!",
            text: `Your Business Visa is ready! Claim it here: ${underdogClaimLink}`,
        });

        return NextResponse.json(
            successHandler(
                { nftMintAddress: nftMintResponse.data.mintAddress },
                "Visa minted successfully!"
            )
        );
    } catch (error) {
        return handleApiRouteError(error);
    }
}
