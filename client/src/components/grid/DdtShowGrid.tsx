import { FatturaG, FatturaGridProps, PagamentiGridProps } from "interfaces/grid"

import * as React from 'react';
import {Box, Card} from '@mui/material';
import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const columns: GridColDef[] = [
  {
    field: 'bene',
    headerName: 'Beni',
    width: 400,
    editable: false,
  },
  {
    field: 'hex',
    headerName: 'Colore',
    sortable: false,
    width: 160,
    renderCell: (params) => {
      return (
        <>
          <Card color={`#${params.row.hex}`} 
            sx={{height:"20px", 
                width:"20px", 
                backgroundColor:`${params.value}`}}/>
        </>
      );
    }
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
    field: 'n',
    headerName: 'N',
    width: 80,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value}`;
    },
  }
];

export default columns;