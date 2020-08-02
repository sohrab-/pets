import React from "react";
import PropTypes from "prop-types";
import { Button, Image } from "theme-ui";

import catImage from "../assets/cat.svg";
import dogImage from "../assets/dog.svg";
import hamsterImage from "../assets/hamster.svg";
import photoUploadImage from "../assets/photo.svg";

const types = {
  cat: {
    image: catImage,
    name: "Cat",
  },
  dog: {
    image: dogImage,
    name: "Dog",
  },
  hamster: {
    image: hamsterImage,
    name: "Hamster",
  },
  photo: {
    image: photoUploadImage,
    name: "Upload Photo",
  },
};

function PetButton({ type, onClick, disabled = false }) {
  const { image, name } = types[type];

  return (
    <Button
      key={type}
      disabled={disabled}
      onClick={() => {
        onClick(type);
      }}
    >
      <Image
        src={image}
        alt={name}
        p={20}
        sx={{ filter: `brightness(${disabled ? "50%" : "100%"})` }}
      />
    </Button>
  );
}

PetButton.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default PetButton;
