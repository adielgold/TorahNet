import React, { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import ValidateInput from "../ui/validateInput";
import { StepProps } from "@/lib/types";
import StepperButton from "./StepperButton";
import { useProfileSetupStore } from "@/stores/profileSetupStore";
import countryList from "react-select-country-list";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface FormValues {
  name: string;
  email: string;
  confirmEmail: string;
  password: string;
}

const FirstStep: React.FC<StepProps> = ({
  complete,
  currentStep,
  setComplete,
  setCurrentStep,
  steps,
}) => {
  const { control, handleSubmit, getValues } = useForm<FormValues>();

  const options = useMemo(() => countryList().getData(), []);

  const [country, setSelectedCountry] = useState(options[0]?.value);

  const { setProfileSetup, profileSetup } = useProfileSetupStore();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    setProfileSetup({ ...profileSetup, ...data, country });
    setCurrentStep((prev) => prev + 1);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        // className="flex flex-col min-h-96 h-full justify-center items-center px-8"
      >
        {/* <h2 className="text-darkblueui font-bold text-2xl">Account Details</h2>
        <span className="text-darkblueui text-base text-center">
          Please provide your account details to sign in and display your{" "}
          <br className="hidden sm:block" /> name on the platform.
        </span> */}
        <ValidateInput
          control={control}
          name="name"
          placeholder="Name"
          type="text"
          rules={{ required: "Name is required" }}
          // className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-10"
        />
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
          // className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-5"
        />
        <ValidateInput
          control={control}
          name="confirmEmail"
          placeholder="Confirm Email Address"
          type="email"
          rules={{
            required: "Confirm email is required",
            validate: (value) =>
              value === getValues("email") || "The emails do not match", // Add this line
          }}
          // className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-5"
        />

        <Select
          onValueChange={(val) => setSelectedCountry(val)}
          value={country}
        >
          <SelectTrigger>
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => {
              return (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        <ValidateInput
          control={control}
          name="password"
          placeholder="Password"
          type="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
          // className="bg-white py-4 pl-4 pr-6 min-w-full sm:min-w-96 rounded-full border border-[#D7E3F4] mt-5"
        />

        <StepperButton
          complete={complete}
          currentStep={currentStep}
          steps={steps}
          setCurrentStep={setCurrentStep}
          type="submit"
          className="mt-5"
        />
      </form>
    </>
  );
};

export default FirstStep;
