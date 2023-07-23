import { Container } from "@chakra-ui/react";

function CustomContainer({
    children,
    ...props
}: {
    children: React.ReactNode;
    [string: string]: string | React.ReactNode | number | undefined;
}) {
    return (
        <Container maxW="7xl" p={4} {...props}>
            {children}
        </Container>
    );
}

export default CustomContainer;
