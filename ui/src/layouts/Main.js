import React from "react";
import PropTypes from "prop-types";
import { Flex } from "theme-ui";
import TopBar from "../components/TopBar";

function Main({ children }) {
  return (
    <>
      <TopBar />
      <Flex p={10} flexWrap="wrap" justifyContent="space-evenly">
        {children}
      </Flex>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
