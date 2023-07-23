import {
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
    SystemProgram,
    Transaction,
    clusterApiUrl,
} from "@solana/web3.js";

import env from "../env/index.mjs";

import { logError } from "./general";

export const getSolanaConnectionUrl = () => {
    if (env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta") {
        return (
            env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL ??
            clusterApiUrl("mainnet-beta")
        );
    }

    return env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL ?? clusterApiUrl("devnet");
};

export const getSolanaConnection = () => {
    const connectionUrl = getSolanaConnectionUrl();

    return new Connection(connectionUrl, "confirmed");
};

export const shortenWalletAddress = (address: string) => {
    try {
        return `${address.slice(0, 4)} + "..." + ${address.slice(-4)}`;
    } catch (error) {
        logError("shortenWalletAddress", error);
        return null;
    }
};

export const confirmTransaction = async (
    txSignature: string,
    connection: Connection
) => {
    const latestBlockHash = await connection.getLatestBlockhash();

    await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txSignature,
    });
};

export const prepareSolTransferTransaction = ({
    senderWallet,
    receiverWallet,
    amount,
}: {
    senderWallet: string;
    receiverWallet: string;
    amount: number;
}) => {
    try {
        const receiverPubKey = new PublicKey(receiverWallet);
        const senderPubKey = new PublicKey(senderWallet);

        return new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderPubKey,
                toPubkey: receiverPubKey,
                lamports: LAMPORTS_PER_SOL * amount,
            })
        );
    } catch (error) {
        logError("prepareSolTransferTransaction =>", error);
        return null;
    }
};
