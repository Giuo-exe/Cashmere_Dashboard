import {
  AuthBindings,
  Authenticated,
  GitHubBanner,
  Refine,
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  ErrorComponent,
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
} from "@refinedev/mui";

import { FatturaCreate, FatturaEdit, FatturaList, AddDdt } from "pages/fatture";

import {
  VillaOutlined,
} from "@mui/icons-material/";


import EuroIcon from '@mui/icons-material/Euro';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import GroupsIcon from '@mui/icons-material/Groups';
import DatasetIcon from '@mui/icons-material/Dataset';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GridViewIcon from '@mui/icons-material/GridView';
import ReceiptIcon from '@mui/icons-material/Receipt';



import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import axios, { AxiosRequestConfig } from "axios";
import { CredentialResponse } from "interfaces/google";

import { ClienteCreate, ClienteEdit, ClienteList } from "pages/clienti";
import { Login } from "pages/login";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { parseJwt } from "utils/parse-jwt";
import { Header } from "./components/header";

import { ColorModeContextProvider } from "./contexts/color-mode";
import { LegacyAuthenticatedProps } from "@refinedev/core/dist/components/authenticated";
import FatturaShow from "pages/fatture/show";
import { PagamentoListCreate, PagamentoList, PagamentoCreate, PagamentoShow } from "pages/pagamenti";
import { LottiCreate, LottiList, LottiShow, LottoFatturaList } from "pages/lotti";
import { ColoreCreate, ColoreList } from "pages/colori";
import { ContoTerziList, ContoTerziShow } from "pages/contoterzi";
import Dashboard from "pages/dashboard";
import ClientiShow from "pages/clienti/show";
import { DdtList,DdtCreate,DdtPreCreate, DdtShow } from "pages/ddt";
import { Title } from "./components/title";


