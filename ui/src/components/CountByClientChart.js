import React from "react";
import { Card, Spinner, Alert } from "theme-ui";
import { Doughnut } from "react-chartjs-2";

import Chart from "../components/Chart";
import { usePetStats } from "../resources/pets";
import { capitalise } from "../stringUtils";

function CountByClientChart() {
  const { data, isLoading, isError } = usePetStats({
    groupBy: "client",
  });

  return (
    <Card>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <Alert variant="error">Something went wrong.</Alert>
      ) : (
        <Chart
          as={Doughnut}
          data={data}
          title="Count by client"
          displayLabel={capitalise}
          options={{ layout: { padding: { bottom: 10 } } }}
        />
      )}
    </Card>
  );
}

export default CountByClientChart;
