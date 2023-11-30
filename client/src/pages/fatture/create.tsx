import { useState } from "react";
import { useList } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

import { FieldValues } from "react-hook-form";

import Form from "components/common/ClienteForm";
import { IResourceComponentsProps } from "@refinedev/core/dist/contexts/resource";
import FatturaForm from "components/common/FatturaForm";

const FatturaCreate : React.FC<IResourceComponentsProps> = () => {
    const {
        refineCore: { onFinish, formLoading },
        register,
        handleSubmit,
        setValue
    } = useForm();

    const { data, isLoading, isError } = useList({ resource: "clienti" });

    const allClienti = data?.data ?? [];

    const ddts = GetDDTs()
    
    const onFinishHandler =  async (data: FieldValues) => {
        const emissionDate = new Date(data.data);
        const dueDate = new Date(data.scadenza);

    // Controlla se la data di scadenza è antecedente alla data di emissione
        if (dueDate < emissionDate) {
            // Se la data di scadenza è antecedente, mostra un messaggio di errore o gestisci l'errore
            alert("La data di scadenza non può essere antecedente alla data di emissione.");
            return; // Interrompi l'esecuzione ulteriore della funzione
        }
        await onFinish({...data});
        console.log(data)
    };

    return (
            <FatturaForm
                type="Crea"
                register={register}
                onFinish={onFinish}
                formLoading={formLoading}
                handleSubmit={handleSubmit}
                onFinishHandler={onFinishHandler}
                clienti={allClienti}
                ddts = {ddts}
                setValue = {setValue}
            />
        );
};


const GetDDTs = () => {
    const { data, isLoading, isError } = useList({ resource: "ddt/vendita" });
    const allDdt = data?.data ?? [];

    return allDdt

}
export default FatturaCreate;