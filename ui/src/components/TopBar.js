import React from "react";
import { Flex, Box, Link } from "rebass";
import { Link as RouterLink } from "react-router-dom";

function TopBar() {
  return (
    <Flex px={2} color="white" bg="black" alignItems="center">
      <Link variant="nav" to="/" as={RouterLink}>
        Pe.ts
      </Link>
      <Box mx="auto" />
      <Link variant="nav" to="/about" as={RouterLink}>
        About
      </Link>
      <Link variant="nav" to="/results" as={RouterLink}>
        Results
      </Link>
    </Flex>
  );
}

export default TopBar;
