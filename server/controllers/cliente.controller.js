import Cliente from "../mongodb/models/cliente.js";
import Fattura from "../mongodb/models/fattura.js"
import Pagamento from "../mongodb/models/pagamento.js"

const getAllClienti = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        name_like = "",
        nameOrder = ""
    } = req.query;

    const query = {};

    if (nameOrder) {
        query.name = nameOrder
    }

    if (name_like) {
        query.name = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Cliente.countDocuments({ query });

        const cliente = await Cliente.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'allFatture',
                model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getClientiDetail = async (req,res) => {
    const { id } = req.params;
    console.log(id)
    const ClienteExist = await Cliente.findById(id)
    .populate({
        path: 'allFatture',
        model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
      })

    if(ClienteExist) { 
        res.status(200).json(ClienteExist)
    } else {
        res.status(404).json({ message : "Cliente non trovato" })
    }
};

const getClienteInfoByName = async (req,res) => {
    const { name } = req.params;
    console.log(name)
    const ClienteExist = await Cliente.findOne({ name: name });

    if(ClienteExist) { 
        res.status(200).json(ClienteExist)
    } else {
        res.status(404).json({ message : "Cliente non trovato" })
    }
};

const createCliente = async (req,res) => {
    try{
        const {name, email, telefono ,indirizzo, cap, piva, rea, cf, contoterzi, allFatture} = req.body;

        const clienteExist = await Cliente.findOne({ name });

        if(clienteExist) return res.status(200).json(clienteExist);

        const newCliente = await Cliente.create({
            name,
            email,
            indirizzo,
            telefono,
            cap,
            cf,
            rea,
            piva,
            contoterzi,
            allFatture
        });

        res.status(200).json( newCliente);

    }catch(error){
        res.status(500).json( {message : error.message} );
    }
};

const deleteCliente = async (req,res) => {
    const { id } = req.params;

    try {
        // Trova il documento prima
        const doc = await Cliente.findOne({ _id: id });

        if (!doc) {
            throw new Error("Cliente not found");
        }

        // Usa deleteOne sull'istanza del documento
        await doc.deleteOne();

        res.status(200).json({ message: "Cliente deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const updateCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, telefono, indirizzo, piva, rea, cap, cf } =
            req.body;

        // Aggiorna il cliente con i nuovi valori
        await Cliente.findByIdAndUpdate(
            { _id: id },
            {
                name, 
                email, 
                telefono, 
                indirizzo, 
                piva, 
                rea, 
                cap, 
                cf
            },
        );

        res.status(200).json({ message: "Cliente aggiornato" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getClienteByType = async (req,res) => {
    try {
        const { type } = req.params;
    
        if (!type) {
          res.status(400).json({ message: "Il parametro 'type' è obbligatorio" });
          return;
        }

        let result;

        if (type === "contoterzi") {
        result = await Cliente.find({ contoterzi: true }).exec();
        } else if (type === "vendita") {
        result = await Cliente.find({ contoterzi: false }).exec();
        } else {
        throw new Error("Tipo non valido");
        }

        res.status(200).json( result );
    } catch (error) {
    res.status(500).json({ message: error.message }); 
  }
}

const getAllClienteInfo = async (req, res) => {

    const {id} = req.params
  
    try{
  
      const result = await Cliente.getInfo(id)
   
      console.log(result)
      // Send the HTTP response with the result
      res.status(200).json(result);
  
    } catch (err) {
      console.error(err);
      // Handle errors and send an error response
      res.status(500).json({ error: err});
    }
  };


export{
    getAllClienti,
    getClientiDetail,
    createCliente,
    deleteCliente,
    updateCliente,
    getClienteInfoByName,
    getClienteByType,
    getAllClienteInfo,
}