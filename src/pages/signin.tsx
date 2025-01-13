import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ValidateInput from "@/components/ui/validateInput";
import { usePaymentDetailsStore } from "@/stores/paymentDetailsStore";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import axios from "axios";
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Loader,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface FormValues {
  email: string;
  password: string;
}

const Signin: React.FC = () => {
  const { control, handleSubmit } = useForm<FormValues>();

  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const router = useRouter();

  const { setUser } = useUserStore();

  const { setPaymentDetails } = usePaymentDetailsStore();

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setLoading(true);
    const { data: user, error: authError } =
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError) {
      toast.error("Error Signin in user");
      setLoading(false);
      router.replace("/?error=signin");
    }

    if (user) {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.user?.id as string)
        .single();
      if (userError) {
        toast.error("Error fetching user data");
        setLoading(false);
        router.replace("/?error=signin");
      }

      if (userData) {
        const { data } = await axios.get("/api/getStreamToken");

        if (userData.role === "teacher") {
          const { data: pData, error: pError } = await supabase
            .from("payment_details")
            .select("*")
            .eq("id", user?.user?.id as string)
            .single();
          if (pError) {
            toast.error("Error fetching payment data");
            setLoading(false);
            router.replace("/?error=signin");
          }
          if (pData) {
            setPaymentDetails(pData);
          }
        }

        setUser({
          ...userData,
          token: data.token,
        });
        setLoading(false);
        router.push("/profile/dashboard");
      }
    }
  };

  return (
    <div className="container relative  h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-primary-blue p-10 text-white lg:flex">
        <div className="absolute inset-0 bg-primary-blue" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* <Icons.logo className="mr-2 h-8 w-8" /> */}
          Torah Net
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-xl">
              &ldquo;Education is the passport to the future, for tomorrow
              belongs to those who prepare for it today.&rdquo;
            </p>
            <footer className="text-sm">- Malcolm X</footer>
          </blockquote>
        </div>
        <div className="relative z-20 mt-10 flex items-center justify-between text-blue-200">
          <div className="flex flex-col items-center">
            <BookOpen className="h-10 w-10 mb-2" />
            <span>Learn</span>
          </div>
          <div className="flex flex-col items-center">
            <PenTool className="h-10 w-10 mb-2" />
            <span>Practice</span>
          </div>
          <div className="flex flex-col items-center">
            <Lightbulb className="h-10 w-10 mb-2" />
            <span>Discover</span>
          </div>
          <div className="flex flex-col items-center">
            <GraduationCap className="h-10 w-10 mb-2" />
            <span>Achieve</span>
          </div>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-blue-700">
              Welcome back, learner!
            </h1>
            <p className="text-sm text-primary-blue">
              Sign in to continue your learning journey
            </p>
          </div>
          <div className="flex items-center justify-center">
            <GraduationCap className="h-16 w-16 text-blue-500" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="email">
                  Email
                </Label>
                <ValidateInput
                  control={control}
                  name="email"
                  placeholder="Email Address"
                  type="email"
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  // disabled={loading}
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
              <div className="grid gap-1">
                <Label className="sr-only" htmlFor="password">
                  Password
                </Label>
                <ValidateInput
                  control={control}
                  name="password"
                  placeholder="Password"
                  type="password"
                  rules={{
                    required: "Password is required",
                  }}
                  className="border-blue-300 focus:border-blue-500"
                />
              </div>
              <Button
                disabled={loading}
                className="bg-primary-blue hover:bg-blue-700"
              >
                {loading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Sign In to Learn
              </Button>
            </div>
          </form>
          <p className="px-8 text-center text-sm text-primary-blue">
            <Link
              href="/getStarted"
              className="underline underline-offset-4 hover:text-blue-800"
            >
              New to Torah Net ? Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>

    // <div className="flex items-center flex-col justify-center gap-3 min-h-screen w-full">
    //   <div>
    //     <h1 className="text-[#577eb8] text-4xl text-center font-bold">
    //       Signin
    //     </h1>
    //     <p className="text-center text-lg text-darkblueui mt-2">
    //       Sign in to your account
    //     </p>
    //   </div>
    //   <form onSubmit={handleSubmit(onSubmit)}>
    //     <ValidateInput
    //       control={control}
    //       name="email"
    //       placeholder="Email Address"
    //       type="email"
    //       rules={{
    //         required: "Email is required",
    //         pattern: {
    //           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    //           message: "Invalid email address",
    //         },
    //       }}
    //       className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-5"
    //     />

    //     <ValidateInput
    //       control={control}
    //       name="password"
    //       placeholder="Password"
    //       type="password"
    //       rules={{
    //         required: "Password is required",
    //       }}
    //       className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-5"
    //     />

    //     <button
    //       type="submit"
    //       className="bg-[#577eb8] text-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full  mt-5 flex items-center justify-center"
    //     >
    //       {loading ? <div className="basic"></div> : "Sign In"}
    //     </button>
    //   </form>
    // </div>
  );
};

export default Signin;
