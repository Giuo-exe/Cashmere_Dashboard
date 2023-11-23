import { useState } from "react";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";

import Form from "components/common/ClienteForm";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import FatturaForm from "components/common/FatturaForm";

const FatturaEdit : React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    const { data, isLoading, isError } = useList({ resource: "clienti" });

    const allClienti = data?.data ?? [];
    const ddts = GetDDTs();

    const nomi = allClienti.map((clienti) => clienti.name)
    console.log(nomi);
    const onFinishHandler =  async (data: FieldValues) => {
        await onFinish({...data});
    };

    return (
            <FatturaForm
                type="Edit"
                register={register}
                onFinish={onFinish}
                formLoading={formLoading}
                handleSubmit={handleSubmit}
                onFinishHandler={onFinishHandler}
                clienti={nomi}
                ddts = {ddts}

            />
        );
};

const GetDDTs = () => {
    const { data, isLoading, isError } = useList({ resource: "ddt/vendita" });
    const allDdt = data?.data ?? [];

    return allDdt

}
export default FatturaEdit;