import React, { useState } from "react";
import moment from "moment";

import { Doughnut, Bar } from "react-chartjs-2";
import { Card, Box, Heading, Grid, Spinner, Alert } from "theme-ui";

import { usePetStats } from "../resources/pets";
import Main from "../layouts/Main";
import Chart from "../components/Chart";
import ChartSelect from "../components/ChartSelect";

// Possible time buckets to choose from
const timeBuckets = ["1m", "5m", "10m"];

// Max buckets to display on the chart
const maxBuckets = 10;

const capitalise = (x) =>
  x && x.length > 1 ? x[0].toUpperCase() + x.substring(1) : x;

const parseBucket = (timeBucket) => [
  parseInt(timeBucket.slice(0, -1)),
  moment.normalizeUnits(timeBucket.slice(-1)),
];

const minimumTime = (times, timeBucketValue, timeBucketUnit) =>
  times.length
    ? moment(times.sort().slice(-1)[0])
        .clone()
        .subtract(
          moment.duration(timeBucketValue, timeBucketUnit).asMilliseconds() *
            maxBuckets
        )
    : 0;

function Results() {
  const [timeBucket, setTimeBucket] = useState(timeBuckets[0]);
  const [timeBucketValue, timeBucketUnit] = parseBucket(timeBucket);

  const {
    data: byType,
    isLoading: isLoadingType,
    isError: isErrorType,
  } = usePetStats({
    groupBy: "type",
  });

  const {
    data: byClient,
    isLoading: isLoadingClient,
    isError: isErrorClient,
  } = usePetStats({
    groupBy: "client",
  });

  const {
    data: byTime,
    isLoading: isLoadingTime,
    isError: isErrorTime,
  } = usePetStats({
    groupBy: "createdAt",
    timeBucket,
  });

  return (
    <Main>
      <Box mx={[2, 4, 4, 5]}>
        <Box mb={4}>
          <Heading>Statistics</Heading>
        </Box>
        <Alert mb={3}>
          <em>
            It may take up to 30 seconds for results to reflect, due to caching.
          </em>
        </Alert>
        <Grid columns={[1, 1, 1, 2]} gap={[2, 2, 2, 4]}>
          <Card>
            {isLoadingType ? (
              <Spinner />
            ) : isErrorType ? (
              <Alert variant="error">Something went wrong.</Alert>
            ) : (
              <Chart
                as={Doughnut}
                data={byType}
                title="Submissions by type"
                displayLabel={capitalise}
              />
            )}
          </Card>
          <Card>
            {isLoadingClient ? (
              <Spinner />
            ) : isErrorClient ? (
              <Alert variant="error">Something went wrong.</Alert>
            ) : (
              <Chart
                as={Doughnut}
                data={byClient}
                title="Submissions by client"
                displayLabel={capitalise}
              />
            )}
          </Card>
        </Grid>
        <Grid columns={1} my={[2, 2, 2, 3]}>
          <Card>
            {isLoadingTime ? (
              <Spinner />
            ) : isErrorTime ? (
              <Alert variant="error">Something went wrong.</Alert>
            ) : (
              <>
                {!!Object.keys(byTime).length && (
                  <ChartSelect
                    options={timeBuckets}
                    selected={timeBucket}
                    onChange={setTimeBucket}
                  />
                )}
                <Chart
                  as={Bar}
                  data={byTime}
                  title="Submissions by time"
                  options={{
                    legend: { display: false },
                    title: { padding: 10 },
                    scales: {
                      yAxes: [
                        {
                          ticks: {
                            beginAtZero: true,
                          },
                        },
                      ],
                      xAxes: [
                        {
                          offset: true,
                          type: "time",
                          time: {
                            stepSize: timeBucketValue,
                            unit: timeBucketUnit,
                            tooltipFormat: "h:mm a",
                          },
                          ticks: {
                            min: minimumTime(
                              Object.keys(byTime),
                              timeBucketValue,
                              timeBucketUnit
                            ),
                          },
                        },
                      ],
                    },
                  }}
                />
              </>
            )}
          </Card>
        </Grid>
      </Box>
    </Main>
  );
}

export default Results;
