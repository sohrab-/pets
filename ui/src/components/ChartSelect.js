import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Select, Box } from "theme-ui";

function ChartSelect({ options, selected, onChange }) {
  const optionElements = useMemo(
    () =>
      options.map((bucket) => (
        <option key={bucket} value={bucket}>
          {bucket}
        </option>
      )),
    [options]
  );

  return (
    <Box
      p={[1, 2, 2, 2]}
      sx={{
        top: 0,
        right: 0,
        position: "absolute",
        width: "20%",
        maxWidth: "200px",
      }}
    >
      <Select
        value={selected}
        onChange={(event) => onChange(event.target.value)}
      >
        {optionElements}
      </Select>
    </Box>
  );
}

ChartSelect.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
};

export default ChartSelect;
