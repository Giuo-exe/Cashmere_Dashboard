import { Box, Stack, Typography, Card, CardContent, Grid, Button, Link } from "@mui/material";
import { AllPagamenti } from "interfaces/infoBox";
import { useNavigate } from "react-router-dom";

const Infobox = ({ title, list, navigation, fatturaid, rimanente }: AllPagamenti) => {
    const navigate = useNavigate();

    return (
        <Card
            square
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'start',
                minWidth: '400px',
                height: '400px',
                padding: '16px',
                boxShadow: 3,  // Adding shadow for a raised appearance
            }}>
            <Grid container alignItems="center" justifyContent="space-between" mb={3}>
                <Grid item>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                </Grid>
                <Grid item>
                    {rimanente ? (
                            <Button
                                variant="contained"
                                onClick={() => navigate(`/pagamenti/create`, { state: { fatturaId: fatturaid, rimanente: rimanente } })}
                                sx={{
                                    backgroundColor: '#f00000',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#d00000',
                                    },
                                }}
                            >
                                + {title}
                            </Button>
                        ) : (
                            <Button
                                variant="contained"
                                onClick={() => navigate(navigation, { state: { fatturaId: fatturaid } })}
                                sx={{
                                    backgroundColor: '#f00000',
                                    color: '#fff',
                                    '&:hover': {
                                        backgroundColor: '#d00000',
                                    },
                                }}
                            >
                                + {title}
                            </Button>
                        )}
                </Grid>
            </Grid>

            <Stack direction="column" alignItems="center" spacing={2}>
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                    {list?.map((item) => {
                        const href = rimanente ? `/pagamenti/show/${item._id}` : `/ddt/show/${item._id}`

                        return (
                        <Link
                            key={item._id}
                            href={href}
                            underline="none"
                            sx={{
                                width: '100%',
                                color: 'black',
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                {rimanente ? "Fattura N° " : "DDT N°"} {item.id}
                            </Typography>
                        </Link>
                    )})}
                </Box>
            </Stack>
        </Card>
    );
};

export default Infobox;
