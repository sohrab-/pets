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
      <Grid columns={[1, null, 2]} mx={[10, null, 100]} gap={100}>
        <PieChart data={byType} title="Submissions by type" />
        <PieChart data={byClient} title="Submissions by client" />
      </Grid>
    </Box>
  );
}

PieChart.propTypes = {
  byType: PropTypes.object.isRequired,
  byClient: PropTypes.object.isRequired,
};

export default PetStats;
