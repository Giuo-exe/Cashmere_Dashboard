import { FatturaG, FatturaGridProps, PagamentiGridProps } from "interfaces/grid"

import * as React from 'react';
import {Box, Card} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const columns: GridColDef[] = [
  {
    field: 'id',
    headerName: 'DDT N°',
    width: 100,
    editable: false,
  },
  {
    field: 'destinatario',
    headerName: 'Destinatario',
    width: 200,
    editable: false,
  },
  {
    field: 'causale',
    headerName: 'Causale',
    width: 150,
    editable: false,
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
    field: 'beni',
    headerName: 'Beni',
    width: 100,
    editable: false,
  },
  {
    field: 'kg',
    headerName: 'Kg',
    width: 150,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value} Kg`;
    },
  },
  {
    field: 'balle',
    headerName: 'Balle',
    width: 80,
    editable: false,
  },
  {
    field: 'fattura',
    headerName: 'Fattura',
    width: 200,
    editable: false,
  },
  {
    field: '_id',
    headerName: 'Option',
    sortable: false,
    width: 70,
    renderCell: (params) => {
      return (
        <>
          <Link to={`/ddt/show/${params.row._id}`} state={`${params.row._id}`}>
            <VisibilityIcon color="info"/>
          </Link>
        </>
      );
    }
  },
];

export default columns;