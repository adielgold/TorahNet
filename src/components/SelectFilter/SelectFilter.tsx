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

interface SelectFilterProps {
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectFilter({
  filterPrice,
  setFilterPrice,
}: SelectFilterProps) {
  return (
    <div className="flex">
      {/* <div className="flex">
        <Select>
          <SelectTrigger className="w-20 h-6 sm:w-[100px] sm:h-[30px] text-xs sm:text-base border border-[#8eaedf] bg-[#d7e3f4] bg-opacity-70 outline-none text-darkblueui ">
            <SelectValue placeholder="Topics" className="" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Topics</SelectLabel>
              <SelectItem value="1">Lorem ipsum dolor </SelectItem>
              <SelectItem value="2">Lorem ipsum dolor </SelectItem>
              <SelectItem value="3">Lorem ipsum dolor </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      {/* <div className="flex ml-2">
        <Select>
          <SelectTrigger className="w-20 h-6 sm:w-[100px] sm:h-[30px] text-xs sm:text-base border border-[#8eaedf] bg-[#d7e3f4] bg-opacity-70 text-darkblueui outline-none">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Rating</SelectLabel>
              <SelectItem value="1"></SelectItem>
              <SelectItem value="2">Lorem ipsum dolor </SelectItem>
              <SelectItem value="3">Lorem ipsum dolor </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div> */}
      <div className="flex w-full">
        <Select
          onValueChange={(val) => {
            setFilterPrice(val);
          }}
          value={filterPrice}
        >
          <SelectTrigger className=" w-full sm:w-36   h-[40px] text-xs sm:text-base border border-primary-blue bg-white bg-opacity-70 text-darkblueui">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Price Range</SelectLabel>
              <SelectItem value="0-25">$0-$25</SelectItem>
              <SelectItem value="25-50">$25-$50</SelectItem>
              <SelectItem value="50-75">$50-$75</SelectItem>
              <SelectItem value="75-100">$75-$100</SelectItem>
              <SelectItem value="100-500">$100-$500</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
