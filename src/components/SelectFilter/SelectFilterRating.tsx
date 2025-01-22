import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectFilterRatingProps {
  filterRating: string;
  setFilterRating: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectFilterRating({
  filterRating,
  setFilterRating,
}: SelectFilterRatingProps) {
  return (
    <div className="flex">
      <div className="flex w-full">
        <Select
          onValueChange={(val) => {
            setFilterRating(val);
          }}
          value={filterRating}
        >
          <SelectTrigger className=" w-full sm:w-36   h-[40px] text-xs sm:text-base border border-primary-blue bg-white bg-opacity-70 text-darkblueui">
            <SelectValue placeholder="By Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ratings</SelectLabel>
              <SelectItem value="0-0">Not Rated</SelectItem>
              <SelectItem value="0-1">0-1</SelectItem>
              <SelectItem value="1-2">1-2</SelectItem>
              <SelectItem value="2-3">2-3</SelectItem>
              <SelectItem value="3-4">3-4</SelectItem>
              <SelectItem value="4-5">4+</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
