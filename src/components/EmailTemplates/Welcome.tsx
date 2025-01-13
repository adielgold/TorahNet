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

const PropDefaults = {
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
   
  ],
  stepsTeacher: [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Log in to your account</strong> to explore the platform and familiarize yourself with its features.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Set up your profile</strong> in the settings section. Add your teaching subjects, rates, and availability, and create a Stripe account to receive payments securely.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Begin teaching!</strong> Use our intuitive tools to engage with your students and share your expertise seamlessly.
        </li>
      ),
    },
   
  ],
};

export const WelcomeEmail = ({ name,role }: { name: string,role:"student" | "teacher" }) => {
  return (
    <Html>
      <Head />
      <Preview>{role === "student" ? "Welcome to TorahNet – Let’s Begin Your Journey!" : "Welcome to TorahNet – Let’s Start Teaching!"} </Preview>
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
              {role === "student" ? "Welcome to TorahNet – Let’s Begin Your Journey!" : "Welcome to TorahNet – Let’s Start Teaching!"} 
            </Heading>

            <Section>
              <Row>
                <Text className="text-base font-bold mt-8">Dear {name}</Text>
                <Text className="text-base">
                  {role === "student" ? ` Welcome to *TorahNet*! We’re excited to have you join our
                  vibrant community of learners eager to explore the depths of
                  Jewish wisdom.` : `Welcome to *TorahNet*! We’re honored to have you join our dedicated community of educators sharing Jewish wisdom with eager learners around the world.  `}
                 
                </Text>

                <Text className="text-base">{role === "student" ? `Here's how to get started:` : `Here’s how to get started as a teacher: `}</Text>
              </Row>
            </Section>

            <ol className="-ml-20">
              {role === "student" ? PropDefaults.steps?.map(({ Description }) => Description) : PropDefaults.stepsTeacher?.map(({ Description }) => Description)}
            </ol>

            <Section>
              <Row>
                <Text className="text-base">
                 {role === "student" ? ` If you have any questions or need assistance, feel free to
                  email us at` : 'If you have any questions or need help setting up your account, don’t hesitate to contact us at'}{" "}
                  <Link href="mailto:admin@torah-net.com">
                    admin@torah-net.com
                  </Link>
                  . {role === "student" ? `We’re here to ensure your experience is seamless and enriching.` : `We’re here to support you every step of the way.`}
                </Text>

                <Text className="text-base">
                  {role === "student" ? `Thank you for choosing TorahNet. We’re honored to be part of your journey and look forward to supporting you every step of the way.` : "Thank you for being part of TorahNet. Together, we’re making Jewish wisdom more accessible and impactful than ever."}
                  {" "}
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
