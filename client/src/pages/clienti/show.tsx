import { useDelete, useShow } from "@refinedev/core";
import LottoCardShow from "components/show/lottoCardShow";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {Box, Grid, Stack} from "@mui/material"
import ClienteShowCard from "components/card/ClienteShowCard";
import ClienteShowCardView from "components/card/ClienteShowCardView";
import CustomButton from "components/common/CustomBotton";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ClientiShow = () => {
    const navigate = useNavigate();
    const { mutate } = useDelete();
    const { id } = useParams();

    const {queryResult} = useShow(({
        resource: "clienti",
        id
    }));

    console.log(queryResult)


    const { data, isLoading, isError } = queryResult;

    const Cliente = data?.data ?? {};

    const handleDeleteFattura = () => {
      const response = window.confirm(
          "Sei sicuro di voler cancellare la fattura? I pagamenti ad essa collegati verranno cancellati a sua volta"
      );
      if (response) {
        //   mutate(
        //       {
        //           resource: "clienti",
        //       },
        //       {
        //           onSuccess: () => {
        //               navigate("/clienti");
        //           },
        //       },
        //   );
      }
    };

    const handleDeleteCliente = () => {
        const response = window.confirm(
            "Sei sicuro di voler cancellare il Cliente? DDT FATTURE PAGAMENTI ad esso associati verranno persi"
        );
        if (response) {
            mutate(
                {
                    resource: "clienti",
                    id: Cliente._id as string,
                },
                {
                    onSuccess: () => {
                        navigate("/clienti");
                    },
                },
            );
        }
      };

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    console.log(Cliente);

    return(
        <>
           <Box>
           
                <ClienteShowCardView
                    id={Cliente._id}
                    key={Cliente._id}
                    name={Cliente.name}
                    email={Cliente.email}
                    indirizzo={Cliente.indirizzo}
                    telefono={Cliente.telefono}
                    cap={Cliente.cap}
                    rea={Cliente.rea}
                    cf={Cliente.cf}
                    piva={Cliente.piva}
                    allFatture={Cliente.allFatture}
                />
                    
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{marginTop: "16px"}} >
                    <Stack direction="row" spacing={2} justifyContent="space-evenly"  alignContent="center">
                        <CustomButton
                            title="Modifica"
                            handleClick={() => navigate(`/clienti/edit/${id}`)}
                            backgroundColor="#757D79"
                            color="#fcfcfc"
                            icon={<EditIcon/>}/>
                        <CustomButton
                            title="Cancella"
                            handleClick={() => {handleDeleteCliente()}}
                            backgroundColor="#D40404"
                            color="#fcfcfc"
                            icon={<DeleteIcon/>}/>
                    </Stack>
                </Grid>

            </Box> 
        </>
    )
}

export default ClientiShow;
