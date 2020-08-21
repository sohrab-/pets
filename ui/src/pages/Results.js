import React from "react";
import { Box, Heading, Grid, Alert } from "theme-ui";

import Main from "../layouts/Main";
import CountByTypeChart from "../components/CountByTypeChart";
import CountByClientChart from "../components/CountByClientChart";
import CountOverTimeChart from "../components/CountOverTimeChart";

function Results() {
  return (
    <Main>
      <Box mx={[2, 4, 4, 5]}>
        <Box mb={4}>
          <Heading>Results</Heading>
        </Box>
        <Alert variant="primary" mb={3} sx={{ fontSize: "12px" }}>
          It may take up to 30 seconds for results to reflect, due to caching.
        </Alert>
        <Grid columns={[1, 1, 1, 2]} gap={[2, 2, 2, 4]}>
          <CountByTypeChart />
          <CountByClientChart />
        </Grid>
        <Grid columns={1} my={[2, 2, 2, 3]}>
          <CountOverTimeChart />
        </Grid>
      </Box>
    </Main>
  );
}

export default Results;
