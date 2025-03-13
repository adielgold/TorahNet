import React, { useState } from "react";
import QuickLinksCard from "../QuickLinks/QuickLinksCard";
import StepperButton from "./StepperButton";
import { StepProps } from "@/lib/types";
import { useProfileSetupStore } from "@/stores/profileSetupStore";
import { Badge } from "../ui/badge";

const SecondStep: React.FC<StepProps> = ({
  complete,
  setComplete,
  setCurrentStep,
  steps,
  currentStep,
}) => {
  const topics = [
    "Hebrew Bible (Tanakh/Torah)",
    "Talmud (Gemara)",
    "Jewish Mysticism (Kabbalah)",
    "Jewish Law (Halakha)",
    "Jewish Ethics & Philosophy",
    "Jewish History",
    "Hebrew",
    "Mentorship",
    "Business & Leadership",
    "Relationships & Marriage",
  ];

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const { profileSetup, setProfileSetup } = useProfileSetupStore();

  return (
    <>
      <div>
        <p className="mb-4 text-sm text-gray-600">
          Please fill in topics you find interesting. These will be used to give
          an indication of your interests.
        </p>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge
              key={topic}
              variant={selectedTopics.includes(topic) ? "default" : "outline"}
              className="cursor-pointer p-2"
              onClick={() => {
                setSelectedTopics((prev) => {
                  if (prev.includes(topic)) {
                    return prev.filter((item) => item !== topic);
                  } else {
                    return [...prev, topic];
                  }
                });
              }}
            >
              {topic}
            </Badge>
          ))}
        </div>
        <StepperButton
          complete={complete}
          currentStep={currentStep}
          steps={steps}
          setCurrentStep={setCurrentStep}
          onClick={() => {
            setProfileSetup({ ...profileSetup, topics: selectedTopics });
            setCurrentStep((prev) => prev + 1);
          }}
          type="button"
          className="mt-28"
        />
      </div>

      {/* <div className="flex flex-col min-h-96 h-full items-center px-6 sm:px-0">
        <h2 className="text-darkblueui font-bold text-2xl">Favourite topics</h2>
        <span className="text-darkblueui text-base text-center">
          Please fill in topics you find interesting. These will be used to give{" "}
          <br />
          an indication on your interests.
        </span>
        <div className="flex flex-col sm:w-[517px] min-h-[100px] justify-center items-center mt-6 sm:mt-0">
          <div className="flex flex-wrap justify-center items-center">
            {topics.map((topic, index) => (
              <QuickLinksCard
                key={index}
                title={topic}
                textSize="sm"
                customClasses={`${
                  selectedTopics.includes(topic)
                    ? "bg-darkblueui text-white"
                    : ""
                }`}
                onClick={() => {
                  setSelectedTopics((prev) => {
                    if (prev.includes(topic)) {
                      return prev.filter((item) => item !== topic);
                    } else {
                      return [...prev, topic];
                    }
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
};

export default SecondStep;
