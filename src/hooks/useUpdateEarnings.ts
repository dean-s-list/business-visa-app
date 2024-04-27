import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiInstance } from "@/src//lib/utils/api";
import type { ApiResponseType } from "@/src/lib/types";
import type { UpdateEarningsType } from "../lib/validators/earnings";

type UpdateEarningsApiResponseType = {
    result: {
        wallets: Array<{ wallet: string; earnings: number }>;
        failedUpdates: Array<{ wallet: string; earnings: number }>;
    };
} & ApiResponseType;

export const updateEarnings = async (data: UpdateEarningsType) => {
    return (await apiInstance
        .post(`/users/earnings`, data)
        .then((res) => res.data)) as UpdateEarningsApiResponseType;
};

const useUpdateEarnings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateEarningsType) => updateEarnings(data),
        mutationKey: ["earnings", { type: "update" }],
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
        },
    });
};

export default useUpdateEarnings;
