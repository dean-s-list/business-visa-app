import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiInstance } from "@/src//lib/utils/api";
import type { ApiResponseType } from "@/src/lib/types";

type ExpireUserApiResponseType = {
    result: { userId: number };
} & ApiResponseType;

export const expireUser = async (id: number) => {
    return (await apiInstance
        .put(`/users/${id}/expire`)
        .then((res) => res.data)) as ExpireUserApiResponseType;
};

const useExpireUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: { id: number }) => expireUser(id),
        mutationKey: ["users", { type: "expire" }],
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export default useExpireUser;
