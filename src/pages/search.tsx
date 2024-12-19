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

interface SearchTeacherProps {
  search: string;
  selectedTopics: string[];
  startPrice: string;
  endPrice: string;
}

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [filterPrice, setFilterPrice] = useState("");

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
  }: SearchTeacherProps) => {
    let query = supabase
      .from("users")
      .select(
        `
      *,
      payment_details!inner(hourly_rate)
    `
      )
      .ilike("name", `%${search}%`)
      .eq("role", "teacher");

    if (
      selectedTopics &&
      selectedTopics?.filter((val) => val !== "").length > 0
    ) {
      query = query.or(
        selectedTopics.map((topic) => `topics.cs.{${topic}}`).join(",")
      );
    }

    if (startPrice !== "" && endPrice !== "") {
      query = query
        .gte("payment_details.hourly_rate", startPrice)
        .lte("payment_details.hourly_rate", endPrice);
    }

    const { data, error } = await query;

    console.log(data, "Data");

    if (error) {
      console.log(error, "Error");
      toast.error("Error fetching data");
      setLoading(false);
      return null;
    }

    setLoading(false);

    return data;
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const search = searchTerm.trim();
    const startPrice = filterPrice.split("-")[0];
    const endPrice = filterPrice.split("-")[1];
    router.push(
      {
        query: {
          searchTerm: search,
          starting_price: startPrice,
          ending_price: endPrice,
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
    });

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
        },
      },
      undefined,
      { shallow: true }
    );
  }, [filterPrice, searchTerm]);

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
                placeholder="What would you like to learn today?"
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
              <div className="w-full sm:w-auto space-y-2">
                {/* <Label
                  htmlFor="price-range"
                  className="text-sm font-medium text-gray-700 block"
                >
                  Price Range
                </Label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-semibold text-[#1e1e4a]">
                    ${priceRange[0]}
                  </span>
                  <Slider
                    id="price-range"
                    min={0}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="w-[200px]"
                  />
                  <span className="text-lg font-semibold text-[#1e1e4a]">
                    ${priceRange[1]}
                  </span>
                </div> */}

                <SelectFilter
                  filterPrice={filterPrice}
                  setFilterPrice={setFilterPrice}
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
        />
      )}
    </LayoutWrapper>

    // <section className="w-full h-screen flex flex-col">
    //   <div className="hidden sm:flex">
    //     <Navbar />
    //   </div>
    //   <div className="flex flex-col justify-center items-center mt-auto mb-auto">
    //     {!showResults && (
    //       <>
    //         <div className="flex flex-col justify-center items-center mt-20 text-center sm:w-full w-3/4">
    //           <h1 className="text-darkblueui font-bold text-3xl">
    //             What do you want to learn?
    //           </h1>
    //           <p className="text-darkblueui font-normal text-sm text-center">
    //             Search topics, teachers and price ranges about anything you{" "}
    //             <br className="hidden sm:flex" /> want to learn.
    //           </p>
    //         </div>
    //         <div className="border-2 border-[#d7e3f4] rounded-full sm:w-96 mt-8 mx-auto">
    //           <form className="w-full max-w-sm" onSubmit={handleFormSubmit}>
    //             <div className="flex justify-center items-center py-1">
    //               <input
    //                 className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-3 leading-tight focus:outline-none"
    //                 type="text"
    //                 placeholder=""
    //                 value={searchTerm}
    //                 onChange={handleInputChange}
    //               />
    //               <button
    //                 className="flex-shrink-0 bg-darkblueui text-sm text-white py-2 px-4 rounded-full mr-1 hover:bg-blueui"
    //                 type="submit"
    //               >
    //                 Search
    //               </button>
    //             </div>
    //           </form>
    //         </div>
    //         <div className="flex mt-4 justify-center">
    //           <SelectFilter
    //             filterPrice={filterPrice}
    //             setFilterPrice={setFilterPrice}
    //           />
    //         </div>
    //         <div className="mt-4 flex flex-col min-h-[100px] px-4">
    //           <span className="text-center text-lg">Select Topics</span>
    //           <QuickLinks
    //             selectedTopics={selectedTopics}
    //             setSelectedTopics={setSelectedTopics}
    //           />
    //         </div>
    //       </>
    //     )}
    //     {showResults && (
    //       <SearchPage
    //         searchTerm={searchTerm}
    //         filterPrice={filterPrice}
    //         selectedTopics={selectedTopics}
    //         setFilterPrice={setFilterPrice}
    //         setSelectedTopics={setSelectedTopics}
    //       />
    //     )}
    //   </div>
    //   <div className="sm:hidden flex h-full items-end pb-4">
    //     <Navbar />
    //   </div>
    // </section>
  );
};

export default withAuth(Search);
