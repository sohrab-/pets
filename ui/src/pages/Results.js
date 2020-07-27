import React from "react";

import { usePets } from "../resources/pets";
import Main from "../layouts/Main";
import PetList from "../components/PetList";
import Spinner from "../components/Spinner";

function Results() {
  const { data, isLoading } = usePets();

  return (
    <Main>
      {isLoading ? <Spinner /> : <PetList pets={data.results || []} />}
    </Main>
  );
}

export default Results;
