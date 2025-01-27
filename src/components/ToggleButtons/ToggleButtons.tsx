import React, { FC, useState } from 'react';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { StyledToggleButtonsComponent } from '@/styles/components/ToggleButtonsComponent';


export type ToggleButtonItem = {
    value: string;
    label: string;
}

export interface ToggleButtonsComponentProps {
    items: ToggleButtonItem[];
    className?: string;
    defaultValue: string;

    onChange: (newValue: string) => void;
}


const ToggleButtonsComponent: FC<ToggleButtonsComponentProps> = ({ 
  items, 
  className,
  defaultValue = null, 
  onChange, 
}) => {
  const [selectedValue, setSelectedValue] = useState<string | null>(defaultValue);

  const handleChange = (event: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) {
      setSelectedValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <StyledToggleButtonsComponent>
        <ToggleButtonGroup
        className={className}
        value={selectedValue}
        exclusive
        onChange={handleChange}
        sx={{ 
            borderRadius: '20px', 
            '& .MuiToggleButton-root': { 
            borderRadius: '20px',
            textTransform: 'none'
            }
        }}
        >
        {items.map((item) => (
            <ToggleButton 
            key={item.value} 
            value={item.value}
            >
            {item.label}
            </ToggleButton>
        ))}
        </ToggleButtonGroup>
    </StyledToggleButtonsComponent>
  );
};

export default ToggleButtonsComponent;