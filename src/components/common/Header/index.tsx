import { Box, HStack, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";

import AuthButton from "../../auth/AuthButton";
import CustomContainer from "../CustomContainer";

function Header() {
    const router = useRouter();

    const isHomePage = router.pathname === "/";

    const activeLinkColor = "purple.400";

    return (
        <Box as="header">
            <CustomContainer
                display="flex"
                justifyContent="space-between"
                alignItems="center"
            >
                <Link as={NextLink} href="/" _hover={{ textDecor: "none" }}>
                    <Text fontSize="xl" fontWeight="medium">
                        Business Visa App
                    </Text>
                </Link>

                <HStack flexGrow={1} justifyContent="center" spacing={6}>
                    <Link
                        as={NextLink}
                        href="/"
                        color={isHomePage ? activeLinkColor : "gray.50"}
                    >
                        Home
                    </Link>
                </HStack>

                <AuthButton />
            </CustomContainer>
        </Box>
    );
}

export default Header;
