import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowIconWhite } from "@/Icons";
import { createClient } from "@/utils/supabase/client";
import { useProfileSetupStore } from "@/stores/profileSetupStore";
import { useUserStore } from "@/stores/userStore";
import { usePaymentDetailsStore } from "@/stores/paymentDetailsStore";
import axios from "axios";
import { StepProps } from "@/lib/types";
import { CheckCircle2 } from "lucide-react";
import StepperButton from "./StepperButton";
import ToasterTitle from "../ui/toaster-title";
import { useToast } from "../ui/use-toast";

interface FinalStepDialogProps extends StepProps {
  onRegistrationStart?: () => void;
}

const FinalStepDialog: React.FC<FinalStepDialogProps> = ({
  complete,
  currentStep,
  setComplete,
  setCurrentStep,
  steps,
  onRegistrationStart,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const getImageSrc = () => {
    if (router.query?.role === "student") {
      return "/studentdialog.png";
    } else if (router.query?.role === "teacher") {
      return "/teacherdialog.png";
    } else {
      return "";
    }
  };

  const supabase = createClient();

  const { profileSetup } = useProfileSetupStore();

  const { setUser } = useUserStore();

  const { setPaymentDetails } = usePaymentDetailsStore();

  const { toast } = useToast();

  const registerUser = async () => {
    if (onRegistrationStart) {
      onRegistrationStart();
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: profileSetup?.email,
      password: profileSetup?.password,
    });

    if (error) {
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Error registering user",
      });
      router.replace("/getStarted?error=resgistration");
    }

    if (data) {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .update({
          name: profileSetup?.name,
          topics: profileSetup?.topics,
          bio: profileSetup?.bio,
          role: router.query?.role as string,
          country: profileSetup?.country,
        })
        .eq("id", data?.user?.id as string)
        .select("*")
        .single();

      if (usersError) {
        toast({
          title: <ToasterTitle title="Error" type="error" />,
          description: "Error registering user",
        });
        router.replace("/getStarted?error=resgistration");
      }

      if (usersData) {
        try {
          const { data: streamData } = await axios.post(
            "/api/registerStreamUser"
          );

          if (usersData?.role === "teacher") {
            const { data: paymentData, error: paymentError } = await supabase
              .from("payment_details")
              .insert({
                id: data?.user?.id as string,
                hourly_rate: 0,
              })
              .select("*")
              .single();

            if (paymentError) {
              toast({
                title: <ToasterTitle title="Error" type="error" />,
                description: "Error Setting up payment details",
              });
              router.replace("/getStarted?error=settinguppayment");
            }

            if (paymentData) {
              setPaymentDetails(paymentData);
            }
          }

          setLoading(false);
          setUser({
            ...usersData,
            token: streamData?.token,
          });

          await axios.post("/api/resend/welcome").then(() => {
            console.log("Email sent");
          });

          router.replace("/profile/dashboard");
        } catch (err) {
          console.log(err, "Error");
        }
      }
    }
  };

  return (
    <>
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h2 className="mb-2 text-2xl font-bold">
          Welcome, {profileSetup?.name}!
        </h2>
        <p className="text-gray-600">
          Amazing! Lets start to check out your dashboard and guide you through
          the app.
        </p>
      </div>

      <StepperButton
        complete={complete}
        currentStep={currentStep}
        steps={steps}
        setCurrentStep={setCurrentStep}
        className="mt-5"
        type="button"
        onClick={registerUser}
      />
    </>

    // <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
    //   <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>

    //   <div className="bg-white w-11/12 md:max-w-lg mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
    //     <div className="py-4 text-left px-6">
    //       <div className="flex flex-col justify-center items-center pb-3">
    //         <Image
    //           src={getImageSrc()}
    //           width={122}
    //           height={168}
    //           alt="dialogpng"
    //         />
    //         <p className="text-2xl font-bold text-darkblueui mt-10">
    //           Welcome, Dolor Sit Amet!
    //         </p>
    //         <p className="text-md text-darkblueui text-center">
    //           Amazing! Let's start to check out your dashboard and guide you
    //           through the app.
    //         </p>
    //       </div>
    //       <div className="flex sm:hidden flex-col justify-center items-center mt-8">
    //         <button
    //           // href="/profile/dashboard"
    //           onClick={registerUser}
    //           className="bg-darkblueui px-4 h-9 rounded-full flex items-center mt-2"
    //         >
    //           <span className="text-white text-base mr-1.5">
    //             Continue to dashboard
    //           </span>
    //           <ArrowIconWhite />
    //         </button>
    //         <Link
    //           href="/getStarted"
    //           className="text-darkblueui text-sm underline underline-offset-2 mt-2 pb-6"
    //         >
    //           Back to profile setup
    //         </Link>
    //       </div>
    //       <div className="hidden sm:flex justify-end mt-8">
    //         <Link
    //           href="/getStarted"
    //           className="text-darkblueui text-sm underline underline-offset-2 mt-4 mr-6"
    //         >
    //           Back to profile setup
    //         </Link>
    //         <button
    //           onClick={registerUser}
    //           className="bg-darkblueui px-3 h-9 rounded-full flex items-center mt-2"
    //         >
    //           <span className="text-white text-sm mr-1.5">Go to dashboard</span>
    //           <ArrowIconWhite />
    //         </button>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default FinalStepDialog;
