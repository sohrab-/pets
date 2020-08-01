import React from "react";
import PropTypes from "prop-types";
import { Box } from "theme-ui";
import TopBar from "../components/TopBar";

function Main({ children }) {
  return (
    <>
      <TopBar />
      <Box p={10} sx={{ textAlign: "center" }}>
        {children}
      </Box>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
