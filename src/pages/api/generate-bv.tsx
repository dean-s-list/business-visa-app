/* eslint-disable react/no-unknown-property */

import { ImageResponse } from "@vercel/og";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = {
    runtime: "edge",
};

const fontNormal = fetch(
    new URL("../../assets/PlusJakartaSans-Regular.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
    try {
        const normalFontData = await fontNormal;

        const name = req.nextUrl.searchParams.get("name");
        const status = req.nextUrl.searchParams.get("status");
        const earnings = req.nextUrl.searchParams.get("earnings");

        if (!name || !status || !earnings) {
            throw new Error("Missing required query params");
        }

        const secret = req.nextUrl.searchParams.get("secret");

        if (secret !== process.env.APP_SECRET) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        return new ImageResponse(
            (
                <div
                    style={{
                        height: "512px",
                        width: "512px",
                        display: "flex",
                        fontFamily: `"Plus Jakarta Sans"`,
                        backgroundImage: `url("https://i.imgur.com/dTPX7au.png")`,
                        backgroundPosition: "center",
                        backgroundSize: "contain",
                        position: "relative",
                    }}
                >
                    <p tw="absolute text-sm top-[265px] left-[222px]">{name}</p>
                    <p tw="absolute text-sm top-[323px] left-[222px]">
                        {status}
                    </p>
                    <p tw="absolute text-sm top-[380px] left-[222px]">
                        {earnings}
                    </p>
                </div>
            ),
            {
                width: 512,
                height: 512,
                fonts: [
                    {
                        name: "Plus Jakarta Sans",
                        data: normalFontData,
                        weight: 400,
                    },
                ],
            }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Something went wrong", error },
            { status: 500 }
        );
    }
}
