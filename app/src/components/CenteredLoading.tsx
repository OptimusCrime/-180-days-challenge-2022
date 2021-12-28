import React from "react";
import {CircularProgress} from "@mui/material";

import {CenteredBox} from "./CenteredBox";

export const CenteredLoading = (): JSX.Element => {
  return (
    <CenteredBox>
      <CircularProgress />
    </CenteredBox>
  )
}
