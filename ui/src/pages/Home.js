import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Grid, Heading, Text, Spinner, Alert, Button } from "theme-ui";

import { useCreatePet } from "../resources/pets";
import Main from "../layouts/Main";
import PetButton from "../components/PetButton";
import UploadButton from "../components/UploadButton";

function Home() {
  const [selectedType, setSelectedType] = useState(null);
  const [createPet, { isLoading, isError }] = useCreatePet();
  const history = useHistory();

  const onSelect = async (request) => {
    try {
      const { type } = await createPet(request);
      setSelectedType(type);
    } catch (err) {
      setSelectedType(null);
    }
  };

  return (
    <Main>
      {isLoading ? (
        <Box mb={2}>
          <Spinner />
          <Text>Sending your selection...</Text>
        </Box>
      ) : null}

      {selectedType !== null ? (
        <Alert mb={4}>
          You have selected {selectedType.toUpperCase()}.
          <Button
            ml="auto"
            mr={-2}
            onClick={() => {
              history.push("/results");
            }}
          >
            Go to Results
          </Button>
        </Alert>
      ) : isError ? (
        <Alert variant="error" mb={4}>
          Something went wrong.
        </Alert>
      ) : null}

      <Box mb={4}>
        <Heading>Choose your favourite pet</Heading>
        <Text>Or upload a photo</Text>
      </Box>

      <Grid columns={[1, 2, 4]}>
        {["cat", "dog", "hamster"].map((pet) => (
          <PetButton
            key={pet}
            type={pet}
            disabled={isLoading}
            onClick={(type) => {
              onSelect({ type });
            }}
          />
        ))}
        <UploadButton
          disabled={isLoading}
          onFile={(image) => {
            onSelect({ image });
          }}
        />
      </Grid>
    </Main>
  );
}

export default Home;
