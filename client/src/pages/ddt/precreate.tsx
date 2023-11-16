import { useState } from "react";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";

import Form from "components/common/ClienteForm";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import FatturaForm from "components/common/FatturaForm";
import DdtForm from "components/common/DdtForm";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Box, Card, CardContent, Stack } from "@mui/material";
import DdtMiddleLotti from "./DdtMiddleLotti";
import Cart from "./Cart";



const DdtPreCreate : React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    const {type} = useParams()

    const tipologia : string = type != null ? type : ""


    const precreateContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
      };
    
      const lottiContainerStyle = {
        // Add styles for lotti container here
      };
    
    
    const onFinishHandler =  async (data: FieldValues) => {
        await onFinish({...data});
    };

    return (
        <>
            <Box >
                <DdtMiddleLotti type = {tipologia}/>
            </Box>

            <Box >
                    <Cart type = {tipologia}/>
            </Box>
        </>
        );
};
export default DdtPreCreate;