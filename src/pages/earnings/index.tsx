import ProtectedRoute from "@/src/components/auth/ProtectedRoute";
import CustomContainer from "@/src/components/common/CustomContainer";
import {
    showErrorToast,
    showSuccessToast,
} from "@/src/components/common/ToastNotification";
import useUpdateEarnings from "@/src/hooks/useUpdateEarnings";
import { logError } from "@/src/lib/utils/general";
import { updateEarningsValidator } from "@/src/lib/validators/earnings";
import { Button, Text, VStack } from "@chakra-ui/react";
import { saveAs } from "file-saver";
import Head from "next/head";
import { useState } from "react";

export default function EarningsPage() {
    const [fileData, setFileData] = useState<Array<{
        wallet: string;
        earnings: number;
    }> | null>(null);

    const updateEarningsMutation = useUpdateEarnings();

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const fileReader = new FileReader();

        fileReader.onload = () => {
            try {
                const jsonContent = fileReader.result as string;
                const parsedJson = JSON.parse(jsonContent);
                updateEarningsValidator.parse({ wallets: parsedJson });
                setFileData(parsedJson);
            } catch (error) {
                setFileData(null);
                logError("Error parsing JSON file:", error);
                showErrorToast({
                    id: "error-parsing-wallets",
                    message: "Invalid json uploaded!",
                });
            }
        };

        fileReader.readAsText(file);
    };

    return (
        <>
            <Head>
                <title>Earnings | Business Visa App</title>
            </Head>

            <ProtectedRoute>
                <CustomContainer>
                    <VStack py={20} textAlign="center" gap={10}>
                        <VStack>
                            <Text>
                                To Update Earnings Please Upload a .json file in
                                the following format:
                            </Text>
                            <Button
                                onClick={() => {
                                    const fileUrl = "/sample.json";

                                    saveAs(fileUrl, "sample.json");
                                }}
                            >
                                Download Sample
                            </Button>
                        </VStack>

                        <VStack alignItems="flex-start">
                            <Text>Upload Final JSON to update earnings:</Text>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/json"
                            />
                        </VStack>

                        {fileData && (
                            <VStack>
                                <Text>File Data:</Text>
                                <VStack alignItems="flex-start">
                                    {fileData?.map((data) => (
                                        <Text key={data.wallet}>
                                            Wallet: <b>{data.wallet}</b>,
                                            Earnings: <b>{data.earnings}</b>
                                        </Text>
                                    ))}
                                </VStack>
                                <Button
                                    onClick={async () => {
                                        const toastId = "earnings-update";

                                        try {
                                            await updateEarningsMutation.mutateAsync(
                                                {
                                                    wallets: fileData,
                                                }
                                            );

                                            showSuccessToast({
                                                id: toastId,
                                                message:
                                                    "Earnings updated successfully!",
                                            });
                                        } catch (error) {
                                            showErrorToast({
                                                id: toastId,
                                                message:
                                                    "Failed to updated earnings!",
                                            });
                                        }
                                    }}
                                    isLoading={updateEarningsMutation.isLoading}
                                >
                                    Update Earnings
                                </Button>
                            </VStack>
                        )}

                        {updateEarningsMutation?.data?.result && (
                            <Text>
                                {JSON.stringify(
                                    updateEarningsMutation?.data?.result,
                                    null,
                                    4
                                )}
                            </Text>
                        )}
                    </VStack>
                </CustomContainer>
            </ProtectedRoute>
        </>
    );
}
