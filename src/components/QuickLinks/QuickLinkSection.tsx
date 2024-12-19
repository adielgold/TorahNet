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
    "Laudantium Non Provident",
    "Quis Porro Est",
    "Voluptatibus Enim",
    "Lorem Ipsum",
    "Dolor Sit Amet",
    "Conseteur Amis",
  ];

  return (
    <div className="flex flex-col sm:w-[540px] min-h-[100px] justify-center items-center">
      <div className="flex flex-wrap justify-center items-center">
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
