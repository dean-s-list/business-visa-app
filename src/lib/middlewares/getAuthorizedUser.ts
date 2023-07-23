import { getServerSession } from "next-auth";

import authOptions from "../utils/auth";
import { logError } from "../utils/general";

export const getAuthorizedUser = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return null;
        }

        return session.user;
    } catch (error) {
        logError({ message: "getAuthorizedUser", error });
        return null;
    }
};
