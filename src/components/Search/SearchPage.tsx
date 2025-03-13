/* eslint-disable react/no-unescaped-entities */
import React, { useEffect } from "react";
import QuickLinksCard from "../QuickLinks/QuickLinksCard";
import { CrossSvg } from "@/Icons";
import SearchResults from "./SearchResults";
import SliderComponent from "../Slider/SliderComponent";
import { useSearchUserStore } from "@/stores/searchUsersStore";
import { motion } from "framer-motion";
import { Input } from "../ui/input";
import { Loader, Search } from "lucide-react";
import { Button } from "../ui/button";

type SearchPageProps = {
  searchTerm: string;
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
  filterRating: string;
  setFilterRating: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (value: string) => void;
};

const SearchPage = ({
  searchTerm,
  filterPrice,
  setFilterPrice,
  handleInputChange,
  filterRating,
  setFilterRating,
  selectedTopics,
}: SearchPageProps) => {
  const { loading, users } = useSearchUserStore();

  const [inputValue, setInputValue] = React.useState(searchTerm);

  // Update local input value when searchTerm prop changes
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Debounce search input changes
  useEffect(() => {
    // Skip the initial render when inputValue is set from props
    if (inputValue === searchTerm) return;

    const handler = setTimeout(() => {
      handleInputChange(inputValue);
    }, 500); // Debounce time of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, handleInputChange, searchTerm]);

  // Determine what to display in the search results heading
  const getSearchHeading = () => {
    if (searchTerm) {
      return `Search results for: "${searchTerm}"`;
    } else if (
      filterPrice ||
      filterRating ||
      (selectedTopics && selectedTopics.length > 0)
    ) {
      return "Filtered results";
    } else {
      return "All results";
    }
  };

  return (
    <main className="mx-auto max-w-6xl flex-1 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-4 text-4xl font-bold text-[#1e1e4a]">
          {getSearchHeading()}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative max-w-xl flex-grow">
            <Input
              type="text"
              placeholder="Refine your search..."
              className="rounded-full border-2 border-[#1e1e4a] py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-[#4a4ae3]"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          </div>

          <div className="flex w-full flex-col">
            <p className="text-md mb-10 text-darkblueui">Price Range</p>
            <SliderComponent
              filterPrice={filterPrice}
              setFilterPrice={setFilterPrice}
              max={100}
              type="price"
            />
          </div>
          <div className="flex w-full flex-col">
            <p className="text-md mb-10 text-darkblueui">Ratings</p>
            <SliderComponent
              filterPrice={filterRating}
              setFilterPrice={setFilterRating}
              max={5}
            />
          </div>

          {/* <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 bg-white text-[#1e1e4a] border-2 border-[#1e1e4a] hover:bg-[#1e1e4a] hover:text-white transition-colors duration-300"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </Button> */}
        </div>
      </motion.div>

      {/* <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-[#1e1e4a] mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="price-range" className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <Slider
                      id="price-range"
                      min={0}
                      max={100}
                      step={1}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="w-full max-w-md"
                    />
                  </div>
                  <div>
                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-2">
                      Expertise
                    </label>
                    <Input id="expertise" placeholder="e.g. React, Python, UX Design" />
                  </div>
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <Select>
                      <SelectTrigger id="rating">
                        <SelectValue placeholder="Select minimum rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 stars and above</SelectItem>
                        <SelectItem value="4">4 stars and above</SelectItem>
                        <SelectItem value="4.5">4.5 stars and above</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full sm:w-auto bg-[#1e1e4a] hover:bg-[#2a2a5a] text-white">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}

      {loading ? (
        <div className="flex items-center justify-center">
          <Loader className="h-10 w-10 animate-spin text-primary-blue" />
        </div>
      ) : (
        <SearchResults />
      )}
    </main>

    // <section className="w-full h-full flex flex-col sm:py-10">
    //   <div className="flex flex-col justify-center items-center w-full h-full">
    //     <span className="text-2xl font-bold text-darkblueui">
    //       Search results for:
    //     </span>
    //     <span className="text-2xl font-bold text-blueui">"{searchTerm}"</span>
    //     {selectedTopics?.filter((val) => val !== "")?.length > 0 ||
    //       (filterPrice?.length > 1 && (
    //         <span className="font-bold text-darkblueui text-base mt-6">
    //           Applied filters:
    //         </span>
    //       ))}
    //     <div className="flex sm:w-1/2 justify-center items-center mt-3 ">
    //       <div className="flex sm:flex-row flex-col justify-center flex-wrap gap-1 max-w-[560px] mx-auto">
    //         {selectedTopics?.filter((val) => val !== "")?.length > 0 &&
    //           selectedTopics.map((topic, index) => (
    //             <QuickLinksCard
    //               key={index}
    //               textSize="sm"
    //               title={`Topic: ${topic}`}
    //               customClasses="min-w-min"
    //               svg={CrossSvg}
    //             />
    //           ))}
    //         {filterPrice?.length > 1 && (
    //           <QuickLinksCard
    //             textSize="sm"
    //             title={`Price Range: ${filterPrice}`}
    //           />
    //         )}
    //       </div>
    //     </div>
    //     <div className="w-full flex flex-col sm:mt-14 mt-7 justify-center items-center">
    //       <p className="mb-10 text-darkblueui text-sm">Price Range</p>
    //       <SliderComponent
    //         filterPrice={filterPrice}
    //         setFilterPrice={setFilterPrice}
    //       />
    //     </div>
    //     {loading ? (
    //       <div className="mx-auto flex justify-center  mt-6 min-h-[50vh] ">
    //         <div className="basic-large"></div>
    //       </div>
    //     ) : (
    //       <SearchResults />
    //     )}
    //   </div>
    // </section>
  );
};

export default SearchPage;
