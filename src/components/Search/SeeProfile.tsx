import { ArrowIconWhite, CrossSvg, LittleStar } from "@/Icons";
import { SearchUserData } from "@/types";
import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const SeeProfile = ({
  bio,
  email,
  expertise,
  id,
  name,
  role,
  topics,
  hourly_rate,
  avg_rating,
  image_url,
  handleProfileClose,
  ratingData,
}: SearchUserData & { handleProfileClose: () => void; ratingData: any }) => {
  return (
    <div className="fixed w-full h-full top-0 left-0 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="bg-white w-[50rem] mx-auto rounded-xl shadow-lg z-50 overflow-y-auto">
        <div className="py-4 text-left px-6">
          <div className="flex justify-center sm:justify-start items-center">
            <div className="min-w-20 h-20 bg-[#D7E3F4] rounded-full justify-center flex items-center relative">
              {image_url && (
                <Image
                  alt="profile image"
                  src={image_url}
                  className="rounded-full min-w-20 h-20 object-contain"
                  layout="fill"
                />
              )}
            </div>
            <div className="flex flex-col sm:ml-6 ml-3 w-3/4 sm:w-full">
              <div className="flex justify-between">
                <span className="text-darkblueui text-xl font-bold hover:underline">
                  {name}
                </span>
                <button
                  className="rounded-full flex justify-center items-center"
                  onClick={handleProfileClose}
                >
                  <CrossSvg />
                </button>
              </div>
              <div className="flex items-center">
                <Star size={16} className="text-[#FFD700]" />
                <p className="ml-1 text-xs text-darkblueui">
                  {ratingData?.review_count > 0 ? (
                    <>
                      {ratingData?.average_score}
                      <span className="">
                        ({ratingData?.review_count} reviews)
                      </span>
                    </>
                  ) : (
                    "Not Rated"
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                {topics?.map((topic, ind) => {
                  return (
                    <div
                      key={ind}
                      className="flex bg-[#d7e3f4] rounded-full justify-center items-center mt-2  text-darkblueui min-w-24 text-[10px] sm:text-xs sm:min-w-28 h-6 px-3"
                    >
                      {topic}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex sm:flex-row flex-col sm:w-3/4 h-full justify-center items-center mt-5">
            <div className="flex flex-col sm:h-48 sm:w-3/4 w-full">
              <span className="text-darkblueui font-bold text-lg">
                Biography
              </span>
              <p className="text-darkblueui text-sm mt-4 pr-2">{bio}</p>
            </div>
            <div className="flex flex-col sm:h-40 sm:w-1/2 w-full sm:ml-4 mt-4 sm:mt-1">
              <span className="text-darkblueui font-bold text-lg sm:-mt-4">
                Expertise
              </span>
              <div className="flex flex-col mt-2">
                <p className="text-darkblueui text-sm">{expertise}</p>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-end mt-5">
            <button
              className="bg-darkblueui px-5 h-9 rounded-full flex text-white text-sm items-center"
              onClick={handleProfileClose}
            >
              Send Message
              <ArrowIconWhite />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeProfile;
