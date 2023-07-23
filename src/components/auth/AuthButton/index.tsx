"use client";

import { Button, HStack, Icon, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import base58 from "bs58";
import dynamic from "next/dynamic";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { LiaExchangeAltSolid } from "react-icons/lia";

import { logError } from "@/src/lib/utils/general";
import { createSolanaSignInMessage } from "@/src/lib/utils/web3auth";
import useUserStore from "@/src/store/useUserStore";

const WalletMultiButton = dynamic(
    () =>
        import("@solana/wallet-adapter-react-ui").then(
            (mod) => mod.WalletMultiButton
        ),
    { ssr: false }
);

function AuthButton() {
    const wallet = useWallet();

    const { status } = useSession();

    const { isSigningIn, setIsSigningIn } = useUserStore();

    const signInHandler = async () => {
        setIsSigningIn(true);
        try {
            const csrf = await getCsrfToken();

            if (!wallet.publicKey) {
                throw new Error("Wallet is not connected!");
            }

            if (!csrf) {
                throw new Error("CSRF token is not found!");
            }

            if (!wallet?.signMessage) {
                throw new Error("Wallet does not support signMessage!");
            }

            const message = createSolanaSignInMessage({
                domain: window.location.host,
                address: wallet.publicKey?.toString(),
                statement: "Sign this message to sign in to the app.",
                nonce: csrf,
                origin: window.location.origin,
            });

            const encodedMessage = new TextEncoder().encode(
                message?.prepareMessage()
            );
            const signature = await wallet.signMessage(encodedMessage);

            const serializedSignature = base58.encode(signature);

            await signIn("credentials", {
                message: JSON.stringify(message),
                redirect: false,
                signature: serializedSignature,
            });
        } catch (error) {
            logError({ message: "handlerSignIn =>", error });
        }
        setIsSigningIn(false);
    };

    const signOutHandler = async () => {
        try {
            await signOut({
                redirect: false,
            });
        } catch (error) {
            logError({ message: "signOutHandler =>", error });
        }
    };

    useEffect(() => {
        if (!wallet.connected && status === "authenticated") {
            signOutHandler();
        }
    }, [wallet.connected, status]);

    if (!wallet.connected) {
        return <WalletMultiButton />;
    }

    if (wallet.connected && status === "unauthenticated") {
        return (
            <HStack>
                <Button
                    width={130}
                    onClick={signInHandler}
                    isLoading={isSigningIn}
                    loadingText="Signing In"
                >
                    Sign In
                </Button>
                <Tooltip label="Change Wallet" isDisabled={isSigningIn}>
                    <Button
                        onClick={() => wallet.disconnect()}
                        isDisabled={isSigningIn}
                    >
                        <Icon as={LiaExchangeAltSolid} />
                    </Button>
                </Tooltip>
            </HStack>
        );
    }

    if (wallet.connected && status === "authenticated") {
        return <WalletMultiButton />;
    }
}

export default AuthButton;
