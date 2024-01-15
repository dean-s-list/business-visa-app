import {
    Box,
    Button,
    Center,
    HStack,
    Input,
    Select,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import Head from "next/head";
import { useEffect, useState } from "react";

import CustomAlertDialog from "../components/common/CustomAlertDialog";
import {
    showErrorToast,
    showLoadingToast,
    showSuccessToast,
} from "../components/common/ToastNotification";
import useApplicants from "../hooks/useApplicants";
import useUpdateApplicant from "../hooks/useUpdateApplicant";
import { logError } from "../lib/utils/general";
import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import CustomContainer from "@/src/components/common/CustomContainer";
import PageDataLoading from "@/src/components/common/PageDataLoading";
import PageDataNotFound from "@/src/components/common/PageDataNotFound";
import PageError from "@/src/components/common/PageError";

const RenderHomePage = () => {
    const { isLoading, isFetching, data, isError, refetch } = useApplicants();

    const { mutateAsync } = useUpdateApplicant();

    const [isOpenAcceptAlert, setIsOpenAcceptAlert] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const [isOpenRejectAlert, setIsOpenRejectAlert] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const [isAccepting, setIsAccepting] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const [isRejecting, setIsRejecting] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const [selectedStatusFilter, setSelectedStatusFilter] = useState<
        "all" | "accepted" | "rejected" | "pending"
    >("all");

    const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">(
        "latest"
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [filteredData, setFilteredData] = useState(data);

    const openAcceptAlert = (id: number) => {
        setIsOpenAcceptAlert((prevState) => ({ ...prevState, [id]: true }));
    };

    const closeAcceptAlert = (id: number) => {
        setIsOpenAcceptAlert((prevState) => ({ ...prevState, [id]: false }));
    };

    const openRejectAlert = (id: number) => {
        setIsOpenRejectAlert((prevState) => ({ ...prevState, [id]: true }));
    };

    const closeRejectAlert = (id: number) => {
        setIsOpenRejectAlert((prevState) => ({ ...prevState, [id]: false }));
    };

    useEffect(() => {
        const fData = data?.filter((user) => {
            if (selectedStatusFilter === "all") {
                return true;
            }
            return user.status === selectedStatusFilter;
        });

        const sData = fData?.sort((a, b) => {
            if (selectedSort === "latest") {
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            }

            return (
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );
        });

        const searchData = sData?.filter((d) => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();

            if (d.name?.toLowerCase()?.includes(lowerCaseSearchTerm)) {
                return true;
            }

            if (d.email?.toLowerCase()?.includes(lowerCaseSearchTerm)) {
                return true;
            }

            if (d.walletAddress?.toLowerCase()?.includes(lowerCaseSearchTerm)) {
                return true;
            }

            // eslint-disable-next-line sonarjs/prefer-single-boolean-return
            if (d.discordId?.toLowerCase()?.includes(lowerCaseSearchTerm)) {
                return true;
            }

            return false;
        });

        setFilteredData(searchData);
    }, [data, selectedStatusFilter, selectedSort, searchTerm]); // eslint-disable-line

    const acceptHandler = async (applicantId: number, email: string) => {
        setIsAccepting((prevState) => ({ ...prevState, [applicantId]: true }));
        const toastId = "accept-applicant";

        showLoadingToast({
            id: toastId,
            message: "Accepting applicant",
        });

        try {
            const response = await mutateAsync({
                id: applicantId,
                data: { status: "accepted", email },
            });

            if (!response.success) {
                throw new Error(response.message);
            }

            showSuccessToast({
                id: toastId,
                message: "Applicant accepted successfully!",
            });
        } catch (error) {
            logError("Error while accepting applicant =>", error);
            showErrorToast({
                id: toastId,
                message: "Something went wrong while accepting applicant!",
            });
        }
        setIsAccepting((prevState) => ({ ...prevState, [applicantId]: false }));
    };

    const rejectHandler = async (applicantId: number, email: string) => {
        setIsRejecting((prevState) => ({ ...prevState, [applicantId]: true }));
        const toastId = "reject-applicant";

        showLoadingToast({
            id: toastId,
            message: "Rejecting applicant",
        });

        try {
            const response = await mutateAsync({
                id: applicantId,
                data: { status: "rejected", email },
            });

            if (!response.success) {
                throw new Error(response.message);
            }

            showSuccessToast({
                id: toastId,
                message: "Applicant rejected successfully!",
            });
        } catch (error) {
            logError("Error while rejecting applicant =>", error);
            showErrorToast({
                id: toastId,
                message: "Something went wrong while rejecting applicant!",
            });
        }
        setIsRejecting((prevState) => ({ ...prevState, [applicantId]: false }));
    };

    if (isLoading || isFetching) {
        return <PageDataLoading loadingText="Loading Applicants" />;
    }

    if (isError || !data) {
        return (
            <PageError
                message="Something went wrong while loading applicants!"
                showRetryButton
                retryFn={refetch}
            />
        );
    }

    if (data.length === 0) {
        return <PageDataNotFound message="No applicants found!" />;
    }

    return (
        <VStack alignItems="flex-start" w="100%" spacing={6}>
            <HStack w="100%" justifyContent="flex-end" spacing={6}>
                <VStack alignItems="flex-start" flexGrow={1}>
                    <Text fontWeight={600}>
                        Search (By name, wallet, email, discord)
                    </Text>
                    <Input
                        placeholder="Enter here"
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </VStack>
                <VStack alignItems="flex-start">
                    <Text fontWeight={600}>Filter by Status</Text>
                    <Select
                        defaultValue="all"
                        onChange={(e) => {
                            setSelectedStatusFilter(
                                e.target.value as
                                    | "all"
                                    | "pending"
                                    | "accepted"
                                    | "rejected"
                            );
                        }}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                    </Select>
                </VStack>
                <VStack alignItems="flex-start">
                    <Text fontWeight={600}>Sort By Time</Text>
                    <Select
                        defaultValue="latest"
                        onChange={(e) => {
                            setSelectedSort(
                                e.target.value as "latest" | "oldest"
                            );
                        }}
                    >
                        <option value="latest">Latest</option>
                        <option value="oldest">Oldest</option>
                    </Select>
                </VStack>
            </HStack>

            <HStack w="100%" justifyContent="flex-start" spacing={6}>
                <VStack alignItems="flex-start">
                    <Text fontWeight={600}>Total Applicants</Text>
                    <Text color="purple.400">{data?.length}</Text>
                </VStack>
                <VStack alignItems="flex-start">
                    <Text fontWeight={600}>Filtered Applicants</Text>
                    <Text color="purple.400">{filteredData?.length}</Text>
                </VStack>
            </HStack>

            {filteredData?.length === 0 && (
                <Center w="100%">
                    <PageDataNotFound message="No data found for this filter!" />
                </Center>
            )}
            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
                {filteredData?.map((applicant) => {
                    let statusColor;

                    if (applicant.status === "accepted") {
                        statusColor = "green.500";
                    }

                    if (applicant.status === "rejected") {
                        statusColor = "red.500";
                    }

                    if (applicant.status === "pending") {
                        statusColor = "yellow.500";
                    }
                    return (
                        <VStack
                            w="100%"
                            key={applicant.id}
                            border="2px"
                            borderColor="white"
                            borderRadius="10px"
                            p={4}
                            alignItems="flex-start"
                            spacing={6}
                            wordBreak="break-all"
                        >
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Applicant ID</Text>
                                <Text color="purple.400">{applicant.id}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Name</Text>
                                <Text color="purple.400">{applicant.name}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Wallet Address</Text>
                                <Text color="purple.400">
                                    {applicant.walletAddress}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Email</Text>
                                <Text color="purple.400">
                                    {applicant.email}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Discord Username</Text>
                                <Text color="purple.400">
                                    {applicant.discordId}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Q: How did you discover Dean&apos;s List?
                                </Text>
                                <Text color="purple.400">
                                    {applicant.discovery}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Country</Text>
                                <Text color="purple.400">
                                    {applicant.country}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Q: Do you have a project?
                                </Text>
                                <Text color="purple.400">
                                    {applicant.projectDetails || "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Q: What do you expect from/after your Visa?
                                </Text>
                                <Text color="purple.400">
                                    {applicant.expectation}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Skills</Text>
                                <Text color="purple.400">
                                    {applicant.skills?.join(", ") || "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Q: What do you expect from/after your Visa?
                                    (Elaborate Here as much as possible.)
                                </Text>
                                <Text color="purple.400">
                                    {applicant.expectationDetails}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Submission Date</Text>
                                <Text color="purple.400">
                                    {format(
                                        new Date(applicant.createdAt),
                                        "MMM dd, yyyy hh:mm a"
                                    )}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Update Date</Text>
                                <Text color="purple.400">
                                    {applicant.updatedAt
                                        ? format(
                                              new Date(applicant.updatedAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Application Status</Text>
                                <Text color={statusColor}>
                                    {applicant.status === "accepted" &&
                                        "Accepted"}
                                    {applicant.status === "rejected" &&
                                        "Rejected"}
                                    {applicant.status === "pending" &&
                                        "Pending"}
                                </Text>
                            </VStack>

                            {applicant.status === "pending" && (
                                <>
                                    <HStack
                                        w="100%"
                                        justifyContent="flex-start"
                                        spacing={4}
                                    >
                                        <Button
                                            colorScheme="green"
                                            onClick={() =>
                                                openAcceptAlert(applicant.id)
                                            }
                                            isLoading={
                                                isAccepting[applicant.id]
                                            }
                                            loadingText="Accepting"
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            colorScheme="red"
                                            onClick={() =>
                                                openRejectAlert(applicant.id)
                                            }
                                            isLoading={
                                                isRejecting[applicant.id]
                                            }
                                            loadingText="Rejecting"
                                        >
                                            Reject
                                        </Button>
                                    </HStack>

                                    <CustomAlertDialog
                                        title="Accept Applicant"
                                        body={`Are you sure you want to accept ${applicant.name} into the Business Visa program?`}
                                        isOpen={isOpenAcceptAlert[applicant.id]}
                                        onClose={() =>
                                            closeAcceptAlert(applicant.id)
                                        }
                                        actionText="Accept"
                                        actionFn={() =>
                                            acceptHandler(
                                                applicant.id,
                                                applicant.email
                                            )
                                        }
                                        type="success"
                                    />
                                    <CustomAlertDialog
                                        title="Reject Applicant"
                                        body={`Are you sure you want to reject ${applicant.name} for the Business Visa program?`}
                                        isOpen={isOpenRejectAlert[applicant.id]}
                                        onClose={() =>
                                            closeRejectAlert(applicant.id)
                                        }
                                        actionText="Reject"
                                        actionFn={() =>
                                            rejectHandler(
                                                applicant.id,
                                                applicant.email
                                            )
                                        }
                                        type="danger"
                                    />
                                </>
                            )}
                        </VStack>
                    );
                })}
            </SimpleGrid>
        </VStack>
    );
};

export default function HomePage() {
    return (
        <>
            <Head>
                <title>Home | Business Visa App</title>
            </Head>

            <ProtectedRoute>
                <CustomContainer>
                    <Box py={20}>
                        <RenderHomePage />
                    </Box>
                </CustomContainer>
            </ProtectedRoute>
        </>
    );
}
