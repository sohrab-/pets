import { useQuery, useMutation, queryCache } from "react-query";
import request from "../request";

export function usePetStats(groupBy) {
  return useQuery(
    ["petsStats", { groupBy }],
    () =>
      request("petStats", {
        params: { groupBy },
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
