import React from "react";
import { Flex, Box, NavLink } from "theme-ui";
import { Link } from "react-router-dom";
import peImage from "../assets/pe.png";

function TopBar() {
  return (
    <Flex px={2} color="white" bg="black" alignItems="center">
      <NavLink to="/" as={Link}>
        {/* for some reason, sx gives a different result to style? */}
        <img
          src={peImage}
          alt="Pe."
          style={{ verticalAlign: "text-bottom", marginTop: "3px" }}
        />
        &nbsp;ts
      </NavLink>
      <Box mx="auto" />
      <NavLink to="/results" as={Link} mr={3} pt={3}>
        Results
      </NavLink>
      <NavLink to="/about" as={Link} pt={3}>
        About
      </NavLink>
    </Flex>
  );
}

export default TopBar;
