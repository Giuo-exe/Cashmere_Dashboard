import { Box, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { useDelete, useShow, useUpdate } from '@refinedev/core';
import ClienteShowCard from 'components/card/ClienteShowCard';
import CustomButton from 'components/common/CustomBotton';
import PagamentoGridShow from 'components/show/pagamentoCardShow';
import { PagamentiGridProps } from 'interfaces/grid';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const PagamentoShow = () => {
    const navigate = useNavigate();
    const { mutate : deletePagamento} = useDelete();
    const { mutate : updatePagamento} = useUpdate();

    const { id } = useParams();
    const {queryResult} = useShow();

    const { data, isLoading, isError } = queryResult;

    const Pagamento = data?.data ?? {};

    const handleDeleteFattura = () => {
      const response = window.confirm(
          "Sei sicuro di voler cancellare il Pagamento?"
      );
      if (response) {
          deletePagamento(
              {
                  resource: "pagamenti",
                  id: id as string,
              },
              {
                  onSuccess: () => {
                      navigate("/pagamenti");
                  },
              },
          );
      }
    };

    //let nome = pagamento?.fattura.cliente != null ? pagamento.fattura.cliente.name : ""

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    console.log(Pagamento)

  return (
      <Box p={2} component={Card} variant="outlined">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
              <Box p={2} component={Card} variant="outlined">
                <Typography variant="h3"> Pagamento {`${Pagamento.id}`} </Typography>
              </Box>
                <PagamentoGridShow
                  _id={Pagamento._id}
                  ammount={Pagamento.ammount}
                  data={Pagamento.data}
                  identificativo={Pagamento?.id}
                  kg={Pagamento.kg}
                  cliente={Pagamento?.fattura?.cliente.name}
                  fattura={Pagamento?.fattura?.id}
                  note={Pagamento.note}
                />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
              <Card variant="outlined" square>
                <Box sx={{padding: "10px"}}>
                  <ClienteShowCard
                    email={Pagamento?.fattura?.cliente?.email}
                    indirizzo={Pagamento?.fattura?.cliente?.indirizzo}
                    name={Pagamento?.fattura?.cliente?.name}
                    telefono={Pagamento?.fattura?.cliente?.telefono}
                    cap={Pagamento?.fattura?.cliente?.cap}
                    cf={Pagamento?.fattura?.cliente?.cf}
                    id={Pagamento?.fattura?.cliente?.id}
                    piva={Pagamento?.fattura?.cliente?.piva}
                    rea={Pagamento?.fattura?.cliente?.rea}
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          <Divider variant="middle" style={{ marginTop: '20px', marginBottom: '20px' }}/>


          <Stack direction="row" spacing={2} justifyContent="space-evenly" alignContent="center">
            <CustomButton
              title="Modifica"
              handleClick={() => navigate(`/pagamenti/edit/${Pagamento._id}`,)}
              backgroundColor="#757D79"
              color="#fcfcfc"
              icon={<EditIcon/>}/>
            <CustomButton
              title="Cancella"
              handleClick={() => {handleDeleteFattura()}}
              backgroundColor="#D40404"
              color="#fcfcfc"
              icon={<DeleteIcon/>}/>
          </Stack>
      </Box> 
  )
}

export default PagamentoShow