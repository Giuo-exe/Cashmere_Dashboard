import { FatturaG, FatturaGridProps, PagamentiGridProps } from "interfaces/grid"

import * as React from 'react';
import {Box, Typography} from "@mui/material"
import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const columns: GridColDef[] = [
  { 
    field: 'id',
    headerName: 'ID', 
    width: 90 
  },
  {
    field: 'cliente',
    headerName: 'Cliente',
    width: 100,
    editable: false,
  },
  {
    field: 'scadenza',
    headerName: 'Scadenza',
    type: 'date',
    width: 150,
    editable: false,
    valueFormatter: params => new Date(params?.value).toLocaleDateString(),
    renderCell: (params) => {
        const isDateInFuture = new Date(params.value) < new Date();
        return (
          <div style={{ color: isDateInFuture ? 'red' : 'inherit' }}>
            {new Date(params.value).toLocaleDateString()}
          </div>
        );
      },
  },
  {
    field: 'incassato',
    headerName: 'Incassato',
    width: 100,
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
    width: 100,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  }, 
  {
    field: 'visibility',
    headerName: 'Option',
    sortable: false,
    width: 70,
    renderCell: (params) => {
      return (
        <>
          <Link to={`/fatture/show/${params.row._id}`} state={`${params.row._id}`}>
            <VisibilityIcon color="info"/>
          </Link>
        </>
      );
    }
  },
];

export default columns;