const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthBindings = {
    login: async ({ credential }: CredentialResponse) => {
      try {
        const profileObj = credential ? parseJwt(credential) : null;
        
        if (profileObj) {
          const response = await fetch("http://localhost:8080/api/v1/users", {
            method: "POST",
            headers: { "Content-Type": 'application/json' },
            body: JSON.stringify({
              name: profileObj.name,
              email: profileObj.email,
              avatar: profileObj.picture,
            })
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const data = await response.json();
          
          if (response.status === 200) {
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...profileObj,
                avatar: profileObj.picture,
                userid: data._id
              })
            );
          }
          localStorage.setItem("token", `${credential}`);
    
          return {
            success: true,
            redirectTo: "/",
          };
        }
    
        return {
          success: false,
        };
      } catch (error) {
        console.error('Login Error:', error);
        throw error; // Rilancia l'errore per gestirlo in Refine
      }
    },
    logout: async () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return {};
        });
      }

      return {
        success: true,
        redirectTo: "/login",
      };
    },
    onError: async (error) => {
      console.error(error);
      return { error };
    },
    check: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return {
          authenticated: true,
        };
      }

      return {
        authenticated: false,
        error: {
          message: "Check failed",
          name: "Token not found",
        },
        logout: true,
        redirectTo: "/login",
      };
    },
    getPermissions: async () => null,
    getIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return JSON.parse(user);
      }

      return null;
    },
  };


  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              dataProvider={dataProvider("http://localhost:8080/api/v1")}
              notificationProvider={notificationProvider}
              routerProvider={routerBindings}
              authProvider={authProvider}
              resources={[
                { 
                  name: "dashboard",
                  options: {label : 'Dashboard'},
                  icon: <GridViewIcon/>,
                  list: "/",
                },
                { 
                  name: "lotti",
                  options: {label : 'Lotti'},
                  icon: <DatasetIcon/>,
                  list: "/lotti",
                  create: "/lotti/create",
                  edit: "/lotti/edit/:id",
                  show: "/lotti/show/:id",
                },
                { 
                  name: "contoterzi",
                  options: {label : 'Conto Terzi'},
                  icon: <VillaOutlined/>,
                  list: "/contoterzi",
                  show: "/contoterzi/:id",
                },
                { 
                  name: "fatture",
                  options: {label : 'Fatture'},
                  icon: <ReceiptIcon/>,
                  list: "/fatture",
                  create: "/fatture/create",
                  edit: "/fatture/edit/:id",
                  show: "/fatture/show/:id",
                },
                { 
                  name: "ddt",
                  options: {label : 'DDT'},
                  icon: <LocalShippingIcon/>,
                  list: "/ddt",
                  create: "/ddt/create/:type",
                  edit: "/ddt/edit/:id",
                  show: "/ddt/show/:id",
                },
                { 
                  name: "pagamenti",
                  options: {label : 'Pagamenti'},
                  icon: <EuroIcon/>,
                  list: "/pagamenti",
                  create: "/pagamenti/create",
                  edit: "/pagamenti/edit/:id",
                  show: "/pagamenti/show/:id",
                  
                },
                { 
                  name: "clienti",
                  options: {label : 'Clienti'},
                  icon: <GroupsIcon/>,
                  list: "/clienti",
                  create: "/clienti/create",
                  show: "/clienti/show/:id",
                  edit: "/clienti/edit/:id",

                },
                {
                  name:"colori",
                  options: {label : "Colori"},
                  icon:<ColorLensIcon/>,
                  list: "/colori",
                  create: "/colori/create"
                },
                {
                  name: "fatture",
                  list: "/fatture",
                  create: "/fatture/create",
                  edit: "/fatture/edit/:id",
                  show: "/fatture/show/:id",
                  meta: {
                    canDelete: true,
                  },
                },
                { 
                  name: "lavorata",
                  options: {label : 'Lavorata'},
                  icon: <EuroIcon/>,
                  list: "/lavorata",
                  create: "/lavorata/create",
                  edit: "/lavorata/edit/:id",
                  show: "/lavorata/show/:id",
                  
                },
              ]}
              options={{
                syncWithLocation: false,
                warnWhenUnsavedChanges: true,
              }}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated fallback={<CatchAllNavigate to="/login" />}>
                      <ThemedLayoutV2 Title={() => <Title collapsed={false}/>} Header={() => <Header isSticky={true} />}>
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="/">
                    <Route index element ={<Dashboard/>}/>
                  </Route>
                  <Route path="/fatture">
                    <Route index element={<FatturaList />} /> 
                    <Route path="create" element={<FatturaCreate />} />
                    <Route path="show/:id" element={<FatturaShow />} />
                    <Route path="edit/:id" element={<FatturaEdit />} />
                    <Route path="addddt/:cliente/:idfattura" element={<AddDdt />} />

                  </Route>
                  <Route path="/pagamenti">
                    <Route index element={<PagamentoList />} />
                    <Route path="createlist" element={<PagamentoListCreate />} />
                    <Route path="create" element={<PagamentoCreate />} />
                    <Route path="show/:id" element={<PagamentoShow/>} />

                  </Route>

                  <Route path="/lotti">
                    <Route index element={<LottiList />} />
                    <Route path="create" element={<LottiCreate />} />
                    <Route path="show/:id" element={<LottiShow />} />
                    <Route path="addFattura/:id" element={<LottoFatturaList />} />
                  </Route>

                  <Route path="/contoterzi">
                    <Route index element={<ContoTerziList />} />
                    <Route path="show/:id" element={<ContoTerziShow />} />
                  </Route>

                  <Route path="/ddt">
                    <Route index element={<DdtList />} />
                    <Route path="precreate/:type" element={<DdtPreCreate/>} />
                    <Route path="create/:type" element={<DdtCreate/>} />
                    <Route path="show/:id" element={<DdtShow />} />
                    

                  </Route>
                  
                  <Route path="/clienti">
                    <Route index element={<ClienteList />} />
                    <Route path="create" element={<ClienteCreate />} />
                    <Route path="show/:id" element={<ClientiShow />} />
                    <Route path="edit/:id" element={<ClienteEdit />} />
                  </Route>

                  <Route path="/lavorata">
                    <Route index element={<ClienteList />} />
                    <Route path="create"  />
                  </Route>

                  <Route path="/colori">
                    <Route index element={<ColoreList />} />
                    <Route path="create" element={<ColoreCreate />} />

                  </Route>
                  
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route
                  element={
                    <Authenticated fallback={<Outlet />}>
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>

              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;