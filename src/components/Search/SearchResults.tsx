import React from "react";
import SearchResultCard from "./SearchResultCard";
import { useSearchUserStore } from "@/stores/searchUsersStore";
import { Card, CardContent } from "../ui/card";
import { RefreshCw, SearchX } from "lucide-react";
import { Button } from "../ui/button";

const SearchResults = () => {
  const { users } = useSearchUserStore();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
      {users && users?.length > 0 ? (
        <>
          {users?.map((user, ind) => (
            <SearchResultCard key={user.id} {...user} index={ind} />
          ))}
        </>
      ) : (
        <Card className="w-full  mx-auto mt-12 col-span-2">
          <CardContent className="flex flex-col items-center text-center p-6">
            <SearchX className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No results found
            </h2>
            <p className="text-gray-500 mb-6">
              We couldnt find any matches for your search. Try adjusting your
              filters or search terms.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchResults;
