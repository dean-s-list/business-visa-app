import { Box } from "@chakra-ui/react";

import CustomContainer from "../CustomContainer";

function Footer() {
    return (
        <Box as="header">
            <CustomContainer display="flex" justifyContent="center">
                &copy; Business Visa App 2023
            </CustomContainer>
        </Box>
    );
}

export default Footer;
