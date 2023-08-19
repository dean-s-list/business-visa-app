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

type Props = {
    businessVisaImage: string;
    claimLink: string;
};

const VisaAcceptedEmail = ({ businessVisaImage, claimLink }: Props) => (
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
        <Preview>Your Business Visa is ready,</Preview>
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
                                    fontSize: "24px",
                                    fontWeight: 400,
                                }}
                            >
                                Welcome aboard
                            </Heading>
                        </Row>
                        <Row>
                            <Heading
                                style={{
                                    margin: "auto",
                                    marginBottom: "20px",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                }}
                            >
                                Your Business Visa is ready
                            </Heading>
                        </Row>
                    </Section>

                    <Section style={{ margin: "30px 0" }}>
                        <Img
                            style={{
                                margin: "auto",
                                // marginBottom: "40px",
                            }}
                            src={businessVisaImage}
                            width="100%"
                            alt="business-visa"
                        />
                    </Section>

                    <Button
                        pX={20}
                        pY={10}
                        style={{
                            backgroundColor: "#5C3B8C",
                            color: "#ffffff",
                            borderRadius: "30px",
                            marginBottom: "30px",
                        }}
                        href={claimLink}
                    >
                        Claim
                    </Button>

                    <Text
                        style={{
                            margin: "auto",
                            fontSize: "20px",
                            width: "340px",
                        }}
                    >
                        We are pleased to have you join our team.
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default VisaAcceptedEmail;
