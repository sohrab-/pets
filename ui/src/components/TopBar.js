import React from "react";
import { Flex, Box, NavLink } from "theme-ui";
import { Link } from "react-router-dom";
import peImage from "../assets/pe.png";

function TopBar() {
  return (
    <Flex px={2} py={2} color="white" bg="black" sx={{ alignItems: "center" }}>
      <NavLink px={2} to="/" as={Link}>
        <img style={{ verticalAlign: "text-bottom" }} src={peImage} alt="Pe." />
        &nbsp;ts
      </NavLink>
      <Box mx="auto" />
      <NavLink px={2} to="/about" as={Link}>
        About
      </NavLink>
      <NavLink px={2} to="/results" as={Link}>
        Results
      </NavLink>
    </Flex>
  );
}

export default TopBar;
