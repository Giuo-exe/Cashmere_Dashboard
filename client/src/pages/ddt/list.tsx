import { useList } from "@refinedev/core";
import { Typography,Box,Stack, Grid, Modal, IconButton }from "@mui/material";
import React from "react";
import ClientCard from "components/clientCard";
import { IResourceComponentsProps } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FattureDataGrid from "components/grid/FatturaGrid";
import { BeneProps, DdtGridProps, FatturaGridProps, PagamentiGridProps } from "interfaces/grid";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from '@mui/icons-material/Close';
import SellIcon from '@mui/icons-material/Sell';

import {
    VillaOutlined,
  } from "@mui/icons-material/";
import columns from "components/grid/DdtListGrid";
  


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };

const FatturaList : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const { data, isLoading, isError } = useList({ resource: "ddt" });

    const allDdt = data?.data ?? [];

    const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

    const contoterzi = "contoterzi"
    const vendita = "vendita"
    console.log(allDdt)

    const rows: DdtGridProps[] = []; // Initialize an empty array to hold the transformed data

        allDdt.forEach((ddt) => {
            let kgtot = 0;
            let totballe = 0;

            ddt.beni.forEach((bene: BeneProps) => {
                kgtot += bene.kg.valueOf();
                totballe += bene.n != null ? bene.n : 0
            });
            
            let nome = ddt.destinatario != null ? ddt.destinatario.name : ""
            let fattura = ddt.fattura?.id || ""

            rows.push({
                id: (ddt.id as string),
                destinatario: nome,
                causale: ddt.causale,
                data: ddt.data,
                beni: ddt.beni.length,
                balle: totballe,
                kg: kgtot,
                fattura: fattura, 
                _id: ddt._id,
            });
        });

        console.log(allDdt)

    // if (isLoading) return <div>loading...</div>;
    // if (isError) return <div>error...</div>;

    return (
        <Box>
            <Stack
             direction="row"
             justifyContent="space-between"
             alignItems="center">
                
                <Typography fontSize={25} fontWeight={700} color="#11142d">
                    Lista DDT
                </Typography>

                <CustomButton
                    title="DDT"
                    handleClick={handleOpen}
                    backgroundColor="#475be8"
                    color="#fcfcfc"
                    icon={<Add/>}/>
            </Stack>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description">
                    
                <Box sx={{ ...style, minWidth: 500, minHeight: 300 }}>

                    <Typography id="modal-modal-title" variant="body1" component="h6">
                        Scegli Tipo di DDT
                        <IconButton onClick={handleClose} color="primary" sx={{float:"right"}}><CloseIcon/>
                        </IconButton>
                    </Typography>
                    
                    <Box
                        marginTop={10}
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignContent="center">

                        <Stack 
                            direction="row"
                            gap={4}>

                            <CustomButton 
                                title="Conto Terzi"
                                handleClick={() => navigate(`/ddt/precreate/${contoterzi}`) }
                                backgroundColor="#121212" 
                                color="#fcfcfc"
                                icon={<VillaOutlined/>}/>

                            <CustomButton 
                                title="Vendite"
                                color="#fcfcfc"
                                handleClick={() => navigate(`/ddt/precreate/${vendita}`) }
                                backgroundColor="#121212" 
                                icon={<SellIcon/>}/>

                        </Stack>

                    </Box>

                </Box>
            </Modal>
            

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

export default FatturaList;