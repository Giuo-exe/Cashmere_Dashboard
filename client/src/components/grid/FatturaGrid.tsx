import { FatturaG, FatturaGridProps, PagamentiGridProps } from "interfaces/grid"

import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import OkIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const columns: GridColDef[] = [
  { field: 'id',
    headerName: 'ID', 
    width: 120
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
    width: 150,
    editable: false,
    valueFormatter: params => new Date(params?.value).toLocaleDateString()
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
        <div style={{ color: params.row.pagato ? "inherit" : (isDateInFuture ? '#f02e4f' : 'inherit' )}}>
          {new Date(params.value).toLocaleDateString()}
        </div>
      );
    },
  },
  {
    field: 'note',
    headerName: 'Note',
    type: 'string',
    width: 150,
    editable: false,
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
    renderCell: (params) => {
      return (
        <div style={{ color: params.value > 0 ? "#6e2ef0" : "inherit" }}>
          {params.value.toFixed(2).toLocaleString()} €
        </div>
      );
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
    renderCell: (params) => {
      return (
        <div style={{ color: params.value !== 0 ? "#2e6ff0" : "inherit" }}>
          {params.value.toFixed(2).toLocaleString()} €
        </div>
      );
    },
  },
  {
    field: 'pagamenti',
    headerName: 'Pagamenti',
    sortable: false,
    width: 100,
  },
  {
    field: 'ddt',
    headerName: 'Ddt',
    sortable: false,
    width: 100,
  },
  {
    field: 'pagato',
    headerName: 'Pagato',
    type: 'boolean',
    width: 100,
    renderCell: (params) => {
      return params.value ? <OkIcon color="success" /> : <CancelIcon color="error" />;
    }
  },
  {
    field: 'visibility',
    headerName: 'Visibility',
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