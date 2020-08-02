import { useQuery, useMutation, queryCache } from "react-query";
import request from "../request";

export function usePetStats({ groupBy, timeBucket }) {
  return useQuery(
    ["petsStats", { groupBy, timeBucket }],
    () =>
      request("petStats", {
        params: { groupBy, timeBucket },
      }),
    {
      refetchInterval: 30000,
    }
  );
}

export function useCreatePet() {
  return useMutation(({ type, image }) =>
    request(
      "pets",
      {
        method: "POST",
        body: { type, image },
      },
      {
        onSuccess: () => queryCache.invalidateQueries("petStats"),
      }
    )
  );
}
