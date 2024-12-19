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
  handleInputChange: (value: string) => void;
};

const SearchPage = ({
  searchTerm,
  selectedTopics,
  filterPrice,
  setFilterPrice,
  setSelectedTopics,
  handleInputChange,
}: SearchPageProps) => {
  const { loading } = useSearchUserStore();

  const [inputValue, setInputValue] = React.useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleInputChange(inputValue);
    }, 1000); // Debounce time of 1000ms

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, handleInputChange]);

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-[#1e1e4a] mb-4">
          Search results for: &quot;{searchTerm}&quot;
        </h1>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-grow max-w-xl">
            <Input
              type="text"
              placeholder="Refine your search..."
              className="pl-10 pr-4 py-2 rounded-full border-2 border-[#1e1e4a] focus:ring-2 focus:ring-[#4a4ae3] focus:border-transparent"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="w-full flex flex-col  ">
            <p className="mb-10 text-darkblueui text-md">Price Range</p>
            <SliderComponent
              filterPrice={filterPrice}
              setFilterPrice={setFilterPrice}
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
          <Loader className="animate-spin w-10 h-10 text-primary-blue" />
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
