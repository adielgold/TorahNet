import React from "react";
import QuickLinksCard from "./QuickLinksCard";
import { QUICK_LINKS } from "../../constants/constant";

interface QuickLinksProps {
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
}

const QuickLinks: React.FC<QuickLinksProps> = ({
  selectedTopics,
  setSelectedTopics,
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

  return (
    <div className="flex min-h-[100px] flex-col items-center justify-center sm:w-[540px]">
      <div className="flex flex-wrap items-center justify-center">
        {topics.map((topic, index) => (
          <QuickLinksCard
            key={index}
            title={topic}
            customClasses={`${
              selectedTopics.includes(topic)
                ? "bg-darkblueui text-white text-xs sm:text-md"
                : "text-xs sm:text-md"
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
  );
};

export default QuickLinks;
