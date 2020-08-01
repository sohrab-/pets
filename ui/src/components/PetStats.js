import React from "react";
import PropTypes from "prop-types";

import { Box, Heading, Grid } from "theme-ui";

import PieChart from "./PieChart";

function PetStats({ byType, byClient }) {
  return (
    <div>
      <Box py={4}>
        <Heading>Statistics</Heading>
      </Box>
      <Grid columns={[1, null, 2]}>
        <PieChart data={byType} title="Submissions by type" />
        <PieChart data={byClient} title="Submissions by client" />
      </Grid>
    </div>
  );
}

PieChart.propTypes = {
  byType: PropTypes.object.isRequired,
  byClient: PropTypes.object.isRequired,
};

export default PetStats;
