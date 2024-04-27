import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiInstance } from "@/src//lib/utils/api";
import type { ApiResponseType } from "@/src/lib/types";

type RenewUserApiResponseType = {
    result: { userId: number };
} & ApiResponseType;

export const renewUser = async (id: number) => {
    return (await apiInstance
        .put(`/users/${id}/renew`)
        .then((res) => res.data)) as RenewUserApiResponseType;
};

const useRenewUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: number }) => renewUser(id),
        mutationKey: ["users", { type: "renew" }],
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export default useRenewUser;
