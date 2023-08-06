import {
    Box,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import format from "date-fns/format";
import Head from "next/head";

import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import CustomContainer from "@/src/components/common/CustomContainer";
import PageDataLoading from "@/src/components/common/PageDataLoading";
import PageDataNotFound from "@/src/components/common/PageDataNotFound";
import PageError from "@/src/components/common/PageError";
import useUsers from "@/src/hooks/useUsers";

export const DEFAULT_DATE_FORMAT = "dd MMMM yyyy hh:mm a";

const usersTableColumns = [
    { name: "ID", isNumeric: false },
    { name: "Name" },
    { name: "Email" },
    { name: "Solana Wallet Address" },
    { name: "Discord Id" },
    { name: "Role" },
    { name: "Country" },
    { name: "NFT Type" },
    { name: "Underdog NFT ID" },
    { name: "Underdog NFT Issued At" },
    { name: "Underdog NFT Expires At" },
    { name: "Underdog NFT Status" },
    { name: "Underdog NFT Renewed At" },
    { name: "Created At" },
    { name: "Updated At" },
];

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
        <TableContainer>
            <Table colorScheme="purple">
                <Thead>
                    <Tr>
                        {usersTableColumns.map((col) => {
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
                    {data?.map((user) => {
                        const nftIssueDate = user.nftIssuedAt
                            ? format(
                                  new Date(user.nftIssuedAt),
                                  DEFAULT_DATE_FORMAT
                              )
                            : null;

                        const nftExpireDate = user.nftExpiresAt
                            ? format(
                                  new Date(user.nftExpiresAt),
                                  DEFAULT_DATE_FORMAT
                              )
                            : null;

                        const nftRenewDate = user.nftRenewedAt
                            ? format(
                                  new Date(user.nftRenewedAt),
                                  DEFAULT_DATE_FORMAT
                              )
                            : null;

                        const userCreateDate = user.createdAt
                            ? format(
                                  new Date(user.createdAt),
                                  DEFAULT_DATE_FORMAT
                              )
                            : null;

                        const userUpdateDate = user.updatedAt
                            ? format(
                                  new Date(user.updatedAt),
                                  DEFAULT_DATE_FORMAT
                              )
                            : null;
                        return (
                            <Tr key={user.id}>
                                <Td>{user.id}</Td>
                                <Td>{user.name ?? "N/A"}</Td>
                                <Td>{user.email}</Td>
                                <Td>{user.walletAddress}</Td>
                                <Td>{user.discordId}</Td>
                                <Td>{user.role}</Td>
                                <Td>{user.country ?? "N/A"}</Td>
                                <Td>{user.nftType}</Td>
                                <Td>{user.nftId ?? "N/A"}</Td>
                                <Td>{nftIssueDate ?? "N/A"}</Td>
                                <Td>{nftExpireDate ?? "N/A"}</Td>
                                <Td>{user.nftStatus ?? "N/A"}</Td>
                                <Td>{nftRenewDate ?? "N/A"}</Td>
                                <Td>{userCreateDate ?? "N/A"}</Td>
                                <Td>{userUpdateDate ?? "N/A"}</Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </TableContainer>
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
