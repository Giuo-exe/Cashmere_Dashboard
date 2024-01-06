import { useList } from "@refinedev/core";
import { Typography,Box,Stack, Grid, Modal, IconButton, TextField, Select, MenuItem, Paper }from "@mui/material";
import ClientCard from "components/clientCard";
import { IResourceComponentsProps,useTable } from "@refinedev/core";
import CustomButton from "components/common/CustomBotton";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ColoreCard from "components/card/coloriCard";
import React, { useMemo, useEffect} from "react";
import CloseIcon from '@mui/icons-material/Close';
import ColoreForm from "components/common/ColoreForm";
import { useModalForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

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


const ColoreList : React.FC<IResourceComponentsProps> = () => {
    const navigate = useNavigate();

    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
        control
    } = useModalForm({
        refineCoreProps: {action:"create", resource: "colori"}
        
    });

    const {
        tableQueryResult: { data, isLoading, isError },
        current,
        setCurrent,
        setPageSize,
        pageCount,
        sorters,
        setSorters,
        filters,
        setFilters,
    } = useTable({ resource: "colori"});

    useEffect(() => {
        setPageSize(25);
        
      }, [setPageSize]);

    const allColori = data?.data ?? [];

    const currentName = sorters.find((item) => (item.field === "name"))?.order;


    const toggleSort = (field: string) => {
        setSorters([{ field, order: currentName === "asc" ? "desc" : "asc" }]);
    };

    const currentFilterValues = useMemo(() => {
        const logicalFilters = filters.flatMap((item) =>
            "field" in item ? item : []
        );

        return {
            name:
                logicalFilters.find((item) => item.field === "name")?.value ||
                "",
        };
    }, [filters]);

    
    const onFinishHandler = async (data: FieldValues) => {
        await onFinish({...data})
        handleClose();
    };

    const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };

    console.log(allColori)

    if (isLoading) return <div>loading...</div>;
    if (isError) return <div>error...</div>;

    return (
        <Box>
            <Box width="100%" mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <Stack direction="column" width="100%" gap={3}>
                    <Box
                        gap={3}
                        mb={2}
                        mt={3}
                        display="flex"
                        width="100%">

                        <Typography 
                            sx={{float:"left", margin:"15", 
                                color: (theme) => theme.palette.mode === 'dark' ? '#fff' : '#1A2027'}} 
                            variant="h3" fontSize={40} fontWeight={700} color="#11142d">
                        {!allColori.length
                            ? "Non ci sono Colori"
                            : "Colori"}
                        </Typography>

                        <Box
                            display="contents"
                            justifyContent="flex-end"
                            flexWrap="wrap-reverse"
                            mb={{ xs: "15px", sm: 0 }}>

                            <TextField
                                variant="outlined"
                                color="info"
                                placeholder="Search by title"
                                value={currentFilterValues.name}
                                onChange={(e) => {
                                    setFilters([
                                        {
                                            field: "name",
                                            operator: "contains",
                                            value: e.currentTarget.value
                                                ? e.currentTarget.value
                                                : undefined,
                                        },
                                    ]);
                                }}
                            />

                            <CustomButton
                                title={`Ordina per Nome ${
                                    currentName === "asc" ? "↑" : "↓"
                                }`}
                                handleClick={() => toggleSort("name")}
                                backgroundColor="#475be8"
                                color="#fcfcfc"/>
                        </Box>

                        <Box
                            sx={{marginLeft: "auto"}}>
                                
                            <CustomButton
                                title="Colori"
                                handleClick={handleOpen}
                                backgroundColor="#475be8"
                                color="#fcfcfc"
                                icon={<Add />}
                            />
                            
                        </Box>
                        
                    </Box>
                </Stack>
            </Box>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description">
                    
                <Box sx={{ ...style, width: 600 }}>

                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Crea colore
                        <IconButton onClick={handleClose} color="primary" sx={{float:"right"}}><CloseIcon/>
                        </IconButton>
                    </Typography>

                    <ColoreForm

                        register={register}
                        onFinish={onFinish}
                        formLoading={formLoading}
                        handleSubmit={handleSubmit}
                        control = {control}
                        onFinishHandler={onFinishHandler}/>
                </Box>
            </Modal>
            

            <Paper variant="outlined"
                sx={{
                    padding:"10px",
                    marginTop: "20px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px",
                    backgroundColor: (theme) =>
                    theme.palette.mode === 'dark' ? '#17161B' : '#fff',
                }}
            >
                <Grid container spacing={1}>
                    {allColori.map((colore) => (
                        <Grid item key={colore._id} xs={4} sm={4} md={3} lg={2} sx={{ marginTop: 1, marginBottom: 1 }}>
                            <ColoreCard
                                hex={colore.hex}
                                name={colore.name}
                                _id={colore._id}
                                codice={colore.codice}
                                lotti={colore.lotti}
                                />
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            {allColori.length > 0 && (
                <Box display="flex" gap={2} mt={3} flexWrap="wrap">
                    <CustomButton
                        title="Previous"
                        handleClick={() => setCurrent((prev) => prev - 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={!(current > 1)}
                    />
                    <Box
                        display={{ xs: "hidden", sm: "flex" }}
                        alignItems="center"
                        gap="5px"
                    >
                        Page{" "}
                        <strong>
                            {current} of {pageCount}
                        </strong>
                    </Box>
                    <CustomButton
                        title="Next"
                        handleClick={() => setCurrent((prev) => prev + 1)}
                        backgroundColor="#475be8"
                        color="#fcfcfc"
                        disabled={current === pageCount}
                    />
                    <Select
                        variant="outlined"
                        color="info"
                        displayEmpty
                        required
                        inputProps={{ "aria-label": "Without label" }}
                        defaultValue={25}
                        onChange={(e) =>
                            setPageSize(
                                e.target.value ? Number(e.target.value) : 25,
                            )
                        }
                    >
                    {[25, 50, 75, 100, 125].map((size) => (
                        <MenuItem key={size} value={size}>
                            Show {size}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            )}
        </Box>
    );
};

export default ColoreList;