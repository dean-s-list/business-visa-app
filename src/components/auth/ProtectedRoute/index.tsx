import { Center, Heading, Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import PageLoader from "../../common/PageLoader";
import AuthButton from "../AuthButton";

function ProtectedRoute({ children }: { children: React.ReactElement }) {
    const { status } = useSession();

    if (status === "loading") {
        return <PageLoader loadingText="Checking Authentication" />;
    }

    if (status === "authenticated") {
        return children;
    }

    return (
        <Center minH="sm" flexDir="column" textAlign="center">
            <Heading as="h1" size="xl" color="purple.400" mb={2}>
                You are not authenticated!
            </Heading>
            <Text fontSize="lg" mb={4}>
                Please sign in for using the app.
            </Text>
            <AuthButton />
        </Center>
    );
}

export default ProtectedRoute;
