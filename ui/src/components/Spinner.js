import React from "react";
import { Box } from "theme-ui";
import { Spinner as Loader } from "theme-ui";

function Spinner() {
  return (
    <Box py={200}>
      <Loader />
    </Box>
  );
}

export default Spinner;
