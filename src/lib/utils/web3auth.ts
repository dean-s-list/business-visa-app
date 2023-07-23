import { Header, Payload, SIWS } from "@web3auth/sign-in-with-solana";

import { logError } from "./general";

export const createSolanaSignInMessage = ({
    address,
    statement,
    domain,
    origin,
    nonce,
}: {
    address: string;
    statement: string;
    domain: string;
    origin: string;
    nonce: string;
}) => {
    try {
        const header = new Header();
        header.t = "sip99";

        const payload = new Payload();
        payload.domain = domain;
        payload.address = address;
        payload.uri = origin;
        payload.statement = statement;
        payload.nonce = nonce;
        payload.issuedAt = new Date().toISOString();
        payload.version = "1";
        payload.chainId = 1;

        return new SIWS({
            header,
            payload,
        });
    } catch (error) {
        logError({ message: "createSolanaSignInMessage", error });
        return null;
    }
};

export const verifySignature = async ({
    message,
    signature,
}: {
    message: SIWS;
    signature: string;
}) => {
    try {
        const newMessage = new SIWS({
            header: message?.header,
            payload: message?.payload,
        });

        const result = await newMessage.verify({
            payload: message.payload,
            signature: { t: message.header.t, s: signature },
        });

        return result.success;
    } catch (error) {
        logError("verifySignature", error);
        return false;
    }
};
