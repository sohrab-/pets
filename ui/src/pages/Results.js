import React, { useState } from "react";
import moment from "moment";

import { Doughnut, Bar } from "react-chartjs-2";
import { Card, Box, Heading, Grid, Spinner, Alert } from "theme-ui";

import { usePetStats } from "../resources/pets";
import Main from "../layouts/Main";
import Chart from "../components/Chart";
import ChartSelect from "../components/ChartSelect";

const timeBuckets = ["1m", "1h", "1d"];

const capitalise = (x) =>
  x && x.length > 1 ? x[0].toUpperCase() + x.substring(1) : x;

const formatTime = (time) => moment(time).format("hh:MM:SS A");

function Results() {
  const [timeBucket, setTimeBucket] = useState(timeBuckets[0]);

  const { data: byType, isLoading: isLoadingType } = usePetStats({
    groupBy: "type",
  });

  const { data: byClient, isLoading: isLoadingClient } = usePetStats({
    groupBy: "client",
  });

  const { data: byTime, isLoading: isLoadingTime } = usePetStats({
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
                    },
                  }}
                  displayLabel={formatTime}
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
