import React from "react";
import {Container} from "@mui/material";

export const ContainerWrapper = ({ children }: { children: React.ReactElement | React.ReactElement[] } ): JSX.Element => {
  return (
    <Container
      sx={{
        paddingTop: '2rem'
      }}
    >
      {children}
    </Container>
  )
}
