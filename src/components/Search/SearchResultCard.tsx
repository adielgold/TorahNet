import React, { use, useEffect, useState } from "react";
import QuickLinksCard from "../QuickLinks/QuickLinksCard";
import { ArrowIconWhite, LittleStar } from "@/Icons";
import SendMessage from "./SendMessage";
import { SearchUserData, User } from "@/types";
import Image from "next/image";
import { getUserReviewData } from "@/lib/utils";
import { Star } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

const SearchResultCard = ({
  name,
  bio,
  email,
  expertise,
  id,
  topics,
  role,
  avg_rating,
  hourly_rate,
  image_url,
  index,
  available_hours,
}: SearchUserData & { index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [ratingData, setRatingData] = useState<any>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      const d = await getUserReviewData(id);
      setRatingData(d?.data || null);
    })();
  }, [id]);

  return (
    <>
      <motion.div
        // key={teacher.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * (index % 4), duration: 0.5 }}
      >
        <Card className="transform overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-[#1e1e4a]">
                <AvatarImage src={image_url!} alt={name!} />
                <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold text-[#1e1e4a]">{name}</h2>
                <div className="flex items-center">
                  <Star className="mr-1 h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-gray-600">
                    {ratingData?.review_count > 0 ? (
                      <>
                        {ratingData?.average_score?.toFixed(2)}
                        <span className="ml-1 underline">
                          ({ratingData?.review_count} reviews)
                        </span>
                      </>
                    ) : (
                      "Not Rated"
                    )}
                    {/* {rating.toFixed(2)} ({teacher.reviews} reviews) */}
                  </span>
                </div>
              </div>
            </div>
            <p className="mb-4 line-clamp-2 text-gray-600">{bio}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {topics?.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#e0e0ff] text-[#1e1e4a]"
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-[#1e1e4a]">
                ${hourly_rate}/hour
              </span>
              <Button
                onClick={() => setIsOpen(true)}
                className="bg-[#1e1e4a] text-white transition-colors duration-300 hover:bg-[#2a2a5a]"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* <div className="shadowprofile sm:mt-8 mt-4 bg-white sm:w-[670px] sm:min-h-60 py-4 min-h-80 rounded-lg flex justify-center items-center px-3">
        <div className="flex sm:flex-row flex-col justify-center sm:items-center items-start">
          <div className="sm:w-28 sm:h-28 w-20 h-20 bg-[#D7E3F4] rounded-full justify-center flex items-center relative">
            {image_url && (
              <Image
                alt="profile image"
                src={image_url}
                className="rounded-full sm:w-28 sm:h-28 w-20 h-20 object-contain"
                layout="fill"
              />
            )}
          </div>
          <div className="flex flex-col sm:ml-5 sm:w-3/4 w-full mt-5 sm:mt-0 ">
            <button className="justify-start flex" onClick={handleOpen}>
              <span className="text-darkblueui text-xl font-bold hover:underline">
                {name}
              </span>
            </button>
            <div className="flex">
              <Star size={16} className="text-[#FFD700]" />
              <p className="ml-1 text-xs text-darkblueui">
                {ratingData?.review_count > 0 ? (
                  <>
                    {ratingData?.average_score}
                    <span className="underline ml-1">
                      ({ratingData?.review_count} reviews)
                    </span>
                  </>
                ) : (
                  "Not Rated"
                )}
              </p>
            </div>
            <p className="text-darkblueui text-sm my-1">{bio}</p>
            <div className="flex sm:items-center sm:w-3/4 sm:flex-wrap flex-wrap gap-1.5">
              {topics?.map((topic, ind) => {
                return (
                  <div
                    key={ind}
                    className="flex bg-[#d7e3f4] rounded-full justify-center items-center mt-2  text-darkblueui text-xs min-w-28 px-3 h-6"
                  >
                    {topic}
                  </div>
                );
              })}
              <div className="flex bg-[#d7e3f4] rounded-full justify-center items-center mt-2  text-darkblueui text-xs px-4 h-6 whitespace-nowrap">
                Hourly Rate: ${payment_details?.hourly_rate}
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {isOpen && (
        <AnimatePresence>
          <SendMessage
            bio={bio}
            email={email}
            expertise={expertise}
            id={id}
            name={name}
            role={role}
            topics={topics}
            avg_rating={avg_rating}
            hourly_rate={hourly_rate}
            image_url={image_url}
            handleClose={handleClose}
            ratingData={ratingData}
            available_hours={available_hours}
          />
        </AnimatePresence>
      )}
    </>
  );
};

export default SearchResultCard;
