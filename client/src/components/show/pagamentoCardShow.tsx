import { useGetIdentity } from "@refinedev/core";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import {Grid, Card, Typography, CardContent, Button} from "@mui/material";
import { DdtProps } from "interfaces/ddt";
import { FatturaProps } from "interfaces/fattura";
import { DataGrid, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { FatturaGridProps, FatturaShowGridProps, PagamentiGridProps } from "interfaces/grid";
import columns from "components/grid/PagamentiGrid";

const PagamentoGridShow = ({
  _id,
  identificativo,
  data,
  id,
  kg,
  cliente,
  ammount,
  note,
  fattura
}: PagamentiGridProps) => {


    const rows: PagamentiGridProps[] = [];

    rows.push({
        id: (identificativo as string),
        data : data,
        ammount: ammount,
        note: note,
        kg: kg,
        fattura: fattura,
        cliente: cliente,
        _id: _id,
  });
    return (

          <DataGrid
            sx={{height:"auto"}}
            rows={rows}
            columns={columns}
            hideFooterPagination={true}
            initialState={{
            pagination: {
                paginationModel: {
                pageSize: 20,
                },
            },
            }}
            pageSizeOptions={[1]}
            disableRowSelectionOnClick
        />
    );
};

export default PagamentoGridShow;