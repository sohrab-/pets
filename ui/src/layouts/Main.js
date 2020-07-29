import React from "react";
import PropTypes from "prop-types";
import { Flex } from "rebass";
import TopBar from "../components/TopBar";

function Main({ children }) {
  return (
    <>
      <TopBar />
      <Flex p={10} alignItems="center">
        {children}
      </Flex>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
