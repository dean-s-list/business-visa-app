import { Center } from "@chakra-ui/react";

import LoadingSpinner from "../LoadingSpinner";

interface Props {
    loadingText: string;
}

function PageLoader({ loadingText }: Props) {
    return (
        <Center
            position="fixed"
            inset={0}
            zIndex={10}
            bg="gray.800"
            textAlign="center"
        >
            <LoadingSpinner loadingText={loadingText} />
        </Center>
    );
}

export default PageLoader;
