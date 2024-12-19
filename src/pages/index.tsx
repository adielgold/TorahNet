import Link from "next/link";
import Image from "next/image";
import { Hamburger, Navbar2 } from "@/components";
import { ArrowIconBlue } from "@/Icons";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Home() {
  const handleHamburgerClick = () => {
    console.log("Hamburger clicked!");
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue to-blue-700 text-white">
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

      <main className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <motion.div
          className="md:w-1/2 mb-12 md:mb-0"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Interested in religious teaching(s)?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Lorem ipsum dolor sit amet, mollitia quo rerum velit et assumenda
            assumenda qui nemo debitis et suscipit magni.
          </p>
          <Link href="/getStarted">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-100"
            >
              Get Started
            </Button>
          </Link>
        </motion.div>
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="w-1/2 h-full hidden sm:flex items-center justify-center">
            <div className="w-full flex items-start mb-16 ml-10">
              <Image
                src="/teacherlanding.png"
                width={212}
                height={600}
                alt="video cam big teacher"
                className=""
              />
              <Image
                src="/studentlanding.png"
                width={212}
                height={600}
                alt="video cam big student"
                className="ml-20"
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>

    // <section className="flex w-full h-screen landingpagebg">
    //   <div className="flex flex-col w-full h-full">
    //     <div className="flex-col justify-center items-end w-full -ml-8 hidden sm:flex">
    //       <Navbar2 />
    //     </div>
    //     <div className="flex sm:hidden flex-col justify-center items-end w-full -ml-4">
    //       <Hamburger />
    //     </div>
    //     <div className="w-full h-full justify-center items-center flex sm:hidden flex-col">
    //       <div className="w-full h-52 flex items-center justify-center">
    //         <div className="w-full flex items-start justify-evenly h-full overflow-hidden">
    //           <Image
    //             src="/teacherlanding.png"
    //             width={212}
    //             height={600}
    //             alt="video cam big teacher"
    //             className="w-1/4"
    //           />
    //           <Image
    //             src="/studentlanding.png"
    //             width={212}
    //             height={600}
    //             alt="video cam big student"
    //             className="w-1/4"
    //           />
    //         </div>
    //       </div>
    //       <div className="w-full flex flex-col items-center justify-center">
    //         <h1 className="text-white font-black text-5xl text-left">
    //           Interested in <br /> religious <br /> teaching(s)?{" "}
    //         </h1>
    //         <p className="text-white text-md w-3/4 mt-5 text-left">
    //           Lorem ipsum dolor sit amet. mollitia quo rerum velit et assumenda
    //           assumenda qui nemo debitis et suscipit magni.{" "}
    //         </p>
    //         <div className="mt-5 flex w-3/4 items-start">
    //           <Link
    //             href="/getStarted"
    //             className="text-darkblueui font-bold bg-white px-3 py-1 text-xs rounded-full hover:bg-gray-200 flex"
    //           >
    //             <span className="mt-1">Get Started</span>
    //             <ArrowIconBlue />
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="w-full h-full hidden sm:flex">
    //       <div className="w-1/2 h-full flex flex-col items-end justify-center">
    //         <h1 className="text-white font-black text-8xl leading-[6.25rem] ">
    //           Interested in <br /> religious <br /> teaching(s)?
    //         </h1>
    //         <p className="text-white text-md w-2/3 mt-5">
    //           Lorem ipsum dolor sit amet. mollitia quo rerum velit et assumenda
    //           assumenda qui nemo debitis et suscipit magni.{" "}
    //         </p>
    //         <div className="mt-5 flex items-start w-2/3">
    //           <Link
    //             href="/getStarted"
    //             className="text-darkblueui font-bold bg-white px-4 py-2 text-base rounded-full hover:bg-gray-200 flex"
    //           >
    //             Get Started
    //             <ArrowIconBlue />
    //           </Link>
    //         </div>
    //       </div>
    //       <div className="w-1/2 h-full hidden sm:flex items-center justify-center">
    //         <div className="w-full flex items-start mb-16 ml-10">
    //           <Image
    //             src="/teacherlanding.png"
    //             width={212}
    //             height={600}
    //             alt="video cam big teacher"
    //             className=""
    //           />
    //           <Image
    //             src="/studentlanding.png"
    //             width={212}
    //             height={600}
    //             alt="video cam big student"
    //             className="ml-20"
    //           />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}
