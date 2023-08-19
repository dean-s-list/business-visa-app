import { z } from "zod";

export const emailValidator = z.object({
    to: z.string().email(),
    subject: z.string().nonempty(),
});

export type EmailBodyType = z.infer<typeof emailValidator>;

export const visaAcceptedEmailValidator = emailValidator.merge(
    z.object({
        businessVisaImage: z.string().url(),
        claimLink: z.string().url(),
    })
);

export type VisaAcceptedEmailBodyType = z.infer<
    typeof visaAcceptedEmailValidator
>;

export const visaExpiredEmailValidator = emailValidator.merge(
    z.object({
        paymentLink: z.string().url(),
    })
);

export type VisaExpiredEmailBodyType = z.infer<
    typeof visaAcceptedEmailValidator
>;
