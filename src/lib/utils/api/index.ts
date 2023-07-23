import axios from "axios";
import { NextResponse } from "next/server";

import env from "@/src/lib/env/index.mjs";
import type { ApiResponseType } from "@/src/lib/types";

export const apiInstance = axios.create({
    baseURL: env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "App-Solana-Network": env.NEXT_PUBLIC_SOLANA_NETWORK,
    },
});

export const apiResponse = ({ success, message, result }: ApiResponseType) => {
    return {
        success,
        message,
        result,
    };
};

export const errorHandler = (error: unknown) => {
    const isErrorType = error instanceof Error;

    return apiResponse({
        success: false,
        message: isErrorType ? error?.message : "Something went wrong!",
        result: null,
    });
};

export const successHandler = (
    result: ApiResponseType["result"],
    message: string
) => {
    return apiResponse({
        success: true,
        message,
        result,
    });
};

export const handleDataNotFound = () => {
    return NextResponse.json(successHandler(null, "Data not found!"), {
        status: 404,
    });
};

export const handleApiRouteError = (error: unknown) => {
    return NextResponse.json(errorHandler(error), { status: 500 });
};

export const handleApiAuthError = () => {
    const error = new Error("Unauthorized Access!");
    return NextResponse.json(errorHandler(error), { status: 401 });
};

export const handleApiClientError = (message?: string) => {
    const error = new Error(message || "Wrong Parameters Provided!");
    return NextResponse.json(errorHandler(error), { status: 400 });
};
