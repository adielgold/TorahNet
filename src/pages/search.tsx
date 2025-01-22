import React, { useEffect, useState } from "react";
import { Navbar, QuickLinks, SearchPage, SelectFilter } from "@/components";
import withAuth from "@/components/withAuth/withAuth";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import { SearchUserData, User } from "@/types";
import { useSearchUserStore } from "@/stores/searchUsersStore";
import LayoutWrapper from "@/components/Layout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { SelectFilterRating } from "@/components/SelectFilter/SelectFilterRating";

interface SearchTeacherProps {
  search: string;
  selectedTopics: string[];
  startPrice: string;
  endPrice: string;
  startRating: string;
  endRating: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filterPrice, setFilterPrice] = useState("");
    const [filterRating, setFilterRating] = useState("");

  const { setUsers, setLoading } = useSearchUserStore();

  const router = useRouter();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const topics = [
    "Mathematics",
    "Science",
    "History",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "Geography",
  ];

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
  };

  const supabase = createClient();

  const searchTeachers = async ({
    search,
    endPrice,
    selectedTopics,
    startPrice,
    startRating,
    endRating,
  }: SearchTeacherProps) => {
   

     const { data, error } = await supabase.rpc("search_teachers", {
    search: search || undefined,
    selected_topics: selectedTopics?.length ? selectedTopics : undefined,
    start_price: +startPrice || undefined,
    end_price: +endPrice || undefined,
    start_rating: +startRating || undefined,
    end_rating: +endRating || undefined,
  });

  
    if (error) {
      toast.error("Error fetching data");
      setLoading(false);
      return null;
    }

    setLoading(false);


  return data;

    
  };

  console.log(filterRating, "Filter Rating");

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const search = searchTerm.trim();
    const startPrice = filterPrice.split("-")[0];
    const endPrice = filterPrice.split("-")[1];
        const startRating = filterRating.split("-")[0];
    const endRating = filterRating.split("-")[1];
    router.push(
      {
        query: {
          searchTerm: search,
          starting_price: startPrice,
          ending_price: endPrice,
              starting_rating: startRating,
          ending_rating: endRating,
          selectedTopics: selectedTopics?.join(","),
        },
      },
      undefined,
      { shallow: true }
    );

    setShowResults(true);

    const data = await searchTeachers({
      search,
      selectedTopics,
      startPrice,
      endPrice,
      startRating,
      endRating,
    });

    // 

    setUsers(data);
  };

  useEffect(() => {
    if (!router.query?.searchTerm) {
      setShowResults(false);
      return;
    }

    setLoading(true);

    setSearchTerm((router.query?.searchTerm as string) || "");
    setFilterPrice(
      `${router.query?.starting_price || ""}-${
        router.query?.ending_price || ""
      }`
    );
     setFilterRating(
      `${router.query?.starting_rating || ""}-${
        router.query?.ending_rating || ""
      }`
    );
    setSelectedTopics(
      ((router.query?.selectedTopics as string) || "").split(",")
    );
    setShowResults(true);

    (async () => {
      const data = await searchTeachers({
        search: router.query?.searchTerm as string,
        selectedTopics:
          (router.query?.selectedTopics as string)?.split(",") || [],
        startPrice: router.query?.starting_price as string,
        endPrice: router.query?.ending_price as string,
         startRating: router.query?.starting_rating as string,
        endRating: router.query?.ending_rating as string,
      });
      setUsers(data);
    })();
  }, [router.query]);

  useEffect(() => {
    router.push(
      {
        query: {
          ...router.query,
          searchTerm,
          starting_price: filterPrice.split("-")[0],
          ending_price: filterPrice.split("-")[1],
                    starting_rating: filterRating.split("-")[0],
          ending_rating: filterRating.split("-")[1],
        },
      },
      undefined,
      { shallow: true }
    );
  }, [filterPrice, searchTerm, filterRating]);


  return (
    <LayoutWrapper>
      {!showResults ? (
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl space-y-12"
          >
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-bold text-[#1e1e4a] leading-tight">
                Discover Your Next{" "}
                <span className="text-primary-blue">Learning Adventure</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore a world of knowledge with expert teachers and engaging
                courses.
              </p>
            </div>
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative"
              onSubmit={handleFormSubmit}
            >
              <Input
                type="text"
                placeholder="Search The Teachers By Name..."
                className="w-full pl-12 pr-4 py-6 text-lg rounded-full border-2 border-[#1e1e4a] focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-300"
                value={searchTerm}
                onChange={(e) => handleInputChange(e.target.value)}
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              <Button
                type="submit"
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#1e1e4a] hover:bg-primary-blue text-white rounded-full px-6 py-6 text-lg transition-all duration-300"
              >
                Search
              </Button>
            </motion.form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap gap-6 justify-center items-end"
            >
              <div className="w-full sm:w-auto  flex gap-4">
                <SelectFilter
                  filterPrice={filterPrice}
                  setFilterPrice={setFilterPrice}
                />
                 <SelectFilterRating
                  filterRating={filterRating}
                  setFilterRating={setFilterRating}
                />
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-16 w-full max-w-4xl"
          >
            <h2 className="text-2xl font-semibold text-[#1e1e4a] mb-4">
              Popular Topics
            </h2>
            <div className="flex flex-wrap gap-3">
              {topics?.map((topic, index) => (
                <motion.div
                  key={topic}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                >
                  <Button
                    variant="outline"
                    className={`rounded-full px-4 py-2 border-2 border-primary-blue text-primary-blue  transition-all duration-300 ${
                      selectedTopics.includes(topic)
                        ? "bg-primary-blue text-white"
                        : "hover:bg-primary-blue hover:text-white"
                    }`}
                    onClick={() => {
                      if (selectedTopics.includes(topic)) {
                        setSelectedTopics((prev) =>
                          prev.filter((val) => val !== topic)
                        );
                      } else {
                        setSelectedTopics((prev) => [...prev, topic]);
                      }
                    }}
                  >
                    {topic}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      ) : (
        <SearchPage
          searchTerm={searchTerm}
          filterPrice={filterPrice}
          selectedTopics={selectedTopics}
          setFilterPrice={setFilterPrice}
          setSelectedTopics={setSelectedTopics}
          handleInputChange={handleInputChange}
          filterRating={filterRating}
          setFilterRating={setFilterRating}
        />
      )}
    </LayoutWrapper>

  );
};

export default withAuth(Search);
