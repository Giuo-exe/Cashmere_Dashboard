import { useState } from "react";
import { useList, useShow } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import PagamentoForm from "components/common/PagamentoForm";
import { PagamentiProps } from "interfaces/grid";
import { useLocation } from "react-router-dom"

const PagamentoCreate : React.FC<IResourceComponentsProps> = () => {

    const location = useLocation();
    let fatturaId = location.state.fatturaId;
    let rimanente = location.state.rimanente;

    console.log(fatturaId)


    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    const onFinishHandler =  async (data: FieldValues) => {
        data.fattura = fatturaId
        console.log(data)
        await onFinish({...data})
    };

    return (
            <PagamentoForm
                type="Create"
                register={register}
                onFinish={onFinish}
                formLoading={formLoading}
                handleSubmit={handleSubmit}
                onFinishHandler={onFinishHandler}
                rimanente = {rimanente}
            />
        );
};
export default PagamentoCreate;