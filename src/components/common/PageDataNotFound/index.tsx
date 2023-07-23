import { Center, Text } from "@chakra-ui/react";

interface Props {
    message: string;
}

function PageDataNotFound({ message }: Props) {
    return (
        <Center minH="30vh" flexDir="column">
            <Text
                color="purple.400"
                fontSize="2xl"
                maxW="xl"
                align="center"
                mb={4}
            >
                {message}
            </Text>
        </Center>
    );
}

export default PageDataNotFound;
