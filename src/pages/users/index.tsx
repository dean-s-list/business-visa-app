/* eslint-disable sonarjs/no-duplicate-string */
import {
    Box,
    Button,
    Center,
    Flex,
    HStack,
    Input,
    Select,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import format from "date-fns/format";
import Head from "next/head";
import { useEffect, useState } from "react";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import CustomContainer from "@/src/components/common/CustomContainer";
import PageDataLoading from "@/src/components/common/PageDataLoading";
import PageDataNotFound from "@/src/components/common/PageDataNotFound";
import PageError from "@/src/components/common/PageError";
import {
    showErrorToast,
    showLoadingToast,
    showSuccessToast,
} from "@/src/components/common/ToastNotification";
import useExpireUser from "@/src/hooks/useExpireUser";
import useRenewUser from "@/src/hooks/useRenewUser";
import useUsers from "@/src/hooks/useUsers";
import { logError } from "@/src/lib/utils/general";
import Link from "next/link";

export const DEFAULT_DATE_FORMAT = "dd MMMM yyyy hh:mm a";

const RenderUsersPage = () => {
    const { isLoading, isFetching, data, isError, refetch } = useUsers();

    const [selectedStatusFilter, setSelectedStatusFilter] = useState<
        "all" | "active" | "expired"
    >("all");
    const [selectedSort, setSelectedSort] = useState<"latest" | "oldest">(
        "latest"
    );
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [filteredData, setFilteredData] = useState(data);

    const renewUserMutation = useRenewUser();
    const expireUserMutation = useExpireUser();

    async function renewUserHandler(userId: number) {
        const toastId = "renew-user-toast";

        showLoadingToast({
            id: toastId,
            message: "Renewing user",
        });

        try {
            const response = await renewUserMutation.mutateAsync({
                id: userId,
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to renew user!");
            }

            showSuccessToast({
                id: toastId,
                message: "User renewed successfully!",
            });
        } catch (error) {
            logError("renewUserHandler =>", error);
            showErrorToast({
                id: toastId,
                message: "Failed to renew user",
            });
        }
    }

    async function expireUserHandler(userId: number) {
        const toastId = "expire-user-toast";

        showLoadingToast({
            id: toastId,
            message: "Expiring user",
        });

        try {
            const response = await expireUserMutation.mutateAsync({
                id: userId,
            });

            if (!response.success) {
                throw new Error(response.message || "Failed to expire user!");
            }

            showSuccessToast({
                id: toastId,
                message: "User expired successfully!",
            });
        } catch (error) {
            logError("expireUserHandler =>", error);
            showErrorToast({
                id: toastId,
                message: "Failed to expire user",
            });
        }
    }

    useEffect(() => {
        const fData = data?.filter((user) => {
            if (selectedStatusFilter === "all") {
                return true;
            }
            return user.nftStatus === selectedStatusFilter;
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

    if (isLoading || isFetching) {
        return <PageDataLoading loadingText="Loading Users" />;
    }

    if (isError || !data) {
        return (
            <PageError
                message="Something went wrong while loading users!"
                showRetryButton
                retryFn={refetch}
            />
        );
    }

    if (data?.length === 0) {
        return <PageDataNotFound message="No users found!" />;
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
                                e.target.value as "all" | "active" | "expired"
                            );
                        }}
                    >
                        <option value="all">All</option>
                        <option value="active">Active</option>
                        <option value="expired">Expired</option>
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
                    <Text fontWeight={600}>Total Users</Text>
                    <Text color="purple.400">{data?.length}</Text>
                </VStack>
                <VStack alignItems="flex-start">
                    <Text fontWeight={600}>Filtered Users</Text>
                    <Text color="purple.400">{filteredData?.length}</Text>
                </VStack>
                <Button as={Link} href="/earnings">
                    Update Earnings
                </Button>
            </HStack>

            {filteredData?.length === 0 && (
                <Center w="100%">
                    <PageDataNotFound message="No data found for this filter!" />
                </Center>
            )}

            <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6} w="100%">
                {filteredData?.map((user) => {
                    return (
                        <VStack
                            w="100%"
                            key={user.id}
                            border="2px"
                            borderColor="white"
                            borderRadius="10px"
                            p={4}
                            alignItems="flex-start"
                            spacing={6}
                            wordBreak="break-all"
                        >
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>User ID</Text>
                                <Text color="purple.400">{user.id}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Name</Text>
                                <Text color="purple.400">{user.name}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Wallet Address</Text>
                                <Text color="purple.400">
                                    {user.walletAddress}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Email</Text>
                                <Text color="purple.400">{user.email}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Discord Username</Text>
                                <Text color="purple.400">{user.discordId}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Country</Text>
                                <Text color="purple.400">{user.country}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Role</Text>
                                <Text color="purple.400">{user.role}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>NFT Type</Text>
                                <Text color="purple.400">{user.nftType}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Underdog NFT Status
                                </Text>
                                <Text color="purple.400">{user.nftStatus}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Underdog NFT ID</Text>
                                <Text color="purple.400">{user.nftId}</Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Underdog NFT Issued At
                                </Text>
                                <Text color="purple.400">
                                    {user.nftIssuedAt
                                        ? format(
                                              new Date(user.nftIssuedAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Underdog NFT Expires At
                                </Text>
                                <Text color="purple.400">
                                    {user.nftExpiresAt
                                        ? format(
                                              new Date(user.nftExpiresAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>
                                    Underdog NFT Renewed At
                                </Text>
                                <Text color="purple.400">
                                    {user.nftRenewedAt
                                        ? format(
                                              new Date(user.nftRenewedAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Creation Date</Text>
                                <Text color="purple.400">
                                    {user.createdAt
                                        ? format(
                                              new Date(user.createdAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <VStack w="100%" alignItems="flex-start">
                                <Text fontWeight={600}>Update Date</Text>
                                <Text color="purple.400">
                                    {user.updatedAt
                                        ? format(
                                              new Date(user.updatedAt),
                                              "MMM dd, yyyy hh:mm a"
                                          )
                                        : "N/A"}
                                </Text>
                            </VStack>
                            <Flex flexWrap="wrap" gap={4}>
                                {user.nftStatus === "expired" && (
                                    <Button
                                        isLoading={renewUserMutation.isLoading}
                                        onClick={() =>
                                            renewUserHandler(user.id)
                                        }
                                    >
                                        Renew Visa
                                    </Button>
                                )}
                                {user.nftStatus === "active" && (
                                    <Button
                                        isLoading={expireUserMutation.isLoading}
                                        colorScheme="red"
                                        onClick={() =>
                                            expireUserHandler(user.id)
                                        }
                                    >
                                        Expire Visa
                                    </Button>
                                )}
                            </Flex>
                        </VStack>
                    );
                })}
            </SimpleGrid>
        </VStack>
    );
};

export default function UsersPage() {
    return (
        <>
            <Head>
                <title>Users | Business Visa App</title>
            </Head>

            <ProtectedRoute>
                <CustomContainer>
                    <Box py={20}>
                        <RenderUsersPage />
                    </Box>
                </CustomContainer>
            </ProtectedRoute>
        </>
    );
}
