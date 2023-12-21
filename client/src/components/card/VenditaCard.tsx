import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Box, Grid, Card, Stack, TextField, Autocomplete } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useCart } from 'utils/CartContext';
import AddIcon from '@mui/icons-material/Add';

// Define a modern color palette
const colors = {
  primary: '#546e7a', // Cool grey
  secondary: '#ECF0F1', // Vibrant pink
  background: '#eceff1', // Light grey-blue
  text: '#ffffff', // Dark grey-blue
  inputBg: '#ffffff', // White
  textOutline: '#000000'
};

const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.2)',
  borderRadius: '8px', // subtle rounded corners
  transition: 'box-shadow 0.3s',
  '&:hover': {
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: colors.background,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: colors.textOutline, // Border color
    },
    '&.Mui-focused fieldset': {
      borderColor: colors.secondary, // Border color when focused
    },
  },
  '& .MuiInputBase-input': {
    color: colors.textOutline, // Text color
  },
});

const OutlinedTypography = styled(Typography)({
    color: colors.text,
    textShadow: `
      -1px -1px 0 ${colors.textOutline},  
       1px -1px 0 ${colors.textOutline},
      -1px  1px 0 ${colors.textOutline},
       1px  1px 0 ${colors.textOutline}`,
       textTransform: 'uppercase',
  });

const VenditaCardApp = ({ item, lots }: { item: any; lots: any[] }) => {

    const { addToCart, cart } = useCart();
    const [kgInput, setKgInput] = useState('');
    const [balesInput, setBalesInput] = useState('');
    const [remainingKg, setRemainingKg] = useState<number>(item?.totalKg || 0);
    const [remainingBales, setRemainingBales] = useState<number>(item?.n || 0);
    const [selectedLot, setSelectedLot] = useState(null);

    const lottiName = lots.map((item : any) => item.name)
    console.log(lots)
  
    const handleAddToCart = () => {
      const inputValueKg = parseFloat(kgInput);
      const inputValueBales = parseInt(balesInput, 10);
  
      if (!isNaN(inputValueKg) && inputValueKg > 0 && inputValueKg <= remainingKg) {
        const newItem = {
          idcart: Date.now(),
          lottoname: selectedLot,
          lotto: item.lotto,
          colorename: item.colorInfo.name,
          colore: item.colorInfo._id,
          hex: item.colorInfo.hex,
          kg: inputValueKg,
          n: inputValueBales
        };
  
        addToCart(newItem);
  
        setRemainingKg(prev => prev - inputValueKg);
        setRemainingBales(prev => prev - inputValueBales);
  
        setKgInput('');
        setBalesInput('');
      } else {
        console.error('Invalid input');
      }
    };
  
    useEffect(() => {
      let totalKg = item?.totalKg || 0;
      let totalBales = item?.n || 0;
  
      cart.forEach((cartItem) => {
        if (cartItem.lotto === item?.lotto && cartItem.colore === item?.colore) {
          totalKg -= cartItem.kg;
          totalBales -= cartItem.n;
        }
      });
  
      setRemainingKg(totalKg);
      setRemainingBales(totalBales);
    }, [cart, item]);

  

  return (
    <StyledCard elevation={3} sx={{ maxWidth: '100%', m: 1 }}>
      <Box bgcolor={item?.colorInfo?.hex || colors.background} sx={{ borderRadius: '8px 8px 0 0', p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <OutlinedTypography variant="h6" sx={{ fontWeight: 'bold' }}>
          {item?.colorInfo?.name}/{item?.colorInfo?.codice}
        </OutlinedTypography>
        <OutlinedTypography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: colors.secondary }}>
          {remainingKg?.toFixed(2)} Kg
        </OutlinedTypography>
      </Box>
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, backgroundColor: colors.inputBg }}>
        <StyledTextField
          label="Kg"
          variant="outlined"
          size="small"
          value={kgInput}
          onChange={(e) => setKgInput(e.target.value)}
        />
        <StyledTextField
          label="Bales"
          variant="outlined"
          size="small"
          value={balesInput}
          onChange={(e) => setBalesInput(e.target.value)}
        />
         <Autocomplete
          options={lottiName} // The array of lot options
        //   getOptionLabel={(option) => `${option.name} - ${option.quantity} Kg`} // How options are rendered in the menu
          style={{ width: 300 }} // Adjust the width as needed
          renderInput={(params) => <TextField {...params} label="Choose a lot" variant="outlined" />}
          value={selectedLot}
          onChange={(event, newValue) => {
            setSelectedLot(newValue);
            // Additional logic to handle selection change
          }}
        />
        <Button variant="contained" style={{ backgroundColor: colors.primary, color: '#fff' }}>
          Submit
        </Button>
        <Button onClick={handleAddToCart}>
          <AddIcon /> Add to Cart
        </Button>
      </Box>
    </StyledCard>
  );
};

const VenditaCard = ({ stats, lots }: { stats: any[],lots: any[] }) => {
  const safeStats = Array.isArray(stats) ? stats : [];
  
  return (
    <Grid container spacing={2} sx={{ maxWidth: '100%' }}>
      {safeStats?.map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <VenditaCardApp item={item} lots={lots} />
        </Grid>
      ))}
    </Grid>
  );
};

export default VenditaCard;
