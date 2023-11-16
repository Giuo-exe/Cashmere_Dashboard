import { useGetIdentity } from "@refinedev/core";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { Link } from "react-router-dom";
import {Grid, Card, Typography, CardContent, Button} from "@mui/material";
import { DdtProps } from "interfaces/ddt";
import { FatturaProps } from "interfaces/fattura";
import { DataGrid, GridColDef, GridValueFormatterParams } from "@mui/x-data-grid";
import { FatturaGridProps, FatturaShowGridProps, PagamentiGridProps } from "interfaces/grid";

const columns: GridColDef[] = [
  { field: 'id',
    headerName: 'ID', 
    width: 100 
  },
  {
    field: 'cliente',
    headerName: 'Cliente',
    width: 150,
    editable: false,
  },
  {
    field: 'totale',
    headerName: 'Totale',
    width: 120,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  },
  {
    field: 'iva',
    headerName: 'Iva',
    width: 100,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  },
  {
    field: 'data',
    headerName: 'Data Emissione',
    type: 'date',
    width: 130,
    editable: false,
    valueFormatter: params => new Date(params?.value).toLocaleDateString()
  },
  {
    field: 'scadenza',
    headerName: 'Scadenza',
    type: 'date',
    width: 130,
    editable: false,
    valueFormatter: params => new Date(params?.value).toLocaleDateString()
  },
  {
    field: 'note',
    headerName: 'Note',
    type: 'string',
    width: 130,
    editable: false,
  },
  {
    field: 'incassato',
    headerName: 'Incassato',
    width: 110,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  },
  {
    field: 'saldo',
    headerName: 'Saldo',
    sortable: false,
    width: 120,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  }, 
  {
    field: 'pagamenti',
    headerName: 'Pagamenti',
    sortable: false,
    width: 70,
  },
  {
    field: 'ddt',
    headerName: 'Ddt',
    sortable: false,
    width: 70,
  }
];

const FatturaGridShow = ({
  _id,
  data,
  id,
  cliente,
  totale,
  note,
  scadenza,
  incassato,
  pagato,
  allPagamenti,
  allDdt

}: FatturaShowGridProps) => {

  console.log(allPagamenti)

    const rows: FatturaGridProps[] = [];

    rows.push({
      id: (id as string),
      cliente: cliente,
      totale: totale,
      iva: ((totale as number) / 100 * 22),
      data: data,
      scadenza: scadenza,
      note: note,
      incassato: incassato,
      saldo: ((totale as number) - (incassato as number)),
      pagamenti: allPagamenti,
      ddt: allDdt,
      pagato: pagato,
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

export default FatturaGridShow;