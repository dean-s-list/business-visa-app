import {
    Body,
    Button,
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

export const BUSINESS_VISA_EXPIRED_IMAGE_URL =
    "https://ik.imagekit.io/deanslistdao/assets/business-visa-expired.png";

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

const VisaExpiredEmail = ({ paymentLink }: { paymentLink: string }) => (
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
        <Preview>Seems like your Business Visa NFT has been expired.</Preview>
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
                                We&apos;re in a Pickle
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
                                Seems like your Business Visa NFT has been
                                expired.
                            </Heading>
                        </Row>
                    </Section>

                    <Section
                        style={{ marginTop: "40px", marginBottom: "35px" }}
                    >
                        <Img
                            style={{
                                margin: "auto",
                                // marginBottom: "40px",
                            }}
                            src={BUSINESS_VISA_EXPIRED_IMAGE_URL}
                            width="60%"
                            alt="business-visa-expired"
                        />

                        <Text
                            style={{
                                backgroundColor: "#5B3B8C",
                                borderRadius: "15px",
                                padding: "10px",
                                color: "#FDFBFD",
                                fontSize: "20px",
                            }}
                        >
                            Deposit $5 to continue your journey
                        </Text>

                        <Button
                            pX={20}
                            pY={10}
                            style={{
                                backgroundColor: "#5C3B8C",
                                color: "#ffffff",
                                borderRadius: "30px",
                                marginTop: "10px",
                            }}
                            href={paymentLink}
                        >
                            Pay Now
                        </Button>
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

export default VisaExpiredEmail;
