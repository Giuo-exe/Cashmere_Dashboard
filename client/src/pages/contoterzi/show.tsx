import { useShow } from '@refinedev/core';
import ContoTerziShowCard from 'components/card/ContoTerziShowCard'
import React from 'react'
import { useParams } from 'react-router-dom';

const ContoTerziShow = () => {
    const { id } = useParams();


    const {queryResult} = useShow(({
        resource: "contoterzi",
        id
    }));

    const { data, isLoading, isError } = queryResult;

    const ContoTerzi = data?.data ?? {};
    console.log(ContoTerzi)
    return (
      <>
          {Object.keys(ContoTerzi).map((key) => (
              <ContoTerziShowCard
                  Conto={ContoTerzi[key]}
                  id={id}
                  key={key} // Assicurati di aggiungere una chiave univoca per ciascun elemento
              />
          ))}
      </>
  );  
}

export default ContoTerziShow