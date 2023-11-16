import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useDelete, useShow } from "@refinedev/core";
import ClienteShowCard from "components/card/ClienteShowCard";
import DdtShowCard from "components/card/DdtShowCard";
import CustomButton from "components/common/CustomBotton";
import columns from "components/grid/DdtShowGrid";
import LottoCardShow from "components/show/lottoCardShow";
import { BeneProps, BeniGridProps } from "interfaces/grid";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";


const DdtShow = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const {queryResult} = useShow(({
        resource: "ddt",
        id
    }));


    const { data, isLoading, isError } = queryResult;

    const Ddt = data?.data ?? {};


    console.log(Ddt)
    const dataFormat : string = new Date(Ddt.data).toLocaleDateString()

    let kgtot = 0;


    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    console.log(Ddt);

    return(
        <>
            <DdtShowCard
                _id={Ddt._id}
                beni={Ddt.beni}
                causale={Ddt.causale}
                data={Ddt.data}
                destinatario={Ddt.destinatario}
                destinazione={Ddt.destinazione}
                id={Ddt.id}
                tara={Ddt.tara}
                key={Ddt._id}
                
            
            />

            
            
        </>
    )
}



export default DdtShow