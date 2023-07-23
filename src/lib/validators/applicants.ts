import { z } from "zod";

export const updateApplicantValidator = z.object({
    status: z.union([
        z.literal("accepted"),
        z.literal("rejected"),
        z.literal("pending"),
    ]),
});

export type UpdateApplicantType = z.infer<typeof updateApplicantValidator>;
