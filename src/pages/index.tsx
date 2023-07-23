import {
    Box,
    Button,
    HStack,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure,
} from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";

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

const applicantsTableColumns = [
    { name: "ID", isNumeric: false },
    { name: "Name" },
    { name: "Email" },
    { name: "Solana Wallet Address" },
    { name: "Discord Id" },
    { name: "How you discovered?" },
    { name: "Country" },
    { name: "Projects" },
    { name: "One Expectation" },
    { name: "Skills" },
    { name: "Other Expectations" },
    { name: "Status" },
    { name: "Actions" },
];

const RenderHomePage = () => {
    const { isLoading, isFetching, data, isError, refetch } = useApplicants();

    const { mutateAsync } = useUpdateApplicant();

    const acceptAlert = useDisclosure();
    const rejectAlert = useDisclosure();

    const [isAccepting, setIsAccepting] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const [isRejecting, setIsRejecting] = useState<{
        [applicantId: string]: boolean;
    }>({});

    const acceptHandler = async (applicantId: string) => {
        setIsAccepting((prevState) => ({ ...prevState, [applicantId]: true }));
        const toastId = "accept-applicant";

        showLoadingToast({
            id: toastId,
            message: "Accepting applicant",
        });

        try {
            const response = await mutateAsync({
                id: applicantId,
                data: { status: "accepted" },
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

    const rejectHandler = async (applicantId: string) => {
        setIsRejecting((prevState) => ({ ...prevState, [applicantId]: true }));
        const toastId = "reject-applicant";

        showLoadingToast({
            id: toastId,
            message: "Rejecting applicant",
        });

        try {
            const response = await mutateAsync({
                id: applicantId,
                data: { status: "rejected" },
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
        <TableContainer>
            <Table colorScheme="purple">
                <Thead>
                    <Tr>
                        {applicantsTableColumns.map((col) => {
                            return (
                                <Th
                                    color="purple.400"
                                    key={col.name}
                                    isNumeric={col?.isNumeric}
                                >
                                    {col.name}
                                </Th>
                            );
                        })}
                    </Tr>
                </Thead>
                <Tbody>
                    {data?.map((applicant) => {
                        const isAccepted = applicant.status === "accepted";
                        const isRejected = applicant.status === "rejected";

                        let statusColor = "yellow.500";

                        if (isAccepted) {
                            statusColor = "green.500";
                        }

                        if (isRejected) {
                            statusColor = "red.500";
                        }

                        return (
                            <Tr key={applicant.id} color={statusColor}>
                                <Td>{applicant.id}</Td>
                                <Td>{applicant.name}</Td>
                                <Td>{applicant.email}</Td>
                                <Td>{applicant.solana_wallet_address}</Td>
                                <Td>{applicant.discord_id}</Td>
                                <Td>{applicant.discover}</Td>
                                <Td>{applicant.country}</Td>
                                <Td>{applicant.projects}</Td>
                                <Td>{applicant.expectations}</Td>
                                <Td>
                                    {applicant.skills
                                        ?.join(", ")
                                        .replace(/,$/, "")}
                                </Td>
                                <Td>{applicant.expectations_text}</Td>
                                <Td>{applicant.status}</Td>

                                <Td>
                                    {applicant.status === "accepted" &&
                                        "Accepted"}
                                    {applicant.status === "rejected" &&
                                        "Rejected"}
                                    {applicant.status === "pending" && (
                                        <>
                                            <HStack spacing={3}>
                                                <Button
                                                    colorScheme="green"
                                                    onClick={() =>
                                                        acceptAlert.onOpen()
                                                    }
                                                    isLoading={
                                                        isAccepting[
                                                            applicant.recordId
                                                        ]
                                                    }
                                                    loadingText="Accepting"
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    colorScheme="red"
                                                    onClick={() =>
                                                        rejectAlert.onOpen()
                                                    }
                                                    isLoading={
                                                        isRejecting[
                                                            applicant.recordId
                                                        ]
                                                    }
                                                    loadingText="Rejecting"
                                                >
                                                    Reject
                                                </Button>
                                            </HStack>
                                            <CustomAlertDialog
                                                title="Accept Applicant"
                                                body={`Are you sure you want to accept ${applicant.name} into the Business Visa program?`}
                                                isOpen={acceptAlert.isOpen}
                                                onClose={acceptAlert.onClose}
                                                actionText="Accept"
                                                actionFn={() =>
                                                    acceptHandler(
                                                        applicant.recordId
                                                    )
                                                }
                                                type="success"
                                            />
                                            <CustomAlertDialog
                                                title="Reject Applicant"
                                                body={`Are you sure you want to reject ${applicant.name} for the Business Visa program?`}
                                                isOpen={rejectAlert.isOpen}
                                                onClose={rejectAlert.onClose}
                                                actionText="Reject"
                                                actionFn={() =>
                                                    rejectHandler(
                                                        applicant.recordId
                                                    )
                                                }
                                                type="danger"
                                            />
                                        </>
                                    )}
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
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
