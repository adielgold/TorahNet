import { styled } from '@mui/material/styles';

const StyledToggleButtonsComponent = styled('div')`
 .MuiToggleButtonGroup-root {
    height: 30px;
    border-raduis: 25px;
    background-color: #f5f5f5;
    border: 1px solid #6893d4;
    
    .MuiToggleButton-root {
      color: #1e1e4a;
      border: none;
      
      &.Mui-selected {
        background-color: #1e1e4a;
        color: white;
        
        &:hover {
          background-color: #6893d4;
        }
      }

      &:hover {
        background-color: rgba(25, 118, 210, 0.1);  // light blue hover for unselected
      }
    }
}
`;

export {
    StyledToggleButtonsComponent
}