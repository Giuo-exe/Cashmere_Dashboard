import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LocationCity from "@mui/icons-material/LocationCity";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import ArticleIcon from '@mui/icons-material/Article';
import { useGetIdentity } from "@refinedev/core";
import {Box ,Typography, Stack, Card, Paper} from "@mui/material"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";


import { InfoBarProps } from "interfaces/agent";
import { ClienteCardProp } from "interfaces/cliente";
import { randomNumberBetween } from "@mui/x-data-grid/utils/utils";
import {useState} from "react"

const color = ["#d9ed92ff","#b5e48cff","#99d98cff","#76c893ff","#52b69aff","#34a0a4ff","#168aadff","#1a759fff","#1e6091ff","#184e77ff"];


function checkImage(url: any) {
    const img = new Image();
    img.src = url;
    return img.width !== 0 && img.height !== 0;
}

const InfoBar = ({ icon, name }: InfoBarProps) => (
    <Stack
        flex={1}
        minWidth={{ xs: "100%", sm: 300 }}
        gap={1.5}
        direction="row"
    >
        {icon}
        <Typography fontSize={14} color="#808191">
            {name}
        </Typography>
    </Stack>
);

const ClientCard = ({
    id,
    name,
    email,
    telefono,
    indirizzo,
    noOfFatture,
    contoterzi,
    piva
}: ClienteCardProp) => {
    
    const navigate = useNavigate();
    const randomNumber = Math.floor(Math.random() * 100) % color.length;
    const partitaiva = piva !== undefined ? piva : "";

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };

      const handleClick = () => {
        navigate(`/clienti/show/${id}`)
      }

    return (
        <Paper 
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "20px",
                boxShadow: isHovered ? "0 22px 45px 2px rgba(176,176,176,0.1)" : "none",
                transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            <Stack
                direction="row" gap={3}> 

                <Box
                    width={110}
                    height={110}
                    justifyContent="center"
                    style={{ borderRadius: 8 , backgroundColor: color[randomNumber]}}>
                    
                    <Typography
                        fontSize={40}
                        fontWeight={600}
                        color="#11142d"
                        sx={{
                            textAlign: "center",
                            
                            textTransform: "uppercase",
                        }}>
                            {name[0]}

                    </Typography>
                    
                    
                </Box>
                <Stack
                    direction="column"
                    justifyContent="space-between"
                    flex={1}
                    gap={{ xs: 4, sm: 2 }}
                >
                    <Stack
                        gap={2}
                        direction="row"
                        flexWrap="wrap"
                        alignItems="center"
                    >
                        <Typography fontSize={22} fontWeight={600} sx={{color : (theme) => theme.palette.mode == "dark" ? '#fff' : '#1A2027'}}>
                            {name}
                        </Typography>
                        <Typography fontSize={14} color="#808191" >
                            {contoterzi ? "Conto Terzi" : "Cliente"}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                    >
                        <InfoBar
                            icon={<EmailOutlined sx={{ color: "#808191" }} />}
                            name={email}
                        />
                        <InfoBar
                            icon={<Place sx={{ color: "#808191" }} />}
                            name={indirizzo}
                        />
                        <InfoBar
                            icon={<Phone sx={{ color: "#808191" }} />}
                            name={telefono}
                        />
                        <InfoBar
                            icon={<ArticleIcon sx={{ color: "#808191" }} />}
                            name={`iva: ${partitaiva} `}
                        />
                        <InfoBar
                            icon={<LocationCity sx={{ color: "#808191" }} />}
                            name={`${noOfFatture} Fatture`}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Paper>
    );
};

export default ClientCard;