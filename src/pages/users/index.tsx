/* eslint-disable sonarjs/no-duplicate-string */
import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import format from "date-fns/format";
import Head from "next/head";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import CustomContainer from "@/src/components/common/CustomContainer";
import PageDataLoading from "@/src/components/common/PageDataLoading";
import PageDataNotFound from "@/src/components/common/PageDataNotFound";
import PageError from "@/src/components/common/PageError";
import useUsers from "@/src/hooks/useUsers";

export const DEFAULT_DATE_FORMAT = "dd MMMM yyyy hh:mm a";

const RenderUsersPage = () => {
    const { isLoading, isFetching, data, isError, refetch } = useUsers();

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

    if (data.length === 0) {
        return <PageDataNotFound message="No users found!" />;
    }

    return (
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {data.map((user) => {
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
                            <Text color="purple.400">{user.walletAddress}</Text>
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
                            <Text fontWeight={600}>Underdog NFT Status</Text>
                            <Text color="purple.400">{user.nftStatus}</Text>
                        </VStack>
                        <VStack w="100%" alignItems="flex-start">
                            <Text fontWeight={600}>Underdog NFT ID</Text>
                            <Text color="purple.400">{user.nftId}</Text>
                        </VStack>
                        <VStack w="100%" alignItems="flex-start">
                            <Text fontWeight={600}>Underdog NFT Issued At</Text>
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
                    </VStack>
                );
            })}
        </SimpleGrid>
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
