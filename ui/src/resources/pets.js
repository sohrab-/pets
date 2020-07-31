import { useQuery, useMutation, queryCache } from "react-query";
import request from "../request";

export function usePetStats(groupBy) {
  return useQuery(["petsStats", { groupBy }], () =>
    request(
      "petStats",
      {
        params: { groupBy }
      }
    )
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
