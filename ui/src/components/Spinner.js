import React from "react";
import { Box } from "theme-ui";
import ScaleLoader from "react-spinners/ScaleLoader";

function Spinner() {
  return (
    <Box py={200}>
      <ScaleLoader />
    </Box>
  );
}

export default Spinner;
