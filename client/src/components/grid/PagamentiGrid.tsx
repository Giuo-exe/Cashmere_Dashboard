import { DataGrid, GridColDef, GridValueGetterParams, GridValueFormatterParams } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

const columns: GridColDef[] = [
  { field: 'id',
    headerName: 'ID', 
    width: 90 
  },
  {
    field: 'ammount',
    headerName: 'Totale',
    width: 150,
    editable: false,
    valueFormatter: (params: GridValueFormatterParams<number>) => {
      if (params.value == null) {
        return '';
      }
      return `${params.value.toFixed(2).toLocaleString()} €`;
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
    field: 'data',
    headerName: 'Data Emissione',
    type: 'date',
    width: 150,
    editable: false,
    valueFormatter: params => new Date(params?.value).toLocaleDateString()
  },
  {
    field: 'fattura',
    headerName: 'Fattura',
    type: 'string',
    width: 150,
    editable: false,
  },
  {
    field: 'cliente',
    headerName: 'Cliente',
    type: 'string',
    width: 150,
    editable: false,
  },

  {
    field: 'visibility',
    headerName: 'Visibility',
    sortable: false,
    width: 160,
    renderCell: (params) => {
      
      return (
        <>
          <Link to={`/pagamenti/show/${params.row._id}`} state={`${params.row._id}`}>
            <VisibilityIcon color="info"/>
          </Link>
        </>
      );
    }
  },
];

export default columns;