import React from "react";
import { Box, Grid, Heading, Text } from "theme-ui";

import Main from "../layouts/Main";

function About() {
  return (
    <Main>
      <Box mb={20}>
        <Heading>About</Heading>
      </Box>
      <Box mb={20}>
        <Text sx={{ fontWeight: "bold" }}>Created by</Text>
      </Box>
      <Grid columns={[1, null, 3]} mb={20}>
        <Text>halfbakedsneed</Text>
        <Text>sohrab-</Text>
        <Text>tsukidust</Text>
      </Grid>
      <Box py={2}>
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
