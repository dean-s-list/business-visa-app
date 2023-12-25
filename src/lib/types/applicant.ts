export type Applicant = {
    id: number;
    name: string;
    email: string;
    walletAddress: string;
    discordId: string;
    discovery: string;
    country: string;
    projectDetails: string | null;
    expectation: string;
    skills: string[];
    expectationDetails: string;
    status: "pending" | "rejected" | "accepted";
    createdAt: string;
    updatedAt: string;
};
