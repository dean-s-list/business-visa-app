import { defineStyleConfig } from "@chakra-ui/react";

const Link = defineStyleConfig({
    defaultProps: {},
    baseStyle: {
        _hover: {
            textDecor: "none",
            color: "purple.400",
        },
    },
});

export default Link;
