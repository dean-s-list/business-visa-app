import { useQuery } from "@tanstack/react-query";

import type { Applicant } from "../lib/types/applicant";
import type { ApiResponseType } from "@/src/lib/types";
import { apiInstance } from "@/src/lib/utils/api";

type ApplicantsApiResponseType = {
    result: Applicant[];
} & ApiResponseType;

const fetchData = async () => {
    const response = (await apiInstance
        .get("/applicants")
        .then((res) => res.data)) as ApplicantsApiResponseType;

    if (!response.success) {
        throw new Error(response.message);
    }

    return response.result;
};

const useApplicants = () => {
    return useQuery({
        queryKey: ["applicants"],
        queryFn: () => fetchData(),
        staleTime: 1000 * 10,
    });
};

export default useApplicants;
