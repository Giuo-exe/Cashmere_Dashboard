import React from 'react';
import { Avatar, Box, Typography, Card, CardContent , Link} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

interface Azione {
    data: string;
    tipo: "Pagamento" | "Fattura";
    descrizione: string;
    ammount?: number;
    id?: string
    kg?: number
}

interface TipoStyle {
    backgroundColor: string;
    icon: JSX.Element;
    size: number;
}

const tipoStyles: Record<string, TipoStyle> = {
    "Pagamento": {
        backgroundColor: '#b9fbc0',
        icon: <PaymentIcon />,
        size: 40
    },
    "Fattura": {
        backgroundColor: '#90dbf4',
        icon: <ReceiptIcon />,
        size: 50
    },
    "Ddt": {
        backgroundColor: '#f1c0e8',
        icon: <LocalShippingIcon />,
        size: 50
    }
    // Aggiungi altri tipi e stili qui se necessario
};

interface CronologiaProps {
    azioni: Azione[];
}

const Cronologia: React.FC<CronologiaProps> = ({ azioni }) => {
    return (
        <Card variant="outlined" sx={{maxHeight:"400px", overflowY:"auto"}}>
            <CardContent>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                    
                    {azioni?.map((azione, index) => {
                        const link = azione.tipo === "Fattura" ? `/fatture/show/${azione.id}` : 
                                    azione.tipo === "Pagamento" ? `/pagamento/show/${azione.id}` : 
                                    azione.tipo === "Ddt" ? `/ddt/show/${azione.id}` : ""

                        const dateObj = new Date(azione.data);
                        const day = dateObj.toLocaleDateString('it-IT', { day: '2-digit' });
                        const month = dateObj.toLocaleDateString('it-IT', { month: 'long' });
                        const year = dateObj.toLocaleDateString('it-IT', { year: 'numeric' });
                        
                        const dataFormat: string = `${day} ${month} ${year}`;

                        return (
                        <React.Fragment key={index}>
                            <Link href={link} underline="none" sx={{ color: 'inherit', textDecoration: 'none' }}>
                                <Box display="flex" alignItems="center">
                                    <Avatar 
                                        style={{ 
                                            backgroundColor: tipoStyles[azione.tipo]?.backgroundColor,
                                            color: "black",
                                            width: tipoStyles[azione.tipo]?.size,
                                            height: tipoStyles[azione.tipo]?.size,
                                            marginLeft: azione.tipo === "Pagamento" ? 5 : 0,
                                            border: '2px solid black',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        {tipoStyles[azione.tipo]?.icon}
                                    </Avatar>
                                    <Box ml={2}>
                                        <Typography variant="body1">{dataFormat}</Typography>
                                        <Typography variant="body2">
                                            {`${azione.descrizione} `} 
                                            {azione.ammount && `${azione.ammount} €`}
                                            {azione.kg && `${azione.kg} kg`}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Link>
                            {index !== azioni.length - 1 && (
                                <Box
                                    height={50}
                                    width={4}
                                    style={{
                                        marginLeft: "23px",
                                        backgroundImage: `linear-gradient(${tipoStyles[azioni[index].tipo]?.backgroundColor}, ${tipoStyles[azioni[index + 1].tipo]?.backgroundColor})`
                                    }}
                                />
                            )}
                        </React.Fragment>
                    )})}
                </Box>
        </CardContent>
    </Card>
    );
};

export default Cronologia;
