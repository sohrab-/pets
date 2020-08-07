import React, { useState } from "react";
import moment from "moment";
import { Card, Spinner, Alert } from "theme-ui";
import { Bar } from "react-chartjs-2";

import Chart from "../components/Chart";
import ChartSelect from "../components/ChartSelect";
import { usePetStats } from "../resources/pets";

// Possible time buckets to choose from
const timeBuckets = ["1m", "5m", "10m"];

// Max buckets to display on the chart
const maxBuckets = 10;

const parseBucket = (timeBucket) => [
  parseInt(timeBucket.slice(0, -1)),
  moment.normalizeUnits(timeBucket.slice(-1)),
];

const minimumTime = (times, timeBucketValue, timeBucketUnit) =>
  moment(times.sort().slice(-1)[0])
    .clone()
    .subtract(
      moment.duration(timeBucketValue, timeBucketUnit).asMilliseconds() *
        maxBuckets
    );

function CountOverTimeChart() {
  const [timeBucket, setTimeBucket] = useState(timeBuckets[0]);
  const [timeBucketValue, timeBucketUnit] = parseBucket(timeBucket);

  const { data, isLoading, isError } = usePetStats({
    groupBy: "createdAt",
    timeBucket,
  });

  return (
    <Card sx={{ height: 300 }}>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Alert variant="error">Something went wrong.</Alert>
      ) : (
        <>
          {!!Object.keys(data).length && (
            <ChartSelect
              options={timeBuckets}
              selected={timeBucket}
              onChange={setTimeBucket}
            />
          )}
          <Chart
            as={Bar}
            data={data}
            title="Count over time"
            options={{
              legend: { display: false },
              title: { padding: 10 },
              maintainAspectRatio: false,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                      suggestedMin: 1,
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
                        Object.keys(data),
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
  );
}

export default CountOverTimeChart;
