import React from "react";
import PropTypes from "prop-types";
import { Flex } from "rebass";

import PetListCard from "./PetListCard";

function PetList({ pets = [] }) {
  return (
    <Flex>
      {pets.map((pet) => (
        <PetListCard
          key={pet.id}
          id={pet.id}
          type={pet.type}
          image={pet.image}
        />
      ))}
    </Flex>
  );
}

PetList.propTypes = {
  pets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default PetList;
