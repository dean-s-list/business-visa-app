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
    },
});

export default env;
