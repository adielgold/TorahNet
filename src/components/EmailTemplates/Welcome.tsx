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

interface NetlifyWelcomeEmailProps {
  steps?: {
    id: number;
    Description: React.ReactNode;
  }[];
  links?: string[];
}

const baseUrl = process.env.VERCEL_URL
  ? `http://${process.env.VERCEL_URL}`
  : "";

const PropDefaults: NetlifyWelcomeEmailProps = {
  steps: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Log in to your account</strong> to explore TorahNet and its
          features.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Browse topics</strong> that inspire you—Torah, Talmud, Hebrew,
          and more await!
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Connect with a teacher</strong> who will guide you on your
          learning journey.
        </li>
      ),
    },
    // {
    //   id: 4,
    //   Description: (
    //     <li className="mb-20" key={4}>
    //       <strong>Set up a custom domain.</strong> You can register a new domain
    //       and buy it through Netlify or assign a domain you already own to your
    //       site. <Link>Add a custom domain</Link>.
    //     </li>
    //   ),
    // },
  ],
  links: ["Visit the forums", "Read the docs", "Contact an expert"],
};

export const WelcomeEmail = ({ name }: { name: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to TorahNet – Let’s Begin Your Journey!</Preview>
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
              Welcome to TorahNet – Let’s Begin Your Journey!
            </Heading>

            <Section>
              <Row>
                <Text className="text-base font-bold mt-8">Dear {name}</Text>
                <Text className="text-base">
                  Welcome to *TorahNet*! We’re excited to have you join our
                  vibrant community of learners eager to explore the depths of
                  Jewish wisdom.
                </Text>

                <Text className="text-base">Here's how to get started:</Text>
              </Row>
            </Section>

            <ol className="-ml-20">
              {PropDefaults.steps?.map(({ Description }) => Description)}
            </ol>

            <Section>
              <Row>
                <Text className="text-base">
                  If you have any questions or need assistance, feel free to
                  email us at{" "}
                  <Link href="mailto:admin@torah-net.com">
                    admin@torah-net.com
                  </Link>
                  . We’re here to ensure your experience is seamless and
                  enriching.
                </Text>

                <Text className="text-base">
                  Thank you for choosing TorahNet. We’re honored to be part of
                  your journey and look forward to supporting you every step of
                  the way.{" "}
                </Text>
              </Row>
            </Section>

            <Section className="text-center">
              <Button
                className="bg-brand text-white rounded-lg py-3 px-[18px]"
                href="https://www.torah-net.com/"
              >
                Go to your dashboard
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

export default WelcomeEmail;
