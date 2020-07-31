
import React from "react";
import PropTypes from "prop-types";

import { Card } from "rebass";
import { Pie } from "react-chartjs-2";

// TODO: use good colours
const colours = [
  "#3e95cd",
  "#8e5ea2",
  "#3cba9f",
  "#e8c3b9",
  "#c45850",
]

function PieChart({ data, title = null }) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    datasets: [{
      backgroundColor: colours,
      data: values,
    }],
    labels,
  }

  return (
    <Card sx={{ backgroundColor: 'muted' }}>
      <Pie
        data={chartData}
        options={{
          title: {
            display: !!title,
            text: title,
          }
        }}
      />
    </Card>
  );
}

PieChart.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
}

export default PieChart;