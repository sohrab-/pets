import React from "react";
import PropTypes from "prop-types";

import { Card, Text, useThemeUI } from "theme-ui";
import { Doughnut } from "react-chartjs-2";

const capitalise = (x) =>
  x && x.length > 1 ? x[0].toUpperCase() + x.substring(1) : x;

function PieChart({ data, title = null }) {
  const { theme } = useThemeUI();

  const labels = Object.keys(data).map(capitalise);
  const values = Object.values(data).map(capitalise);

  const chartData = {
    datasets: [
      {
        backgroundColor: theme.colors.visualisations,
        data: values,
      },
    ],
    labels,
  };

  const chartOptions = {
    title: {
      display: !!title,
      text: title,
      fontColor: theme.colors.text,
      fontSize: 14,
      padding: 0,
    },
    legend: {
      labels: {
        fontSize: 12,
        fontColor: theme.colors.text,
      },
    },
  };

  return (
    <Card bg="muted" p={[2, null, 10]}>
      {values.length ? (
        <Doughnut data={chartData} options={chartOptions} />
      ) : (
        <Text>No results yet!</Text>
      )}
    </Card>
  );
}

PieChart.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default PieChart;
