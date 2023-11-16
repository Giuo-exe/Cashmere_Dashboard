import { Box, Stack, Typography, Card, CardContent, Button, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import columns from "components/grid/FatturaGrid";
import { ClienteCardProp } from "interfaces/cliente";
import React from "react";
import { useList } from "@refinedev/core";
import Cronologia from "components/common/Cronologia";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { FatturaGridProps, PagamentiGridProps } from "interfaces/grid";




const ClienteShowCardView = ({ name, email, indirizzo, piva, rea, cap, cf, contoterzi, allFatture,id }: ClienteCardProp) => {

const allinfo = Allinfo(id)[0];

const rows: FatturaGridProps[] = []

if (allFatture) {
    allFatture.forEach((fattura : any) => {
        let incassato = 0;
        // Ensure that allPagamenti is defined and an array before calling forEach
        if (fattura.allPagamenti) {
            fattura.allPagamenti.forEach((pagamento: PagamentiGridProps) => {
                // Ensure that amount is a number before calling valueOf
                incassato += typeof pagamento.ammount === 'number' ? pagamento.ammount.valueOf() : 0;
            });
        }
        console.log(fattura)

        // Ensure that id and totale are defined before casting
        rows.push({
            id: (fattura.id as string),
            cliente: name,
            totale: fattura.totale,
            iva: ((fattura.totale as number) / 100 * 22),
            data: fattura.data,
            scadenza: fattura.scadenza,
            note: fattura.note,
            incassato: incassato,
            saldo: ((fattura.totale as number) - incassato),
            pagato: fattura.pagato,
            pagamenti: fattura.allPagamenti.length,
            ddt: fattura.allDdt.length,
            _id: fattura._id,
        });
    });
}
console.log(rows)

  return (
      <Box p={4}>
          <Card variant="outlined" style={{ marginBottom: "20px" }}>
            <Grid container spacing={3}>
                <Grid item xs={8}>
                    <CardContent>
                        <Typography variant="h5" component="div">{name}</Typography>
                        {indirizzo && <Typography variant="body2">Indirizzo: {indirizzo}</Typography>}
                        {cap && <Typography variant="body2">CAP: {cap}</Typography>}
                        {email && <Typography variant="body2">Email: {email}</Typography>}
                        {piva && <Typography variant="body2">P.IVA: {piva}</Typography>}
                        {rea && <Typography variant="body2">REA: {rea}</Typography>}
                        {cf && <Typography variant="body2">CF: {cf}</Typography>}
                    </CardContent>
                </Grid>
                <Grid item xs={4}>
                    <Box display="flex" flexDirection="column" alignItems="flex-end" p={2}>
                        <Typography variant="subtitle1" gutterBottom>
                            Totale speso
                        </Typography>
                        <Box display="flex" alignItems="center" marginBottom={2}>
                            <Typography variant="h4" component="span" color="primary" style={{ fontWeight: 600 }}>
                                {allinfo?.totaleSpeso || "0"} €
                            </Typography>
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Totale Kg
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Typography variant="h4" component="span" color="primary" style={{ fontWeight: 600 }}>
                                {allinfo?.totaleKg || "0"} kg
                            </Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
          </Card>
  
            <Box sx={{ height: 400, width: '100%'}}>
                <Typography variant="h5" gutterBottom>
                    Fatture
                </Typography>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    hideFooterPagination={true}
                    sx={{
                    boxShadow: 2,
                    border: 2,
                    }}
                />
            </Box>
  
          
        <Box 
            sx={{marginTop:"50px"}}>

            <Typography variant="h5" gutterBottom>
                Cronologia
            </Typography>
            <Cronologia
                azioni={allinfo?.azioni}/>
        </Box>
          
      </Box>
  );
}

const Allinfo = (id : any) => {
    const { data } = useList({ resource: `clienti/allinfo/${id}` });

    const allInfo = data?.data ?? [];

    return allInfo
}
export default ClienteShowCardView