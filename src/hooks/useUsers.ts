import { useQuery } from "@tanstack/react-query";

import type { User } from "../lib/types/user";
import type { ApiResponseType } from "@/src/lib/types";
import { apiInstance } from "@/src/lib/utils/api";

type UsersApiResponseType = {
    result: User[];
} & ApiResponseType;

const fetchData = async () => {
    const response = (await apiInstance
        .get("/users")
        .then((res) => res.data)) as UsersApiResponseType;

    if (!response.success) {
        throw new Error(response.message);
    }

    return response.result;
};

const useUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: () => fetchData(),
        staleTime: 1000 * 60 * 10,
        refetchInterval: 1000 * 60 * 10,
    });
};

export default useUsers;
