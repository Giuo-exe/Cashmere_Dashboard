import Fattura from "../mongodb/models/fattura.js";
import Cliente from "../mongodb/models/cliente.js";
import Pagamento from "../mongodb/models/pagamento.js"
import Ddt from "../mongodb/models/ddt.js"
import mongoose from "mongoose";


const getAllFattureSelected = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        data = "",
        name_like = "",
    } = req.query;

    const query = {
        pagato: { $ne: true }  // Aggiungi questa linea per escludere documenti dove pagato è true
    };
    
    if (data !== "") {
        query.data = data;
    }

    if (name_like) {
        query.id = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Fattura.countDocuments({ query });

        const fatture = await Fattura.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'allPagamenti',
                model: 'Pagamento', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              })
            .populate({
                path: "cliente",
                model: "Cliente"
            });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(fatture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFatture = async (req,res) => {
    try {
        const fatture = await Fattura.find({})
        .populate({
            path: 'allPagamenti',
            model: 'Pagamento', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
          })
        .populate({
            path: "cliente",
            model: "Cliente"
        });
        
        res.status(200).json(fatture);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getFattureDetail = async (req,res) => {
    const { id } = req.params;
    const FatturaExist = await Fattura.findOne({ _id : id })
    .populate({
        path: 'allPagamenti',
        model: 'Pagamento', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
      })
    .populate({
        path: 'cliente',
        model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
        path: 'allDdt',
        model: 'Ddt', // Assuming 'Ddt' is your model name
        populate: [
            {
                path: 'beni.colore',
                model: 'Colore' // Assuming 'Colore' is your model name
            },
            {
                path: 'beni.lotto',
                model: 'Lotto' // Assuming 'Lotto' is your model name
            }
        ]
    });

    if(FatturaExist) { 
        res.status(200).json(FatturaExist)
    } else {
        res.status(404).json({ message : "Fattura non trovata" })
    }
};
const createFattura = async (req, res) => {
    let session;
    try {
        const { id, data, scadenza, cliente, note, totale, allDdt, idKg } = req.body;

        session = await mongoose.startSession();
        session.startTransaction();

        const ClienteTrovato = await Cliente.findOne({ name: cliente }).session(session);
        if (!ClienteTrovato) throw new Error("Cliente non trovato");

        const newFatturaArray = await Fattura.create([{
            allDdt,
            id,
            data,
            scadenza,
            cliente: ClienteTrovato._id,
            note,
            idKg,
            totale
        }], { session });

        const newFattura = newFatturaArray[0]; // Access the first element of the array

        if (!newFattura) throw new Error("Errore nella creazione della fattura");

        ClienteTrovato.allFatture.push(newFattura._id);
        await ClienteTrovato.save({ session });

        // Aggiornare i DDT
        for (const ddtId of allDdt) {
            const ddtToUpdate = await Ddt.findOne({ _id: ddtId }).session(session);
            if (!ddtToUpdate) {
                throw new Error("DDT non trovato");
            }
            ddtToUpdate.fattura = newFattura._id;

            console.log(newFattura._id)

            await ddtToUpdate.save({ session });
        }

        await session.commitTransaction();
        res.status(200).json({ message: "Fattura creata con successo", fatturaId: newFattura._id });
    } catch (error) {
        await session.abortTransaction();
        console.error('Errore nella creazione della fattura:', error);
        res.status(500).json({ message: error.message }); 
    } finally {
        session.endSession();
    }
};

const addDdt = async (req, res) => {
    const { id, ddt } = req.body;
    console.log(id, ddt)

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Check if both Lotto and Fattura exist
        const FatturaExist = await Fattura.findOne({ _id: id }).session(session);
        const DdtExist = await Ddt.findOne({ _id: ddt }).session(session);


        if (DdtExist && FatturaExist) {
            // Push the fattura to the Lotto's allFatture array
            DdtExist.fattura = id 
            await DdtExist.save({ session });

            // Set the lotto field in the Fattura document
            FatturaExist.allDdt.push(ddt);
            await FatturaExist.save({ session });
            
            // Commit the transaction
            await session.commitTransaction();
            res.status(200).send('Ddt aggiunto con successo ');
        } else {
            // If either does not exist, we should not proceed
            await session.abortTransaction();
            res.status(404).send('DDT or Fattura not found');
        }
    } catch (error) {
        // If an error occurred, abort the transaction
        await session.abortTransaction();
        console.error('Error adding Fattura to DDT:', error);
        res.status(500).send('Error adding Fattura to DDT');
    } finally {
        // End the session
        session.endSession();
    }
};

const deleteFattura = async (req,res) => {
    const { id } = req.params;

    try {
        // Trova il documento prima
        const doc = await Fattura.findOne({ _id: id });
        console.log("cliente")

        if (!doc) {
            throw new Error("Cliente not found");
        }

        // Usa deleteOne sull'istanza del documento
        await doc.deleteOne();

        res.status(200).json({ message: "Fattura deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


const updateFattura = async (req,res) => {
    try {
        const { id } = req.params;
        const { numero, data, scadenza, note, totale, pagato, cliente } =
            req.body;

        const ClienteTrovato = await Cliente.findOne({ name: cliente })

        if(!ClienteTrovato){
            return res.status(500).json({ message: "Cliente non trovato" })
        }

        await Fattura.findByIdAndUpdate(
            { _id: id },
            {
                numero, 
                data, 
                scadenza, 
                note, 
                totale, 
                cliente: ClienteTrovato._id
            },
        );

        res.status(200).json({ message: "Fattura updated successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePagato = async (req, res) => {
    try {
        const { id } = req.params;
        const { pagato } = req.body; // Prende solo il campo 'pagato' dalla richiesta

        // Trova e aggiorna il campo 'pagato' della fattura specificata
        await Fattura.findByIdAndUpdate(
            { _id: id },
            { pagato },
        );

        res.status(200).json({ message: "Stato pagamento fattura aggiornato con successo" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const ShowDeadlineFattura = async (req,res) => {
    try{
        const today = new Date();

        Fattura.find({
          pagato: false
        })
        .sort({ scadenza: 1 })
        .limit(5)
        .populate({
            path: 'cliente',
            model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
          })
        .populate({
        path: 'allPagamenti',
        model: 'Pagamento', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
        })
        .exec() // Non passare una callback qui
        .then((result) => {
            console.log(result)
            res.status(200).json(result)
        })
    }catch (error) {
        
        res.status(500).json({ message: error.message });

    }
}
    


export{
    ShowDeadlineFattura,
    getAllFatture,
    getFattureDetail,
    createFattura,
    deleteFattura,
    updateFattura,
    addDdt, 
    updatePagato,
    getAllFattureSelected
}