import React from 'react'
import { IResourceComponentsProps } from "@refinedev/core";
import {Box, Typography  } from "@mui/material"
import {useList} from "@refinedev/core"
import { useState } from "react";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import Form from "components/common/ClienteForm";
import FatturaForm from "components/common/FatturaForm";
import LottiForm from 'components/common/LottiForm';

const LottiCreate: React.FC<IResourceComponentsProps> = () => {
  const {
    refineCore: { onFinish, formLoading },
    register,
    control,
    handleSubmit,
} = useForm();

const { data, isLoading, isError } = useList({ resource: "colori/condition" });

    const allColori = data?.data ?? [];

    console.log(allColori)

    const colori = allColori.map((colore) => ({name:colore.name,hex:colore.hex}))

const onFinishHandler =  async (data: FieldValues) => {
  console.log(data)
  await onFinish({...data});
};

  return (
    <>
      <LottiForm
        type="Create"
        register={register}
        onFinish={onFinish}
        formLoading={formLoading}
        handleSubmit={handleSubmit}
        onFinishHandler={onFinishHandler}
        colori={colori}
        control={control}
      />
    </>
  )
}

export default LottiCreate;