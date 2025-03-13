import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState, useEffect, useRef } from "react";

function valuetext(value: number) {
  return `${value}°C`;
}

interface SliderComponentProps {
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
  max: number;
  type?: string;
}

export default function SliderComponent({
  filterPrice,
  setFilterPrice,
  max,
  type,
}: SliderComponentProps) {
  const minDistance = type === "price" ? 10 : 1;
  const isInitialMount = useRef(true);

  // Parse filter values with better error handling
  const parseFilterValues = () => {
    const filterPriceArray = filterPrice?.split("-");

    // Check if we have two valid numbers
    if (
      filterPriceArray?.length === 2 &&
      !isNaN(+filterPriceArray[0]) &&
      !isNaN(+filterPriceArray[1])
    ) {
      return [+filterPriceArray[0], +filterPriceArray[1]];
    }

    // Return default values based on type
    return type === "price" ? [0, 25] : [0, 5];
  };

  const [value1, setValue1] = React.useState<number[]>(parseFilterValues());

  // Update slider when filterPrice prop changes
  useEffect(() => {
    const newValues = parseFilterValues();
    // Only update if values are different to avoid infinite loops
    if (value1[0] !== newValues[0] || value1[1] !== newValues[1]) {
      setValue1(newValues);
    }
  }, [filterPrice]);

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setValue1([Math.min(newValue[0], value1[1] - minDistance), value1[1]]);
    } else {
      setValue1([value1[0], Math.max(newValue[1], value1[0] + minDistance)]);
    }
  };

  // Update parent component with slider value changes
  useEffect(() => {
    // Skip the first render to avoid unnecessary API calls
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const handler = setTimeout(() => {
      const newFilterValue = `${value1[0]}-${value1[1]}`;
      if (newFilterValue !== filterPrice) {
        setFilterPrice(newFilterValue);
      }
    }, 500); // Debounce time of 500ms

    return () => {
      clearTimeout(handler);
    };
  }, [value1, setFilterPrice, filterPrice]);

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
        max={max}
        disableSwap
        sx={{
          marginLeft: 2,
          "& .MuiSlider-track": {
            backgroundColor: "#4a4ae3", // Change this to your desired track color
          },

          "& .MuiSlider-thumb": {
            backgroundColor: "#4a4ae3", // Change this to your desired thumb color
          },

          "& .MuiSlider-valueLabelOpen": {
            backgroundColor: "#4a4ae3", // Change this to your desired box color
          },
          "& .MuiSlider-valueLabel": {
            color: "white", // Change this to your desired text color
          },
        }}
      />
    </Box>
  );
}
