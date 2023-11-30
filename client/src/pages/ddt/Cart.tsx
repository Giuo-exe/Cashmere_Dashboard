import React from 'react';
import { useCart } from '../../utils/CartContext';
import { Box, Card, CardContent, List, ListItem, Typography, Stack, IconButton, ListSubheader, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import CustomButton from 'components/common/CustomBotton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';



const Cart = (type: any) => {
    const navigate = useNavigate();
    const { removeFromCart,cart } = useCart();

    const handleRemoveToCart = (index: any) => {
        removeFromCart(index)
    }


    const slideUpAnimation = {
        animation: `slide-up 0.5s ease forwards`,
        '@keyframes slide-up': {
            'from': { bottom: '-100%' },
            'to': { bottom: '0' }
        }
    };
    
    const cartStyle = {
        position: 'fixed' as 'fixed', // Posizionamento fisso
        bottom: 0, // In fondo alla pagina
        width: '90vw', // Larghezza completa
        height: cart.length > 0 ? '25vh' : '0', // Altezza: 25% della vista se ci sono elementi, altrimenti 0
        overflow: 'hidden', // Nasconde il contenuto in eccesso
        transition: 'height 0.5s ease', // Transizione fluida per l'altezza
        backgroundColor: '#fff', // Sfondo (modificabile)
        // Altri stili necessari...
    };
   

    return (
// ... Altre importazioni e codice ...
// Dentro il tuo componente dove mostri il carrello
    <Box style={cartStyle}>
       <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ 
                backgroundColor: '#e0f7fa', // Sfondo celeste chiaro
                padding: '10px', // Padding per dare spazio ai contenuti
                borderRadius: '5px', // Bordi arrotondati per estetica
                boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', // Ombra leggera per un effetto sollevato
                width: '100%', // Larghezza massima per occupare lo spazio necessario
            }}>
            <Typography 
                variant="h5" 
                fontSize={40} 
                fontWeight={400} 
                color="#11142d" 
                gutterBottom>
                Carrello
            </Typography>

            {cart.length > 0 && (
                <CustomButton
                    handleClick={() => navigate(`/ddt/create/${type.type}`)}
                    title='Procedi'
                    backgroundColor='#28DEB5'
                    color='white' />
            )}
        </Stack>
        
        <List
            sx={{width: "50%", overflowY:"auto"}}
            aria-labelledby="nested-list-subheader"
            >
            {cart.map((item, index) => (
                <ListItem disablePadding key={item.idcart}>
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText 
                        primary={
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant='body2' fontWeight="bold">
                                    {`${item.lottoname} - ${item.colorename} ${item.kg} kg Balle ${item.n}`}
                                </Typography>
                                <Card sx={{ height: "20px", width: "20px", backgroundColor: `${item.hex}` }} />
                            </Stack>
                        }
                    />
                    <ListItemButton sx={{width: "auto"}} onClick={() => handleRemoveToCart(item)}>
                        <DeleteIcon />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
        
    </Box>

  );
};

export default Cart;
