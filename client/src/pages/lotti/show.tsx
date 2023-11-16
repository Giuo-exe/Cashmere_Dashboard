import { useDelete, useShow, useList } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import LottoCardShow from "components/show/lottoCardShow";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Stack} from "@mui/material";



const LottiShow = () => {
    const navigate = useNavigate();
    const { mutate } = useDelete();
    const { id } = useParams();

    const {queryResult} = useShow(({
        resource: "lotti",
        id
    }));


    const { data, isLoading, isError } = queryResult;

    const Lotto = data?.data ?? {};

    const stats = GetStats(id)[0]
    console.log(stats)
    console.log(Lotto)

    const handleDeleteLotto= () => {
      const response = window.confirm(
          "Sei sicuro di voler cancellare la fattura? I pagamenti ad essa collegati verranno cancellati a sua volta"
      );
      if (response) {
          mutate(
              {
                  resource: "lotti",
                  id: id as string,
              },
              {
                  onSuccess: () => {
                      navigate("/lotti");
                  },
              },
          );
      }
    };

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    console.log(Lotto);

    return(
        <>
            <LottoCardShow
                balle={Lotto.balle}
                contoterzi={Lotto.contoterzi.length > 0 ? true : false}
                data = {Lotto.data}
                fornitore = {Lotto.fornitore}
                lavorata={Lotto.lavorata}
                name={Lotto.name}
                stats={stats}
                cashmere={Lotto.cashmere}
                allFatture={Lotto.allFatture}
                id={Lotto._id}
            />

            <Stack direction="row" spacing={2} justifyContent="space-evenly" alignContent="center" sx={{marginTop: "16px"}}>
                <CustomButton
                    title="Modifica"
                    handleClick={() => navigate("/lotti")}
                    backgroundColor="#757D79"
                    color="#fcfcfc"
                    icon={<EditIcon/>}/>
                <CustomButton
                    title="Cancella"
                    handleClick={() => {handleDeleteLotto()}}
                    backgroundColor="#D40404"
                    color="#fcfcfc"
                    icon={<DeleteIcon/>}/>
            </Stack>
        </>
    )
}

const GetStats = (id: any) => {
    const { data, isLoading, isError } = useList({ resource: `lotti/difference/${id}` });

    const allLotti = data?.data ?? [];
    
    return allLotti;
}

export default LottiShow;
