import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
import { useList } from "@refinedev/core";
import columns from "components/grid/FatturaGridDash";

import { propertyReferralsInfo } from "constants/index";
import { FatturaGridProps, FatturaGridPropsDash, PagamentiGridProps } from "interfaces/grid";
import { useNavigate } from "react-router-dom";



const FattureDeadline = () => {

    const navigate = useNavigate();

    const { data, isLoading, isError } = useList({ resource: "fatture/deadline" });

    const allFatture = data?.data ?? [];

    const rows: FatturaGridPropsDash[] = []; // Initialize an empty array to hold the transformed data

        allFatture.forEach((fattura) => {
            let incassato = 0;
            fattura.allPagamenti.forEach((pagamento: PagamentiGridProps) => {
                incassato += pagamento.ammount.valueOf();
            });
            console.log(fattura)

            let nome = fattura.cliente != null ? fattura.cliente.name : ""

            rows.push({
                id: fattura.id,
                cliente: nome,
                totale: fattura.totale,
                scadenza: fattura.scadenza,
                incassato: incassato,
                saldo: ((fattura.totale as number) - incassato),
                _id: fattura._id,
            });
        });

   

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Box
            p={4}
            id="chart"
            minWidth={490}
            display="flex"
            flexDirection="column"
            borderRadius="15px"
            gap={4}
            sx={{backgroundColor: (theme) => theme.palette.mode === 'dark' ?  '#1A2027': '#fcfcfc' }}
        >
            <Typography fontSize={18} fontWeight={600} color="#11142d">
                Fatture in Scadenza
            </Typography>

            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    hideFooterPagination={true}
                    sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "peachpuff"
                    }}
                />
                </Box>
        </Box>
    );
};

export default FattureDeadline;
