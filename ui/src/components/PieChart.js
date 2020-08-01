import React from "react";
import PropTypes from "prop-types";

import { Card } from "theme-ui";
import { Doughnut } from "react-chartjs-2";

// TODO: use good colours
const colours = ["#E3BA22", "#E6842A", "#137B80", "#8E6C8A", " #978F80"];

const capitalise = (x) =>
  x && x.length > 1 ? x[0].toUpperCase() + x.substring(1) : x;

function PieChart({ data, title = null }) {
  const labels = Object.keys(data).map(capitalise);
  const values = Object.values(data).map(capitalise);

  const chartData = {
    datasets: [
      {
        backgroundColor: colours,
        data: values,
      },
    ],
    labels,
  };

  return (
    <Card>
      <Doughnut
        data={chartData}
        options={{
          title: {
            display: !!title,
            text: title,
          },
        }}
      />
    </Card>
  );
}

PieChart.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
};

export default PieChart;
