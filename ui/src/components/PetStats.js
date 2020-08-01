import React from "react";
import PropTypes from "prop-types";

import { Box, Heading, Grid } from "theme-ui";

import PieChart from "./PieChart";

function PetStats({ byType, byClient }) {
  return (
    <Box>
      <Box mb={20}>
        <Heading>Statistics</Heading>
      </Box>
      <Grid columns={[1, 1, 1, 2]} mx={[2, 4, 4, 5]} gap={[4, 4, 4, 6]}>
        <PieChart data={byType} title="Submissions by type" />
        <PieChart data={byClient} title="Submissions by client" />
      </Grid>
    </Box>
  );
}

PetStats.propTypes = {
  byType: PropTypes.object.isRequired,
  byClient: PropTypes.object.isRequired,
};

export default PetStats;
