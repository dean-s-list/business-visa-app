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

export const BUSINESS_VISA_REJECTED_IMAGE_URL =
    "https://ik.imagekit.io/deanslistdao/assets/business-visa-rejected.png";

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

const VisaRejectedEmail = () => (
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
        <Preview>Your business visa application has been rejected.</Preview>
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
                                Regretfully!
                            </Heading>
                        </Row>
                        <Row>
                            <Heading
                                style={{
                                    margin: "auto",
                                    marginBottom: "0px",
                                    fontSize: "20px",
                                    fontWeight: 400,
                                    width: "300px",
                                }}
                            >
                                It is to inform you that we have decided to
                                pursue other candidates at this time.
                            </Heading>
                        </Row>
                    </Section>

                    <Section
                        style={{ marginTop: "50px", marginBottom: "30px" }}
                    >
                        <Img
                            style={{
                                margin: "auto",
                                // marginBottom: "40px",
                            }}
                            src={BUSINESS_VISA_REJECTED_IMAGE_URL}
                            width="60%"
                            alt="business-visa-rejected"
                        />
                    </Section>

                    <Text
                        style={{
                            margin: "auto",
                            fontSize: "16px",
                        }}
                    >
                        This volume of response makes for an extremely
                        competitive selection process. We hope you see another
                        position that sparks your interest!
                    </Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default VisaRejectedEmail;
