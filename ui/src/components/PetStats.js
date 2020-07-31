import React from "react";
import PropTypes from "prop-types";

import { Box, Heading } from "rebass";

import PieChart from "./PieChart";

function PetStats({ byType, byClient }) {
  return (
    <>
      <Box py={4} width={1}>
        <Heading as="h3" textAlign="center">
          Statistics
        </Heading>
      </Box>
      <Box mb={4} mx={4} width={[1, 1/2, 1/3]}>
        <PieChart data={byType} title="Submissions by type"/>
      </Box>
      <Box mb={4} mx={4} width={[1, 1/2, 1/3]}>
        <PieChart data={byClient} title="Submissions by client"/>
      </Box>
    </>
  );
}

PieChart.propTypes = {
  byType: PropTypes.object.isRequired,
  byClient: PropTypes.object.isRequired,
}

export default PetStats;
