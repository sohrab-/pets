import React from 'react';
import PropTypes from 'prop-types';
import { Box } from 'rebass';
import TopBar from '../components/TopBar';

function Main({ children }) {
  return (
    <>
      <TopBar/>
      <Box>
        {children}
      </Box>
    </>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Main