import React from "react";
import PropTypes from "prop-types";

import { Text, merge, useThemeUI } from "theme-ui";

function Chart({
  as: Component,
  data,
  title = null,
  options = {},
  displayLabel = (label) => label,
  displayValue = (value) => value,
}) {
  const { theme } = useThemeUI();

  const labels = Object.keys(data).map(displayLabel);
  const values = Object.values(data).map(displayValue);

  const chartData = {
    datasets: [
      {
        backgroundColor: theme.colors.visualisations,
        data: values,
      },
    ],
    labels,
  };

  const chartOptions = merge(
    {
      title: {
        display: !!title,
        text: title,
        fontColor: theme.colors.text,
        fontSize: theme.fontSizes[1],
        padding: 0,
      },
      legend: {
        labels: {
          fontSize: theme.fontSizes[0],
          fontColor: theme.colors.text,
        },
      },
    },
    options
  );

  return values.length ? (
    <Component data={chartData} options={chartOptions} />
  ) : (
    <Text>No results yet!</Text>
  );
}

Chart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object,
  title: PropTypes.string,
  as: PropTypes.elementType,
};

export default Chart;
