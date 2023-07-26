import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
    server: {
        BACKEND_API_SERVER_URL: z.string().url(),

        // resend
        RESEND_API_KEY: z.string().nonempty(),

        // airtable
        AIRTABLE_TOKEN: z.string().nonempty(),

        // next-auth
        NEXTAUTH_URL: z.string().url(),
        NEXTAUTH_SECRET: z.string().nonempty(),

        // app
        APP_SECRET: z.string().nonempty(),

        // redis
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string().nonempty(),
    },
    client: {
        // solana
        NEXT_PUBLIC_SOLANA_NETWORK: z.union([
            z.literal("mainnet-beta"),
            z.literal("devnet"),
        ]),
        NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL: z.string().url().optional(),
        NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL: z.string().url().optional(),

        // app
        NEXT_PUBLIC_API_BASE_URL: z.string().url(),
    },
    runtimeEnv: {
        BACKEND_API_SERVER_URL: process.env.BACKEND_API_SERVER_URL,

        // resend
        RESEND_API_KEY: process.env.RESEND_API_KEY,

        // airtable
        AIRTABLE_TOKEN: process.env.AIRTABLE_TOKEN,

        // next-auth
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,

        //   solana
        NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK,
        NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL:
            process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL,
        NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL:
            process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL,

        // app
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        APP_SECRET: process.env.APP_SECRET,

        // redis
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
});

export default env;
