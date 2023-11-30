import { FatturaG, FatturaGridProps, PagamentiGridProps } from "interfaces/grid"
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import OkIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Card } from "@mui/material";

const columns: GridColDef[] = [
  { field: 'descrizione',
    headerName: 'DESCRIZIONE', 
    flex: 0.30,
  },
  {
    field: 'hex',
    headerName: 'Colore',
    sortable: false,
    flex: 0.10,
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
    field: 'art',
    headerName: 'ART',
    flex: 0.15,
    editable: false,
  },
  {
    field: 'qnt',
    headerName: 'Q.TA KG',
    flex: 0.15,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} Kg`;
    },
  },
  {
    field: 'prezzo',
    headerName: 'PREZZO',
    flex: 0.25,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  },
  {
    field: 'importo',
    headerName: 'IMPORTO',
    flex: 0.30,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
    },
  },
];

export default columns;