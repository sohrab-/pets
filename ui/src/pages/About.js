import React from "react";
import { Box, Heading, Text } from "theme-ui";

import Main from "../layouts/Main";

function About() {
  return (
    <Main>
      <Box py={4} width={1}>
        <Heading as="h3">About</Heading>
      </Box>
      <Box py={2} width={1}>
        <Text>Created by</Text>
      </Box>
      <Box width={1 / 3}>
        <Text>halfbakedsneed</Text>
      </Box>
      <Box width={1 / 3}>
        <Text>sohrab-</Text>
      </Box>
      <Box width={1 / 3}>
        <Text>tsukidust</Text>
      </Box>
      <Box py={2} width={1}>
        <Text fontWeight="lighter" fontSize="smaller">
          Icons made by{" "}
          <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
            Freepik
          </a>{" "}
          from{" "}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </Text>
      </Box>
    </Main>
  );
}

export default About;
