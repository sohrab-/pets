import React from 'react'
import PropTypes from 'prop-types'
import { Card, Box, Image, Heading } from 'rebass'

function PetListCard({ id, image, pet }) {
  return (
    <Box m={15}>
      <Card width={[256, 320]}>
        <Image src={image}/>
        <Heading>{pet}</Heading>
      </Card>
    </Box>
  )
}

PetListCard.propTypes = {
  id: PropTypes.string.isRequired,
  pet: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
}

export default PetListCard