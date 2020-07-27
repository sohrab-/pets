import React from 'react';

import { useCreatePet } from '../resources/pets';
import Main from '../layouts/Main';
import PetCreateForm from '../components/PetCreateForm';
import Spinner from '../components/Spinner';

function Home() {
  const [createPet, { isLoading }] = useCreatePet();

  return (
    <Main>
      {isLoading ? <Spinner /> : <PetCreateForm createPet={createPet}/>}
    </Main>
  );
}

export default Home