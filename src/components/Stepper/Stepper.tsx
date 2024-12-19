import React, { useState } from "react";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import ThirdStep from "./ThirdStep";
import FinalStepDialog from "./FInalStepDialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckCircle2, ChevronRight, User } from "lucide-react";
import { Button } from "../ui/button";

const steps = [
  { title: "Account Details", icon: User },
  { title: "Interests", icon: User },
  { title: "Biography", icon: User },
  { title: "Ready!", icon: CheckCircle2 },
];

const Stepper = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [complete, setComplete] = useState(false);

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <FirstStep
            complete={complete}
            currentStep={currentStep}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        );
      case 1:
        return (
          <SecondStep
            complete={complete}
            currentStep={currentStep}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        );
      case 2:
        return (
          <ThirdStep
            complete={complete}
            currentStep={currentStep}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        );
      case 3:
        return (
          <FinalStepDialog
            complete={complete}
            currentStep={currentStep}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        );
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-[#1e1e4a]">
            Setting up your Profile
          </CardTitle>
          <p className="text-center text-gray-600">
            To make the platform as engaging as possible, we require some
            information so our teachers know who they are talking to.
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <div className="flex justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-[#1e1e4a] text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="text-xs mt-2">{step.title}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-[#1e1e4a]"
                initial={{ width: "0%" }}
                animate={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* <div className="flex justify-between mt-9">
        {steps?.map((step, i) => (
          <div
            key={i}
            className={`step-item ${currentStep === i + 1 && "active"} ${
              (i + 1 < currentStep || complete) && "complete"
            } `}
          >
            <div className="step"></div>
            <p className="text-[#181849] text-[10px] mt-2 sm:mt-0 sm:text-xs">
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-col w-full sm:w-2/4 h-full justify-center items-center mt-20">
        {(currentStep === 1 && (
          <FirstStep
            complete={complete}
            currentStep={currentStep}
            setComplete={setComplete}
            setCurrentStep={setCurrentStep}
            steps={steps}
          />
        )) ||
          (currentStep === 2 && (
            <SecondStep
              complete={complete}
              currentStep={currentStep}
              setComplete={setComplete}
              setCurrentStep={setCurrentStep}
              steps={steps}
            />
          )) ||
          (currentStep === 3 && (
            <ThirdStep
              complete={complete}
              currentStep={currentStep}
              setComplete={setComplete}
              setCurrentStep={setCurrentStep}
              steps={steps}
            />
          )) ||
          (currentStep === 4 && <FinalStepDialog />)}
     
      </div> */}
    </>
  );
};

export default Stepper;
