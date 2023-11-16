import { useList } from "@refinedev/core";
import { Typography,Box,Stack }from "@mui/material";
import ClientCard from "components/clientCard";
import { IResourceComponentsProps } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FattureDataGrid from "components/grid/FatturaGrid";
import { FatturaGridProps, PagamentiGridProps } from "interfaces/grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import columns from "components/grid/FatturaGrid";

const FatturaList : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const { data, isLoading, isError } = useList({ resource: "fatture" });

    const allFatture = data?.data ?? [];

    const rows: FatturaGridProps[] = []; // Initialize an empty array to hold the transformed data

        allFatture.forEach((fattura) => {
            let incassato = 0;
            fattura.allPagamenti.forEach((pagamento: PagamentiGridProps) => {
                incassato += pagamento.ammount.valueOf();
            });
            console.log(fattura)

            let nome = fattura.cliente != null ? fattura.cliente.name : ""

            rows.push({
                id: (fattura.id as string),
                cliente: nome,
                totale: fattura.totale,
                iva: ((fattura.totale as number) / 100 * 22),
                data: fattura.data,
                scadenza: fattura.scadenza,
                note: fattura.note,
                incassato: incassato,
                saldo: ((fattura.totale as number) - incassato),
                pagato: fattura.pagato,
                pagamenti: fattura.allPagamenti.length,
                ddt: (fattura.allDdt.length as number),
                _id: fattura._id,
            });
        });

   

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Box>
            <Stack
             direction="row"
             justifyContent="space-between"
             alignItems="center">
                
                <Typography fontSize={25} fontWeight={700} color="#11142d">
                    Lista Fatture
                </Typography>

                <CustomButton
                    title="Fattura"
                    handleClick={() => navigate('/fatture/create')}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    icon={<Add/>}/>
            </Stack>
            

            <Box sx={{ height: 1080, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    slots={{ toolbar: GridToolbar }}
                    initialState={{
                    pagination: {
                        paginationModel: {
                        pageSize: 20,
                        },
                    },
                    }}
                    pageSizeOptions={[20]}
                    disableRowSelectionOnClick
                />
                </Box>
        </Box>
    );
};

export default FatturaList;