import React, { useEffect, useState } from "react";
import { Navbar, QuickLinks, SearchPage, SelectFilter } from "@/components";
import withAuth from "@/components/withAuth/withAuth";
import { useRouter } from "next/router";
import { createClient } from "@/utils/supabase/client";
import { SearchUserData, User } from "@/types";
import { useSearchUserStore } from "@/stores/searchUsersStore";
import LayoutWrapper from "@/components/Layout";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { SelectFilterRating } from "@/components/SelectFilter/SelectFilterRating";
import ToasterTitle from "@/components/ui/toaster-title";
import { useToast } from "@/components/ui/use-toast";
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

  const { setUsers, setLoading, users } = useSearchUserStore();

  const router = useRouter();

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

  const handleInputChange = (value: string) => {
    setSearchTerm(value);

    // If we're showing results, perform search on input change (debounced in SearchPage)
    if (showResults) {
      performSearch(value);
    }
  };

  const supabase = createClient();

  const { toast } = useToast();

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
      toast({
        title: <ToasterTitle title="Error" type="error" />,
        description: "Error fetching teachers",
      });
      setLoading(false);
      return null;
    }

    setLoading(false);
    return data;
  };

  // Perform search with current filters
  const performSearch = async (search: string = searchTerm) => {
    setLoading(true);

    const startPrice = filterPrice.split("-")[0];
    const endPrice = filterPrice.split("-")[1];
    const startRating = filterRating.split("-")[0];
    const endRating = filterRating.split("-")[1];

    // Update URL
    const queryParams: any = {
      starting_price: startPrice,
      ending_price: endPrice,
      starting_rating: startRating,
      ending_rating: endRating,
    };

    if (selectedTopics.length > 0) {
      queryParams.selectedTopics = selectedTopics.join(",");
    }

    if (search.trim()) {
      queryParams.searchTerm = search.trim();
    }

    router.push(
      {
        query: queryParams,
      },
      undefined,
      { shallow: true },
    );

    const data = await searchTeachers({
      search: search.trim(),
      selectedTopics,
      startPrice,
      endPrice,
      startRating,
      endRating,
    });

    setUsers(data as SearchUserData[]);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowResults(true);
    performSearch();
  };

  // Reset search state when no query parameters are present
  const resetSearchState = () => {
    setSearchTerm("");
    setFilterPrice("");
    setFilterRating("");
    setSelectedTopics([]);
    setShowResults(false);
    setUsers([]);
  };

  // Handle initial load and URL parameter changes
  useEffect(() => {
    if (!router.isReady) return;

    // Check if there are any query parameters
    const hasQueryParams = Object.keys(router.query).length > 0;

    if (!hasQueryParams) {
      resetSearchState();
      return;
    }

    // If there's no searchTerm but there are other filters, still show results
    const hasFilters =
      router.query.starting_price ||
      router.query.ending_price ||
      router.query.starting_rating ||
      router.query.ending_rating ||
      router.query.selectedTopics;

    if (!router.query.searchTerm && !hasFilters) {
      setShowResults(false);
      return;
    }

    // Only set loading on initial load or when URL parameters change
    if (isInitialLoad) {
      setLoading(true);
      setIsInitialLoad(false);
    }

    // Set state from URL parameters
    setSearchTerm((router.query?.searchTerm as string) || "");
    setFilterPrice(
      `${router.query?.starting_price || ""}-${
        router.query?.ending_price || ""
      }`,
    );
    setFilterRating(
      `${router.query?.starting_rating || ""}-${
        router.query?.ending_rating || ""
      }`,
    );

    // Only set selectedTopics if the query parameter exists and is not empty
    if (
      router.query?.selectedTopics &&
      (router.query.selectedTopics as string) !== ""
    ) {
      setSelectedTopics((router.query.selectedTopics as string).split(","));
    } else {
      setSelectedTopics([]);
    }

    setShowResults(true);

    // Only fetch data when URL parameters change
    (async () => {
      const data = await searchTeachers({
        search: (router.query?.searchTerm as string) || "",
        selectedTopics:
          (router.query?.selectedTopics as string)
            ?.split(",")
            .filter(Boolean) || [],
        startPrice: (router.query?.starting_price as string) || "",
        endPrice: (router.query?.ending_price as string) || "",
        startRating: (router.query?.starting_rating as string) || "",
        endRating: (router.query?.ending_rating as string) || "",
      });
      setUsers(data as SearchUserData[]);
    })();
  }, [router.isReady, router.query]);

  return (
    <LayoutWrapper>
      {!showResults ? (
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl space-y-12"
          >
            <div className="space-y-4 text-center">
              <h1 className="text-5xl font-bold leading-tight text-[#1e1e4a]">
                Discover Your Next{" "}
                <span className="text-primary-blue">Learning Adventure</span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl text-gray-600">
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
                className="w-full rounded-full border-2 border-[#1e1e4a] py-6 pl-12 pr-4 text-lg transition-all duration-300 focus:border-transparent focus:ring-2 focus:ring-primary-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-gray-400" />
              <Button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 transform rounded-full bg-[#1e1e4a] px-6 py-6 text-lg text-white transition-all duration-300 hover:bg-primary-blue"
              >
                Search
              </Button>
            </motion.form>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-wrap items-end justify-center gap-6"
            >
              <div className="flex w-full gap-4 sm:w-auto">
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
            <h2 className="mb-4 text-2xl font-semibold text-[#1e1e4a]">
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
                    className={`rounded-full border-2 border-primary-blue px-4 py-2 text-primary-blue transition-all duration-300 ${
                      selectedTopics.includes(topic)
                        ? "bg-primary-blue text-white"
                        : "hover:bg-primary-blue hover:text-white"
                    }`}
                    onClick={() => {
                      if (selectedTopics.includes(topic)) {
                        setSelectedTopics((prev) =>
                          prev.filter((val) => val !== topic),
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
