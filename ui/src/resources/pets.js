import { useQuery, useMutation, queryCache } from 'react-query'
import request from '../request'

// We can swap react-query out for react-apollo-hooks, if we choose to use AppSync.
// I chose it for its similar API.

export function usePets() {
  return useQuery('pets', () => request('pets'));
}

export function useCreatePet() {
  return useMutation(({ pet, image }) => request('pets', {
    method: 'POST',
    body: { pet, image }
  }, {
    onSuccess: () => queryCache.invalidateQueries('pets')
  }));
}