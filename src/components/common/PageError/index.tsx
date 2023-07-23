import { Button, Center, Text } from "@chakra-ui/react";

type Props = {
    message: string;
} & (
    | { showRetryButton: true; retryFn: () => void }
    | { showRetryButton?: false; retryFn?: never }
);

function PageError({ message, showRetryButton = false, retryFn }: Props) {
    return (
        <Center minH="30vh" flexDir="column">
            <Text
                color="red.500"
                fontSize="2xl"
                maxW="xl"
                align="center"
                mb={4}
            >
                {message}
            </Text>

            {showRetryButton && <Button onClick={retryFn}>Retry</Button>}
        </Center>
    );
}

export default PageError;
