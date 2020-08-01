import React, { useRef } from "react";
import PropTypes from "prop-types";
import { Grid } from "theme-ui";
import { Box, Heading, Text, Image, Button } from "theme-ui";
import { useHistory } from "react-router-dom";

import catImage from "../assets/cat.svg";
import dogImage from "../assets/dog.svg";
import hamsterImage from "../assets/hamster.svg";
import photoUploadImage from "../assets/photo.svg";

const tiles = [
  {
    type: "cat",
    image: catImage,
    name: "Cat",
  },
  {
    type: "dog",
    image: dogImage,
    name: "Dog",
  },
  {
    type: "hamster",
    image: hamsterImage,
    name: "Hamster",
  },
  {
    type: "photo",
    image: photoUploadImage,
    name: "Upload Photo",
  },
];

function getFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function PetCreateForm({ createPet }) {
  const history = useHistory();
  const imageRef = useRef();

  const onSubmit = async (type, event) => {
    event.preventDefault();

    if (type === "photo") {
      imageRef.current.click();
    } else {
      // TODO handle errors
      await createPet({ type });
      history.push("/results");
    }
  };

  const onUpload = async () => {
    if (imageRef.current.files && imageRef.current.files[0]) {
      const image = await getFile(imageRef.current.files[0]);
      // TODO handle errors
      await createPet({ image });
      history.push("/results");
    }
  };

  return (
    <div>
      <Box py={4} width={1} sx={{ textAlign: "center" }}>
        <Heading>Choose your favourite pet</Heading>
        <Text>Or upload a photo</Text>
      </Box>
      <Grid columns={[1, 2, 4]}>
        {tiles.map(({ type, name, image }) => (
          <Button key={type} onClick={(e) => onSubmit(type, e)}>
            <Image src={image} alt={name} p={20} />
          </Button>
        ))}
      </Grid>

      <input
        type="file"
        id="image"
        name="image"
        ref={imageRef}
        onChange={onUpload}
        hidden
      />
    </div>
  );
}

PetCreateForm.propTypes = {
  createPet: PropTypes.func.isRequired,
};

export default PetCreateForm;
