import { z } from "zod";

export const updateEarningsValidator = z.object({
    wallets: z.array(
        z.object({
            wallet: z.string().min(1).max(44),
            earnings: z.number().min(0),
        })
    ),
});

export type UpdateEarningsType = z.infer<typeof updateEarningsValidator>;
