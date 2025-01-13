import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Tailwind,
} from "@react-email/components";
import * as React from "react";

const baseUrl = process.env.VERCEL_URL
  ? `http://${process.env.VERCEL_URL}`
  : "";

export const MessageNotification = ({
  senderName,
  message,
  username,
}: {
  senderName: string;
  message: string;
  username: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>New Message from {senderName}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#4a4ae3",
                offwhite: "#fafbfb",
              },
              spacing: {
                0: "0px",
                20: "20px",
                45: "45px",
              },
            },
          },
        }}
      >
        <Body className="bg-offwhite text-base font-sans">
          <Img
            src={`${baseUrl}/static/logo.jpg`}
            width="150"
            height="150"
            alt="Netlify"
            className="mx-auto my-20"
          />
          <Container className="bg-white p-45">
            <Heading className="text-center my-0 leading-8">
              New Message
            </Heading>

            <Section>
              <Row>
                <Text className="text-base font-bold mt-8">
                  Dear {username}
                </Text>
                <Text className="text-base">
                  You have a new message from {senderName}
                </Text>

                <Text className="text-base">{message}</Text>
              </Row>
            </Section>

            <Section className="text-center">
              <Button
                className="bg-brand text-white rounded-lg py-3 px-[18px]"
                href="https://www.torah-net.com/"
              >
                Go to the chat
              </Button>
            </Section>

            <Section className="mt-45">
              <Text style={{ fontSize: "16px", lineHeight: "26px" }}>
                Warm Regards,
                <br />
                <strong>The TorahNet Team</strong>
              </Text>
            </Section>
          </Container>

          <Container className="mt-20">
            <Text className="text-center text-gray-400 mb-45">
              <strong>P.S.</strong> Follow us on
              [Instagram](https://www.instagram.com/torahnet/) for updates,
              inspiration, and helpful tips to enhance your learning experience!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MessageNotification;
