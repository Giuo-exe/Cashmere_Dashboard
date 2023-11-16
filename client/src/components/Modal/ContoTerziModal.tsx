import {Modal , Button, Box, Stack, FormControl, TextField, Input, IconButton, Typography, } from "@mui/material"
import { IResourceComponentsProps, useParsed } from "@refinedev/core";
import ContoTerziForm from "components/common/ContoTerziForm";
import CustomButton from "components/common/CustomBotton";
import { ContoTerzi, updateContoTerzi } from "interfaces/lotto";
import * as React from 'react';
import { useForm , useModalForm } from "@refinedev/react-hook-form";
import { FieldValues, Form } from "react-hook-form";
import CloseIcon from '@mui/icons-material/Close';

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

const ContoTerziModal : React.FC<IResourceComponentsProps>= () => {
    const { id } = useParsed();
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useModalForm({
        refineCoreProps: {action:"create", resource: "contoterzi"}
    });
    


    const onFinishHandler = async (data: FieldValues) => {
        data.lotto = id;
        await onFinish({...data})
        
    };

    const [open, setOpen] = React.useState(false);
        const handleOpen = () => {
            setOpen(true);
        };
        const handleClose = () => {
            setOpen(false);
        };
        
    return(
    <>
        <Button onClick={handleOpen}>Manda al ContoTerzi</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description">

            <Box sx={{ ...style, width: 600 }}>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Manda al ContoTerzi
                    <IconButton onClick={handleClose} color="primary" sx={{float:"right"}}><CloseIcon/>
                    </IconButton>
                </Typography>

                <ContoTerziForm
                    beni={"w"}
                    type="Create"
                    register={register}
                    onFinish={onFinish}
                    formLoading={formLoading}
                    handleSubmit={handleSubmit}
                    onFinishHandler={onFinishHandler}/>
            </Box>
        </Modal>
    </>
    );
}

export default ContoTerziModal;