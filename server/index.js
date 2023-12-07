import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'

import connectDB from './mongodb/connect.js';
import clienteRouter from "./routes/cliente.routes.js";
import fatturaRouter from "./routes/fattura.routes.js";
import userRouter from "./routes/user.routes.js";
import ddtRouter from "./routes/ddt.routes.js";
import pagamentoRouter from "./routes/pagamento.routes.js"
import lottoRouter from "./routes/lotto.routes.js"
import coloreRouter from "./routes/colore.routes.js"
import contoterziRouter from "./routes/contoterzi.routes.js"
import lavorataRouter from "./routes/lavorata.routes.js"

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb"}));

app.get("/", (req,res) => {
    res.send({ message: "Hello World!" });
})

app.use("/api/v1/clienti", clienteRouter);
app.use("/api/v1/fatture", fatturaRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/ddt", ddtRouter);
app.use("/api/v1/pagamenti", pagamentoRouter);
app.use("/api/v1/lotti", lottoRouter);
app.use("/api/v1/colori", coloreRouter)
app.use("/api/v1/contoterzi", contoterziRouter)
app.use("/api/v1/lavorata", lavorataRouter)







const startServer = async () => {
    try{
        connectDB(process.env.MONGODB_URL);

        app.listen(8080, () => console.log("Server started on port http://localhost:8080"));
    }catch(error) {
        console.log(error);
    }
}

startServer();