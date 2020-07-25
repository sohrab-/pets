import React, { useState, useRef } from "react";
import { Box, Button } from "rebass";
import { Label, Input } from "@rebass/forms";
import "./App.css";

// which demo session the data are for?
const demoSession = process.env.REACT_APP_DEMO_SESSION;

const getFile = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function App() {
  const [pet, setPet] = useState("cat");
  const imageRef = useRef();

  const onSubmit = async (event) => {
    event.preventDefault();

    let image = null;
    if (imageRef.current.files && imageRef.current.files[0]) {
      image = await getFile(imageRef.current.files[0]);
    }

    fetch("/pets", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pet, image, demoSession }),
    });
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

export default App;
