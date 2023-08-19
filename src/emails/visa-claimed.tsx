import {
    Body,
    Container,
    Font,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";

const EMAIL_LOGO_IMAGE_URL =
    "https://ik.imagekit.io/deanslistdao/assets/deanslist-logo.png";

const BUSINESS_VISA_NEW_IMAGE_URL =
    "https://ik.imagekit.io/deanslistdao/assets/business-visa-new.png?updatedAt=1692472582398";

const main = {
    backgroundColor: "#f1f5f9",
    textAlign: "center" as const,
    fontFamily: "Mundial, Verdana, sans-serif",
    padding: "40px 0",
};

const container = {
    backgroundColor: "#FFFFFF",
    margin: "40px auto",
    padding: "40px",
    maxWidth: "500px",
    borderRadius: "16px",
};

const VisaClaimedEmail = () => (
    <Html>
        <Head>
            <Font
                fontFamily="Mundial"
                fallbackFontFamily="Verdana"
                webFont={{
                    url: "https://fonts.cdnfonts.com/css/mundial",
                    format: "woff2",
                }}
            />
        </Head>
        <Preview>Your Business Visa NFT has been successfully claimed.</Preview>
        <Body style={main}>
            <Container style={container}>
                <Section>
                    <Img
                        style={{
                            margin: "auto",
                            marginBottom: "40px",
                        }}
                        src={EMAIL_LOGO_IMAGE_URL}
                        width="60%"
                        alt="deanslist-logo"
                    />

                    <Section>
                        <Row>
                            <Heading
                                style={{
                                    margin: "auto",
                                    marginBottom: "20px",
                                    fontSize: "40px",
                                    fontWeight: 700,
                                }}
                            >
                                Congratulations!
                            </Heading>
                        </Row>
                        <Row>
                            <Heading
                                style={{
                                    margin: "auto",
                                    marginBottom: "0px",
                                    fontSize: "20px",
                                    fontWeight: 400,
                                }}
                            >
                                Your Business Visa NFT has been successfully
                                claimed.
                            </Heading>
                        </Row>
                    </Section>

                    <Section style={{ marginBottom: "45px" }}>
                        <Img
                            style={{
                                margin: "auto",
                                // marginBottom: "40px",
                            }}
                            src={BUSINESS_VISA_NEW_IMAGE_URL}
                            width="100%"
                            alt="business-visa-claimed"
                        />
                    </Section>

                    <Text
                        style={{
                            margin: "auto",
                            fontSize: "16px",
                        }}
                    >
                        Should you have any further inquiries or require
                        assistance, please do not hesitate to reach out in the
                        public chat
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default VisaClaimedEmail;
