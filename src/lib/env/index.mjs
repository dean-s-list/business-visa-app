import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const env = createEnv({
    server: {
        // planetscale
        DB_URL: z.string().nonempty(),

        // resend
        RESEND_API_KEY: z.string().nonempty(),

        // airtable
        AIRTABLE_TOKEN: z.string().nonempty(),

        // next-auth
        NEXTAUTH_URL: z.string().url(),
        NEXTAUTH_SECRET: z.string().nonempty(),

        // app
        APP_SECRET: z.string().nonempty(),

        // qstash
        QSTASH_URL: z.string().url(),
        QSTASH_TOKEN: z.string().nonempty(),
        QSTASH_CURRENT_SIGNING_KEY: z.string().nonempty(),
        QSTASH_NEXT_SIGNING_KEY: z.string().nonempty(),

        // redis
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string().nonempty(),

        // underdog
        UNDERDOG_API_KEY: z.string().nonempty(),
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
        // supabase
        DB_URL: process.env.DB_URL,

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

        // qstash
        QSTASH_URL: process.env.QSTASH_URL,
        QSTASH_TOKEN: process.env.QSTASH_TOKEN,
        QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY,
        QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY,

        // redis
        UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
        UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,

        // underdog
        UNDERDOG_API_KEY: process.env.UNDERDOG_API_KEY,
    },
});

export default env;
