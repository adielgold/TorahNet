import { useState } from "react";
import { motion } from "framer-motion";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is TorahNet?",
      answer:
        "TorahNet is an online educational platform dedicated to spreading Jewish wisdom. It connects learners from around the world with teachers in Jewish topics, including Torah, Talmud, Jewish history, Hebrew, and personal growth.",
    },
    {
      question: "Who are the teachers on TorahNet?",
      answer:
        "Our teachers are primarily ultra-Orthodox Jews who possess extensive knowledge of Jewish traditions, texts, and values. They bring their expertise to a global audience, sharing wisdom that inspires personal and spiritual growth.",
    },
    {
      question: "Who can use TorahNet as a student?",
      answer:
        "TorahNet is open to everyone interested in exploring Jewish wisdom - secular Jews reconnecting with their heritage, non-Jewish individuals seeking insights into Judaism, and anyone passionate about self-growth through Jewish teachings.",
    },
    {
      question: "What topics can I learn on TorahNet?",
      answer:
        "TorahNet offers a wide range of topics, including Torah, Talmud, Jewish philosophy, ethics, Jewish history, Hebrew, and mentorship on relationships, financial wisdom, and self-discipline.",
    },
    {
      question: "How do I get started on TorahNet as a learner?",
      answer:
        "Getting started is easy! Simply visit torah-net.com, create an account, browse available teachers and courses, and book your first session. You can learn at your own pace and explore topics that interest you.",
    },
    {
      question: "How do I join as a teacher on TorahNet?",
      answer:
        "If you're interested in teaching on TorahNet, visit our website and sign up as a teacher. After registering, go to your settings to set up your Stripe account, enabling you to manage your payments seamlessly. Once completed, you're all set to start teaching on TorahNet!",
    },
    {
      question: "What tools does TorahNet provide for learning and teaching?",
      answer:
        "TorahNet offers intuitive tools for a smooth experience, including video and chat features for live sessions, flexible scheduling, and tools for managing courses and payments seamlessly.",
    },
    {
      question: "What is the cost of using TorahNet?",
      answer:
        "Signing up and using the platform is completely free. You are only charged when you schedule a lesson with a teacher. The cost varies based on the teacher's rates and the courses you choose, as each teacher sets their own pricing. TorahNet applies a small service fee to support and enhance the platform.",
    },
    {
      question: "Can I cancel or reschedule a lesson?",
      answer:
        "Yes, TorahNet allows students and teachers to cancel or reschedule lessons in accordance with our cancellation policy. This ensures flexibility for both parties.",
    },
    {
      question: "How do I contact support if I have questions or issues?",
      answer:
        "If you need assistance, you can reach out to our support team via email at admin@torah-net.com.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="mb-10 text-center text-3xl font-bold md:text-4xl">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4 rounded-3xl bg-white p-6 text-blue-900 shadow-lg">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-300 pb-4">
            {/* Question (Always Visible) */}
            <div
              className="flex cursor-pointer items-center justify-between text-lg font-bold"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span
                className={`transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>

            {/* Answer (Toggle Visibility) */}
            <motion.div
              initial={{ height: 0 }}
              animate={{
                height: activeIndex === index ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
              className={`overflow-hidden`}
            >
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
