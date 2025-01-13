import React, { useEffect, useState } from "react";
import { CiStar } from "react-icons/ci";
import QuickLinksCard from "../QuickLinks/QuickLinksCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";
import { ArrowIconWhite } from "@/Icons";
import { FaAngleDown } from "react-icons/fa6";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "../ui/use-toast";
import { User } from "@/types";
import { useUserStore } from "@/stores/userStore";
import LayoutWrapper from "../Layout";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronDown, ChevronUp, Loader, Send, Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Textarea } from "../ui/textarea";

const feedbackItems = [
  "Laudantium Non Provident",
  "Quis Porro Est",
  "Voluptatibus Enim",
  "Lorem Ipsum",
  "Dolor Sit Amet",
  "Conseteur Amis",
];

const Rating = () => {
  const [clickedStars, setClickedStars] = useState(0);

  const [loading, setLoading] = useState(false);

  const [showPersonalFeedback, setShowPersonalFeedback] = useState(false);

  const [personalFeedback, setPersonalFeedback] = useState<string>("");

  const [feedbackImprovements, setFeedbackImprovements] = useState<string[]>(
    []
  );

  const [teacher, setTeacher] = useState<User | null>(null);

  const handleClick = (index: number) => {
    setClickedStars(index + 1);
  };

  const { user } = useUserStore();

  const router = useRouter();

  const supabase = createClient();

  const { toast } = useToast();

  useEffect(() => {
    if (!router?.query?.teacherId) return;

    (async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", router.query.teacherId as string)
        .single();
      if (error) {
        console.log(error, "Error getting user");
        toast({
          title: "Error",
          description: "Error getting teacher Info",
          variant: "destructive",
        });
        return;
      }
      setTeacher(data);
    })();
  }, []);

  const submitFeedback = async () => {
    setLoading(true);

    const { data, error } = await supabase.from("reviews").insert({
      teacher_id: router.query.teacherId as string,
      student_id: user?.id!,
      feedbacks: feedbackImprovements,
      personal_feedback: personalFeedback,
      stars: clickedStars,
    });

    if (error) {
      console.log(error, "Error inserting feedback");
      toast({
        title: "Error",
        description: "Error submitting feedback",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: "Feedback has been submitted successfully",
    });

    setLoading(false);

    router.replace("/profile/dashboard");
  };

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedFeedback, setSelectedFeedback] = useState<string[]>([]);
  const [isPersonalFeedbackOpen, setIsPersonalFeedbackOpen] = useState(false);

  const handleRatingChange = (value: number) => {
    setClickedStars(value);
  };

  console.log(clickedStars, "Clicked Stars");

  const toggleFeedbackOption = (option: string) => {
    setSelectedFeedback((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  return (
    <LayoutWrapper>
      <div className="min-h-[90vh] flex items-center justify-center">
        <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-md shadow-xl">
          <CardHeader className="relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
            <CardTitle className="text-3xl font-bold text-center text-[#1e1e4a] mt-4">
              How was your experience?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Avatar className="w-32 h-32 mb-4 ring-4 ring-[#1e1e4a] ring-offset-2">
                <AvatarImage src={teacher?.image_url!} alt="Muhammad Rayyaan" />
                <AvatarFallback>{teacher?.name}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold text-[#1e1e4a]">
                {teacher?.name}
              </h2>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-center text-gray-600 font-medium">
                How many stars do you give?
              </p>
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    className="focus:outline-none transform transition-transform duration-200"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => handleRatingChange(star)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-12 h-12 ${
                        star <= (hoveredRating || clickedStars)
                          ? "text-yellow-400 fill-yellow-400 drop-shadow-lg"
                          : "text-gray-300"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <p className="text-center text-gray-600 font-medium">
                Any quick feedback to help Dolor Sit Amet?
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {feedbackItems.map((option, index) => (
                  <motion.div
                    key={option}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <Badge
                      variant={
                        feedbackImprovements.includes(option)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer text-sm px-3 py-1 ${
                        feedbackImprovements.includes(option)
                          ? "bg-[#4a4ae3] hover:bg-[#3a3ad3] text-white"
                          : "bg-white text-[#1e1e4a] hover:bg-[#1e1e4a] hover:text-white"
                      }`}
                      onClick={() => {
                        if (feedbackImprovements.includes(option)) {
                          setFeedbackImprovements((prev) =>
                            prev.filter((i) => i !== option)
                          );
                        } else {
                          setFeedbackImprovements((prev) => [...prev, option]);
                        }
                      }}
                    >
                      {option}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Button
                variant="outline"
                className="w-full text-[#1e1e4a] border-[#1e1e4a] hover:bg-[#1e1e4a] hover:text-white transition-colors duration-300"
                onClick={() =>
                  setIsPersonalFeedbackOpen(!isPersonalFeedbackOpen)
                }
              >
                {isPersonalFeedbackOpen
                  ? "Hide personal feedback"
                  : "Write personal feedback"}
                {isPersonalFeedbackOpen ? (
                  <ChevronUp className="ml-2 h-4 w-4" />
                ) : (
                  <ChevronDown className="ml-2 h-4 w-4" />
                )}
              </Button>
              <AnimatePresence>
                {isPersonalFeedbackOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Textarea
                      className="mt-4 border-[#1e1e4a] focus:ring-[#4a4ae3]"
                      placeholder="Share your thoughts..."
                      value={personalFeedback}
                      onChange={(e) => setPersonalFeedback(e.target.value)}
                      rows={4}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={submitFeedback}
              disabled={loading}
              className="w-full bg-primary-blue hover:bg-primary-blue text-white font-semibold py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Submit Review
              {loading ? (
                <Loader className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Send className="ml-2 h-5 w-5" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </LayoutWrapper>
  );
};

export default Rating;
