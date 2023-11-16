import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";

import ClienteForm from "components/common/ClienteForm";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";

const ClienteCreate : React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
    } = useForm();

    const onFinishHandler =  async (data: FieldValues) => {
        console.log(data)
        await onFinish({...data});
    };

    return (
        <ClienteForm
            type="Crea"
            register={register}
            onFinish={onFinish}
            formLoading={formLoading}
            handleSubmit={handleSubmit}
            onFinishHandler={onFinishHandler}
        />
    );
};
export default ClienteCreate;