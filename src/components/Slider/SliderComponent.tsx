import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState, useEffect } from "react";

function valuetext(value: number) {
  return `${value}°C`;
}

const minDistance = 10;

interface SliderComponentProps {
  filterPrice: string;
  setFilterPrice: React.Dispatch<React.SetStateAction<string>>;
}

export default function SliderComponent({
  filterPrice,
  setFilterPrice,
}: SliderComponentProps) {
  const filterPriceArray = filterPrice?.split("-");

  const [value1, setValue1] = React.useState<number[]>(
    filterPriceArray?.length === 2 &&
      !isNaN(+filterPriceArray[0]) &&
      !isNaN(+filterPriceArray[1])
      ? [+filterPriceArray[0], +filterPriceArray[1]]
      : [0, 25]
  );

  const handleChange1 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
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

  useEffect(() => {
    const handler = setTimeout(() => {
      setFilterPrice(`${value1[0]}-${value1[1]}`);
    }, 1000); // Debounce time of 1000ms

    return () => {
      clearTimeout(handler);
    };
  }, [value1, setFilterPrice]);

  return (
    <Box sx={{ width: 300 }}>
      <Slider
        getAriaLabel={() => "Minimum distance"}
        value={value1}
        onChange={handleChange1}
        valueLabelDisplay="on"
        getAriaValueText={valuetext}
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
