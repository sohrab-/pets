import React, { useState } from "react";

import { usePetStats } from "../resources/pets";
import Main from "../layouts/Main";
import Spinner from "../components/Spinner";
import PetStats from "../components/PetStats";

const timeBuckets = ["30s", "60s"];

function Results() {
  const [timeBucket, setTimeBucket] = useState(timeBuckets[0]);

  const { data: byType, isLoading: isLoadingType } = usePetStats({
    groupBy: "type",
  });

  const { data: byClient, isLoading: isLoadingClient } = usePetStats({
    groupBy: "client",
  });

  const { data: byTime, isLoading: isLoadingTime } = usePetStats({
    groupBy: "time",
    timeBucket,
  });

  return (
    <Main>
      {isLoadingType || isLoadingClient || isLoadingTime ? (
        <Spinner />
      ) : (
        <PetStats
          byType={byType}
          byClient={byClient}
          byTime={byTime}
          timeBucket={timeBucket}
          timeBuckets={timeBuckets}
          setTimeBucket={setTimeBucket}
        />
      )}
    </Main>
  );
}

export default Results;
