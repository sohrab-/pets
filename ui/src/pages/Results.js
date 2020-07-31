import React from "react";

import { usePetStats } from "../resources/pets";
import Main from "../layouts/Main";
import Spinner from "../components/Spinner";
import PetStats from "../components/PetStats";

function Results() {
  const { data: byType, isLoading: isLoadingType } = usePetStats('type');
  const { data: byClient, isLoading: isLoadingClient } = usePetStats('client');

  return (
    <Main>
      {isLoadingType || isLoadingClient ? <Spinner /> : (
        <PetStats
          byType={byType}
          byClient={byClient}
        />
      )}
    </Main>
  );
}

export default Results;
