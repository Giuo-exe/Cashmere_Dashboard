import { useLogin } from "@refinedev/core";
import { useEffect, useRef } from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ThemedTitleV2 } from "@refinedev/mui";

import { yariga } from "../assets";

import { CredentialResponse } from "../interfaces/google";

// Todo: Update your Google Client ID here
const GOOGLE_CLIENT_ID = "244746244675-1p7ek5s6sjofd094r75opcf2cpc36611.apps.googleusercontent.com";

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);
    

    return <div ref={divRef} />;
  };

  return (
    <Container
      style={{
        height: "100vh",
        width: '100vw', // Assicura che il Container occupi l'intera larghezza della vista
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: 'linear-gradient(135deg, #83a4d4, #b6fbff)', // Sfondo sfumato
        margin: 0, // Rimuove margini predefiniti
        padding: 0, // Rimuove padding predefiniti
        maxWidth: 'none', // Sovrascrive eventuali restrizioni sulla larghezza massima
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap="36px"
      >
        <img src={yariga} alt="Refine Logo" style={{ maxWidth: '300px', margin: 'auto' }} />  
        <Typography 
          variant="h3" 
          align="center" 
          style={{ 
            fontWeight: 'bold', 
            marginBottom: '20px', // Sostituire con il colore desiderato
          }}
        >
          Cashmere Dashboard
        </Typography>

        <GoogleButton />

        <Typography align="center" color={"text.secondary"} fontSize="12px">
          Powered by
          <img
            style={{ padding: "0 5px", verticalAlign: 'middle' }}
            alt="Google"
            src="https://refine.ams3.cdn.digitaloceanspaces.com/superplate-auth-icons%2Fgoogle.svg"
          />
          Google
        </Typography>
      </Box>
    </Container>
  );
};
