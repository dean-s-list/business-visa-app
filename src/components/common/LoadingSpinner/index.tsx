import { Center, Spinner, Text } from "@chakra-ui/react";

interface Props {
    loadingText?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    color?: string;
    [key: string]: string | number | boolean | undefined;
}

function LoadingSpinner({
    loadingText,
    size = "xl",
    color = "purple.400",
    ...props
}: Props) {
    return (
        <Center
            flexDirection="column"
            my={4}
            {...props}
            opacity={1}
            zIndex={70}
        >
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color={color}
                size={size}
                mb={3}
            />
            {loadingText && (
                <Text
                    textAlign="center"
                    maxW="280px"
                    color={color}
                    fontWeight="medium"
                >
                    {loadingText}
                </Text>
            )}
        </Center>
    );
}

export default LoadingSpinner;
