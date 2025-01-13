import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import Footer from "@/components/Footer/footer";
import FAQ from "@/components/FAQ/faq";

export default function OurMission() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue to-blue-700 text-white">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <Link href={"www.torah-net.com"}>
          <Image
            src="/logo-white.png"
            alt="TorahNet Logo"
            width={70}
            height={70}
          />
        </Link>
        <nav className="hidden space-x-6 md:flex">
          <Link href="#mission">Our Mission</Link>
          <Link href="#how-it-works">How it Works</Link>
          <Link href="#faq">FAQ</Link>
        </nav>
        <Link href="/signin">
          <Button
            variant="outline"
            className="hidden text-primary-blue md:inline-flex"
          >
            Sign In
          </Button>
        </Link>
        <Button variant="ghost" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </Button>
      </header>

      {/* HERO SECTION */}
      <main className="mx-auto w-full">
        <section className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 md:flex-row md:py-24">
          {/* Text and CTA Section */}
          <motion.div
            className="flex w-full items-center justify-center p-8 text-white md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-center md:text-left">
              <h2 className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Learn. Teach. Connect.
              </h2>
              <p className="mb-8 text-lg md:text-xl">
                We connect teachers and students from all over the world in an
                engaging and fun experience. Where does your journey start?
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:justify-start">
                <Link href="#mission">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-100"
                  >
                    Read our story
                  </Button>
                </Link>
                <Link href="/signin">
                  <Button
                    size="lg"
                    className="bg-white text-blue-700 hover:bg-blue-100"
                  >
                    Create an account
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="flex aspect-square w-full items-center justify-center md:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="relative h-full w-full">
              <Image
                src="/studentandteacher.png"
                alt="Video cam big teacher"
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        </section>

        {/* MISSION */}
        <section id="mission" className="relative mx-auto flex bg-white">
          {/* Half-circle background */}
          <div className="absolute left-0 top-0 z-0 h-[350px] rounded-b-full bg-blue-100 md:w-[700px]"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="z-10 hidden aspect-square w-full items-center justify-center md:flex md:w-1/3"
          >
            <Image
              src="/learners-books.png"
              width={600}
              height={400}
              alt="Our Mission"
              className="mx-auto rounded-lg"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="z-10 flex aspect-square w-full items-center justify-center px-8 md:w-1/2 md:px-0"
          >
            <div>
              <h2 className="mb-6 font-light uppercase tracking-widest text-blue-900 md:text-xl">
                Our Mission
              </h2>
              <p className="mb-8 text-3xl font-bold text-blue-900 md:text-3xl md:leading-normal">
                Inspiring personal and spiritual growth through Torah learning
                around the world.
              </p>
              <Button
                size="lg"
                className="bg-blue-700 text-white hover:bg-blue-100"
                href="#how-it-works"
              >
                Show me how it works
              </Button>
            </div>
          </motion.div>
        </section>

        {/* WHO DO WE SERVE */}
        <section className="container relative mx-auto px-4 py-24 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="z-10 mb-8 text-3xl font-bold md:text-4xl">
              Who do we serve?
            </h2>
            <div className="flex flex-col items-center justify-center gap-x-32 gap-y-8 md:flex-row">
              {/* Teachers Card */}
              <div className="relative mt-24 rounded-3xl bg-white p-8 text-blue-900 shadow-lg md:w-1/2">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 transform">
                  <img
                    src="/teacher-small.png"
                    alt="Teacher Icon"
                    className="h-40 w-40"
                  />
                </div>

                <h3 className="mb-6 mt-12 text-2xl font-bold">Teachers</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Called to Share and Inspire with Jewish Wisdom
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Strengthen Connections to Tradition
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Seek Meaningful and Flexible Opportunities
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Aspire to Make a Positive Impact
                  </li>
                </ul>
              </div>

              {/* Learners Card */}
              <div className="relative mt-24 rounded-3xl bg-white p-8 text-blue-900 shadow-lg md:w-1/2">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 transform">
                  <img
                    src="/learner-small.png"
                    alt="Learner Icon"
                    className="h-40 w-40"
                  />
                </div>
                <h3 className="mb-6 mt-12 text-2xl font-bold">Learners</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Deepening Your Understanding of Jewish Wisdom
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Finding Guidance for Life’s Challenges
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Exploring Meaningful Spiritual Growth
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">✔</span>
                    Connecting with Like-Minded Individuals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="bg-slate-50 py-32 text-center">
          <div className="container mx-auto px-8">
            <h2 className="mb-16 text-3xl font-bold text-blue-900 md:text-4xl">
              How it Works? - Easy peasy!
            </h2>

            {/* Timeline Container */}
            <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-3 md:gap-x-8 md:gap-y-8">
              {/* Step 1 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-1-how-it-works.png"
                    alt="Create an account"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 1
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Create an account.
                </p>
                {/* Horizontal Arrow */}
                <div className="absolute right-[-30px] top-1/2 hidden -translate-y-1/2 transform md:block">
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <div className="h-0 w-0 border-l-4 border-r-4 border-b-transparent border-r-blue-500 border-t-transparent"></div>
                </div>
                {/* Vertical Arrow */}
                <div className="mx-auto block h-10 w-1 bg-blue-500 md:hidden"></div>
              </div>

              {/* Step 2 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-2-how-it-works.png"
                    alt="Search for interesting topics"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 2
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Search for interesting topics
                </p>
                {/* Horizontal Arrow */}
                <div className="absolute right-[-30px] top-1/2 hidden -translate-y-1/2 transform md:block">
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <div className="h-0 w-0 border-l-4 border-r-4 border-b-transparent border-r-blue-500 border-t-transparent"></div>
                </div>
                {/* Vertical Arrow */}
                <div className="mx-auto block h-10 w-1 bg-blue-500 md:hidden"></div>
              </div>

              {/* Step 3 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-3-how-it-works.png"
                    alt="Choose your teacher"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 3
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Choose your teacher
                </p>

                {/* Vertical Arrow */}
                <div className="mx-auto block h-10 w-1 bg-blue-500 md:hidden"></div>
              </div>

              {/* Step 4 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-4-how-it-works.png"
                    alt="Chat to plan a lesson"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 4
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Chat to plan a lesson
                </p>
                {/* Horizontal Arrow */}
                <div className="absolute right-[-30px] top-1/2 hidden -translate-y-1/2 transform md:block">
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <div className="h-0 w-0 border-l-4 border-r-4 border-b-transparent border-r-blue-500 border-t-transparent"></div>
                </div>
                {/* Vertical Arrow */}
                <div className="mx-auto block h-10 w-1 bg-blue-500 md:hidden"></div>
              </div>

              {/* Step 5 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-5-how-it-works.png"
                    alt="Pay securely via Stripe"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 5
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Pay securely via Stripe
                </p>
                {/* Horizontal Arrow */}
                <div className="absolute right-[-30px] top-1/2 hidden -translate-y-1/2 transform md:block">
                  <div className="h-1 w-12 bg-blue-500"></div>
                  <div className="h-0 w-0 border-l-4 border-r-4 border-b-transparent border-r-blue-500 border-t-transparent"></div>
                </div>
                {/* Vertical Arrow */}
                <div className="mx-auto block h-10 w-1 bg-blue-500 md:hidden"></div>
              </div>

              {/* Step 6 */}
              <div className="relative flex flex-col items-center justify-center rounded-3xl p-6">
                <div className="relative mb-4 h-48 w-48">
                  <Image
                    src="/step-6-how-it-works.png"
                    alt="Join your lesson!"
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="mb-2 bg-gray-800 px-2 py-1 text-sm text-slate-50">
                  Step 6
                </h3>
                <p className="mb-4 text-xl font-bold text-blue-900">
                  Join your lesson!
                </p>
                {/* No Arrow for Last Step */}
              </div>
            </div>
          </div>
        </section>

        {/* Section CTA Sign Up */}
        <section className="container mx-auto px-8 py-16 text-center">
          <h2 className="text-light mb-6 font-light uppercase tracking-widest md:text-xl">
            Ready to grow?
          </h2>
          <p className="text-light mb-4 text-3xl font-bold md:text-3xl md:leading-normal">
            Sign up and start within minutes!
          </p>
          <Image
            src="/studentandteacher.png"
            alt="Video cam big teacher"
            width={400}
            height={400}
            className="mx-auto"
          />
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/signin">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-100"
              >
                I want to teach
              </Button>
            </Link>
            <Link href="/signin">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-100"
              >
                I want to learn
              </Button>
            </Link>
          </div>
          <Link href="#faq">
            <p className="mt-8 underline">I still have some questions...</p>
          </Link>
        </section>

        {/* FAQ Imported Section */}
        <FAQ />
      </main>

      {/* Add Footer Here */}
      <Footer />
    </div>
  );
}
