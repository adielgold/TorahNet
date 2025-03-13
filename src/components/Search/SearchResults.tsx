import React from "react";
import SearchResultCard from "./SearchResultCard";
import { useSearchUserStore } from "@/stores/searchUsersStore";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, SearchX } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";

const SearchResults = () => {
  const { users } = useSearchUserStore();
  const router = useRouter();

  // Determine if we have any active filters
  const hasFilters = () => {
    return (
      router.query.starting_price ||
      router.query.ending_price ||
      router.query.starting_rating ||
      router.query.ending_rating ||
      router.query.selectedTopics
    );
  };

  // Get a message based on the current search context
  const getNoResultsMessage = () => {
    if (router.query.searchTerm && hasFilters()) {
      return "We couldn't find any matches for your search and filters. Try adjusting your search terms or filters.";
    } else if (router.query.searchTerm) {
      return "We couldn't find any matches for your search. Try a different search term.";
    } else if (hasFilters()) {
      return "No results match your current filters. Try adjusting your filter settings.";
    } else {
      return "No results found. Try a different search or filter combination.";
    }
  };

  // Clear all filters and search terms
  const handleClearAll = () => {
    router.push("/search", undefined, { shallow: true });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {users && users.length > 0 ? (
        <>
          {users.map((user, ind) => (
            <SearchResultCard key={user.id} {...user} index={ind} />
          ))}
        </>
      ) : (
        <Card className="col-span-2 mx-auto mt-12 w-full">
          <CardContent className="flex flex-col items-center p-6 text-center">
            <SearchX className="mb-4 h-16 w-16 text-gray-400" />
            <h2 className="mb-2 text-2xl font-semibold text-gray-700">
              No results found
            </h2>
            <p className="mb-6 text-gray-500">{getNoResultsMessage()}</p>
            {(router.query.searchTerm || hasFilters()) && (
              <Button
                onClick={handleClearAll}
                className="flex items-center gap-2 bg-[#1e1e4a] text-white hover:bg-[#2a2a5a]"
              >
                <RefreshCw className="h-4 w-4" />
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
