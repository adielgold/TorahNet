import { StepProps } from "@/lib/types";
import React, { useState } from "react";
import StepperButton from "./StepperButton";
import { useProfileSetupStore } from "@/stores/profileSetupStore";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/router";

const ThirdStep: React.FC<StepProps> = ({
  complete,
  currentStep,
  setComplete,
  setCurrentStep,
  steps,
}) => {
  const [biography, setBioGraphy] = useState<string>("");

  const { profileSetup, setProfileSetup } = useProfileSetupStore();

  const router = useRouter();

  const getBioStaticTextBasedOnRole = () => {
    if (router?.query?.role === "teacher") {
      return {
        placeholder: "Teacher for 47 years, specialized in ....",
        text: "Students will be able to see this information. You can always adjust this information in the Account Settings.",
      };
    } else {
      return {
        placeholder: "Student for  years, specialized in ....",
        text: "Teachers will be able to see this information. You can always adjust this information in the Account Settings.",
      };
    }
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {getBioStaticTextBasedOnRole().text}
        </p>
        <Textarea
          placeholder={getBioStaticTextBasedOnRole().placeholder}
          value={biography}
          onChange={(e) => setBioGraphy(e.target.value)}
          className="h-32"
        />
        <StepperButton
          complete={complete}
          currentStep={currentStep}
          steps={steps}
          setCurrentStep={setCurrentStep}
          onClick={() => {
            setProfileSetup({ ...profileSetup, bio: biography });
            setCurrentStep((prev) => prev + 1);
          }}
          type="button"
          className="mt-28"
        />
      </div>
    </>
  );
};

export default ThirdStep;
