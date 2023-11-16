import { useList } from "@refinedev/core";
import { Typography,Box,Stack }from "@mui/material";
import { IResourceComponentsProps } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import columns from "components/grid/PagamentiGrid";
import { PagamentiGridProps } from "interfaces/grid";
import { DataGrid } from "@mui/x-data-grid";

const PagamentoList : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();


    const { data, isLoading, isError } = useList({ resource: "pagamenti" });

    const allPagamenti = data?.data ?? [];

    const rows: PagamentiGridProps[] = []; // Initialize an empty array to hold the transformed data

        allPagamenti.forEach((pagamento) => {
            let fattura = pagamento.fattura?.id || ""

            let nome = pagamento?.fattura?.cliente != null ? pagamento.fattura.cliente.name : ""

            rows.push({
                id: (pagamento.id as string),
                data:pagamento.data,
                ammount: pagamento.ammount,
                note: pagamento.note,
                kg: pagamento.kg,
                fattura: fattura,
                cliente: nome,
                _id: pagamento._id,
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
                    Pagamenti
                </Typography>

                <CustomButton
                    title="Pagamento"
                    handleClick={() => navigate('/pagamenti/createlist')}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    icon={<Add/>}/>
            </Stack>
            

            <Box sx={{ height: 1080, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
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

export default PagamentoList;