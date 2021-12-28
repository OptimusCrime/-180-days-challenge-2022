import React from "react";
import {Box} from "@mui/material";

export const CenteredBox = (
  {
    children,
    minHeight
  } : {
    children: React.ReactElement | React.ReactElement[],
    minHeight?: string
}): JSX.Element => {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: minHeight || 'calc(100vh - 3rem)',
      flexFlow: 'column'
    }}>
      {children}
    </Box>
  )
}
