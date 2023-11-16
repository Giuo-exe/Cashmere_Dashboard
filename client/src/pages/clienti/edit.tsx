import { useState } from "react";
import { useGetIdentity } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import ClienteFormEdit from "components/common/ClienteFormEdit";

const ClienteEdit : React.FC<IResourceComponentsProps> = () => {
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
        <ClienteFormEdit
            type="Modifica"
            register={register}
            onFinish={onFinish}
            formLoading={formLoading}
            handleSubmit={handleSubmit}
            onFinishHandler={onFinishHandler}
        />
    );
};
export default ClienteEdit;