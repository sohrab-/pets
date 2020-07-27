import React from 'react';
import { Box, Flex } from 'rebass';
import ScaleLoader from 'react-spinners/ScaleLoader';

function Spinner() {
  return (
    <Flex alignItems='center'>
      <Box width={1/2} py={200} ml='auto'>
        <ScaleLoader/>
      </Box>
    </Flex>
  )
}

export default Spinner;