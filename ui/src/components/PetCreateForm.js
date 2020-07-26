import React, { useState, useRef } from "react";
import PropTypes from 'prop-types';
import { Box, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import { useHistory } from "react-router-dom";

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

  const [pet, setPet] = useState("cat");
  const imageRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    let image = null;
    if (imageRef.current.files && imageRef.current.files[0]) {
      image = await getFile(imageRef.current.files[0]);
    }

    // TODO handle errors
    await createPet({ name: pet, image });
    history.push('/results');
  };

  return (
    // TODO replace with icon buttons
    <Box as="form" onSubmit={onSubmit} py={3}>
      <Box width={1} px={2}>
        <Label htmlFor="pet">Pet</Label>
        <Input
          id="pet"
          name="pet"
          value={pet}
          onChange={(e) => setPet(e.target.value)}
        />
      </Box>
      <Box width={1} px={2}>
        <Label htmlFor="image">Photo</Label>
        <input type="file" id="image" name="image" ref={imageRef} />
      </Box>
      <Box px={2} ml="auto">
        <Button>Submit</Button>
      </Box>
    </Box>
  );
}

PetCreateForm.propTypes = {
  createPet: PropTypes.func.isRequired,
}

export default PetCreateForm