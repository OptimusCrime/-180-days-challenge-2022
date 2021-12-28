import React from "react";
import {Box} from "@mui/material";

export const CenteredBox = (
  {
    children,
    height
  } : {
    children: React.ReactElement | React.ReactElement[],
    height?: string
}): JSX.Element => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: height || 'calc(100vh - 3rem)',
      flexFlow: 'column'
    }}>
      {children}
    </Box>
  )
}
