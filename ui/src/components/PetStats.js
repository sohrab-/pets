import React, { useMemo } from "react";
import PropTypes from "prop-types";
import moment from "moment";

import { Card, Box, Heading, Grid, Select, useThemeUI } from "theme-ui";
import { Doughnut, Bar } from "react-chartjs-2";

import Chart from "./Chart";

const capitalise = (x) =>
  x && x.length > 1 ? x[0].toUpperCase() + x.substring(1) : x;

const formatTime = (time) => moment(time).format("hh:MM:SS A");

function PetStats({
  byType,
  byClient,
  byTime,
  timeBuckets,
  timeBucket,
  setTimeBucket,
}) {
  const { theme } = useThemeUI();

  const onChangeTimeBucket = (event) => setTimeBucket(event.target.value);
  const options = useMemo(
    () =>
      timeBuckets.map((bucket) => (
        <option key={bucket} value={bucket}>
          {bucket}
        </option>
      )),
    [timeBuckets]
  );

  return (
    <Box mx={[2, 4, 4, 5]}>
      <Box mb={4}>
        <Heading>Statistics</Heading>
      </Box>
      <Grid columns={[1, 1, 1, 2]} gap={[2, 2, 2, 4]}>
        <Card>
          <Chart
            as={Doughnut}
            data={byType}
            title="Submissions by type"
            displayLabel={capitalise}
          />
        </Card>
        <Card>
          <Chart
            as={Doughnut}
            data={byClient}
            title="Submissions by client"
            displayLabel={capitalise}
          />
        </Card>
      </Grid>
      <Grid columns={1} my={[2, 2, 2, 4]}>
        <Card>
          {!!Object.keys(byTime).length && (
            <Box
              p={theme.cards.primary.p}
              sx={{
                top: 0,
                right: 0,
                position: "absolute",
                width: "20%",
                maxWidth: "200px",
              }}
            >
              <Select value={timeBucket} onChange={onChangeTimeBucket}>
                {options}
              </Select>
            </Box>
          )}
          <Chart
            as={Bar}
            data={byTime}
            title="Submissions by time"
            options={{
              legend: { display: false },
              title: { padding: 10 },
            }}
            displayLabel={formatTime}
          />
        </Card>
      </Grid>
    </Box>
  );
}

PetStats.propTypes = {
  byType: PropTypes.object.isRequired,
  byClient: PropTypes.object.isRequired,
  byTime: PropTypes.object.isRequired,
  timeBuckets: PropTypes.arrayOf(PropTypes.string).isRequired,
  timeBucket: PropTypes.string.isRequired,
  setTimeBucket: PropTypes.func.isRequired,
};

export default PetStats;
