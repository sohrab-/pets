import React from "react";
import { Box } from "rebass";
import ScaleLoader from "react-spinners/ScaleLoader";

function Spinner() {
  return (
    <Box py={200}>
      <ScaleLoader />
    </Box>
  );
}

export default Spinner;
