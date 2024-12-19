import { Navbar2, Hamburger } from "@/components";
import React from "react";
import Image from "next/image";
import { ArrowIconBlue } from "@/Icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue to-blue-700 text-white flex flex-col">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">ReligiousTeach</h1>
        </motion.div>
        <nav className="hidden md:flex space-x-6">
          <Link href="#mission">Our Mission</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#contact">Contact</Link>
        </nav>
        <Link href="/signin">
          <Button
            variant="outline"
            className="hidden md:inline-flex text-primary-blue"
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
            className="w-6 h-6"
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
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Join our Educational Community!
          </h1>
          <p className="text-xl md:text-2xl text-blue-100">Pick a side</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl"
        >
          <div className="flex flex-col items-center mb-8 md:mb-0 md:mr-12">
            <Image
              src="/studentlanding.png"
              width={155}
              height={443}
              alt="video cam big student"
              className="mb-4"
            />
            <Link href="/profileSetup?role=student">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-100"
              >
                Start Learning
              </Button>
            </Link>
          </div>

          <div className="w-px h-32 bg-blue-300 hidden md:block" />

          <div className="flex flex-col items-center mt-8 md:mt-0 md:ml-12">
            <Image
              src="/teacherlanding.png"
              width={155}
              height={443}
              alt="video cam big teacher"
              className="mb-4"
            />
            <Link href="/profileSetup?role=teacher">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-100"
              >
                Share Your Expertise
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>

    // <section className="flex flex-col w-full h-screen landingpagebg">
    //   <div className="flex-col justify-center items-end w-full -ml-8 hidden sm:flex">
    //     <Navbar2 />
    //   </div>
    //   <div className="flex sm:hidden flex-col justify-center items-end w-full -ml-4">
    //     <Hamburger />
    //   </div>
    //   <div className="flex flex-col justify-center items-center w-full h-full">
    //     <div className="w-full flex flex-col sm:hidden items-center justify-center">
    //       <h1 className="text-white font-bold text-5xl text-center">
    //         Join Our Educational Community!
    //       </h1>
    //       <p className="text-white text-2xl mt-8">Pick a side</p>
    //       <div className="flex w-full justify-center items-center mt-16">
    //         <div className="flex flex-col justify-center items-center w-1/2">
    //           <div className="flex flex-col justify-center items-center w-full">
    //             <Image
    //               src="/studentlanding.png"
    //               width={155}
    //               height={443}
    //               alt="video cam big student"
    //               className="w-20"
    //             />
    //             <Link
    //               href="profileSetup?role=student"
    //               className="text-darkblueui bg-white px-4 py-1.5 text-base rounded-full hover:bg-gray-200 flex mt-6 "
    //             >
    //               <span className="text-sm text-darkblueui mt-0.5">
    //                 Start Learning
    //               </span>
    //               <ArrowIconBlue />
    //             </Link>
    //           </div>
    //         </div>
    //         <div className="w-0.5 h-60 bg-white"></div>
    //         <div className="flex flex-col justify-center items-center w-1/2">
    //           <div className="flex flex-col justify-center items-center w-full">
    //             <Image
    //               src="/teacherlanding.png"
    //               width={155}
    //               height={443}
    //               alt="video cam big teacher"
    //               className="w-20"
    //             />
    //             <Link
    //               href="/profileSetup?role=teacher"
    //               className="bg-white px-4 py-2 rounded-full hover:bg-gray-200 flex mt-6"
    //             >
    //               <span className="text-sm text-darkblueui mt-0.5">
    //                 Start Teaching
    //               </span>
    //               <ArrowIconBlue />
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex-col justify-center items-center w-1/2 hidden sm:flex">
    //       <h1 className="text-white font-bold text-5xl">
    //         Join our Educational Community!
    //       </h1>
    //       <p className="text-white text-2xl mt-4">Pick a side</p>
    //       {/* {Student/Teacher Starting} */}
    //       <div className="flex w-full justify-center items-center">
    //         <div className="flex flex-col justify-center items-center w-1/2">
    //           <div className="flex flex-col justify-center items-center w-full">
    //             <Image
    //               src="/studentlanding.png"
    //               width={155}
    //               height={443}
    //               alt="video cam big student"
    //             />
    //             <Link
    //               href="profileSetup?role=student"
    //               className="text-darkblueui bg-white px-4 py-1.5 text-base rounded-full hover:bg-gray-200 flex mt-12 ml-2"
    //             >
    //               <span className="text-sm text-darkblueui mt-0.5">
    //                 Start Learning
    //               </span>
    //               <ArrowIconBlue />
    //             </Link>
    //           </div>
    //         </div>
    //         <div className="w-2 h-[27rem] bg-white mx-40 mt-16"></div>
    //         <div className="flex flex-col justify-center items-center w-1/2">
    //           <div className="flex flex-col justify-center items-center w-full">
    //             <Image
    //               src="/teacherlanding.png"
    //               width={155}
    //               height={443}
    //               alt="video cam big teacher"
    //               className=""
    //             />
    //             <Link
    //               href="profileSetup?role=teacher"
    //               className="bg-white px-4 py-1.5 rounded-full hover:bg-gray-200 flex mt-12"
    //             >
    //               <span className="text-sm text-darkblueui mt-0.5">
    //                 Share Your Expertise
    //               </span>
    //               <ArrowIconBlue />
    //             </Link>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
};

export default GetStarted;
