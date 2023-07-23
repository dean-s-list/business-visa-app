import { Center } from "@chakra-ui/react";

import LoadingSpinner from "../LoadingSpinner";

interface Props {
    loadingText: string;
}

function PageDataLoading({ loadingText }: Props) {
    return (
        <Center minH="30vh">
            <LoadingSpinner loadingText={loadingText} />
        </Center>
    );
}

export default PageDataLoading;
