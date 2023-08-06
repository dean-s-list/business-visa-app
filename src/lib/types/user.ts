export type User = {
    id: number;
    walletAddress: string;
    name: string | null;
    email: string;
    profileImage: string | null;
    discordId: string;
    country: string | null;
    nftType: "business" | "member";
    role: "master-admin" | "admin" | "client" | "user";
    nftId: number | null;
    nftIssuedAt: string | null;
    nftExpiresAt: string | null;
    nftStatus: "active" | "expired" | null;
    nftRenewedAt: string | null;
    createdAt: string;
    updatedAt: string | null;
};
