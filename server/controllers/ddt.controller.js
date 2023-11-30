import Ddt from "../mongodb/models/ddt.js";
import ContoTerzi from "../mongodb/models/contoterzi.js";
import Lotto from "../mongodb/models/lotto.js"
import mongoose from "mongoose";
import Cliente from "../mongodb/models/cliente.js";


const createDdt = async (req,res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { beni, causale, data, id, destinatario, destinazione, tara } = req.body;
 
        const DdtExist = await Ddt.findOne({ id });

        if (DdtExist) {
        // Se il Ddt esiste, restituiscilo come risposta
        return res.status(500).json(DdtExist);
        } 

        

        const newDdt = await Ddt.create(
        [{
            beni,
            causale,
            data,
            id,
            destinatario,
            destinazione,
            tara,
        }],
        { session }
        );

        const cliente = await Cliente.findOne({ _id: destinatario });

        if (cliente) {
            // Supponendo che il cliente abbia un campo "ddts" che è un array di IDs:
            cliente.allDdt.push(newDdt[0]._id);

            // Salva il documento del cliente aggiornato
            await cliente.save({ session }); // Aggiungi la sessione qui
        }

        // Se il type è "contoterzi", crea anche un documento "ContoTerzi" con gli stessi beni
        if (causale === "contoterzi") {
            const newContoTerzi = await ContoTerzi.create(
                [
                {
                    beni,
                    dataentrata: data,
                    // Aggiungi altri campi specifici del "ContoTerzi" se necessario
                },
                ],
                { session }
            );

            newContoTerzi[0].ddt = newDdt[0]._id;
            
            // Salva il documento "ContoTerzi" con il riferimento aggiunto
            await newContoTerzi[0].save();

            for (const bene of beni) {
                // Trova il lotto corrispondente utilizzando il campo "lotto" del bene
                const lotto = await Lotto.findOne({ _id: bene.lotto });
            
                if (lotto) {
                  // Aggiungi l'ID di "newContoTerzi" al campo "contoterzi" del lotto
                    const newContoTerziId = newContoTerzi[0]._id;

                    // Controlla se l'ID di newContoTerzi è già presente nell'array contoterzi del lotto
                    if (!lotto.contoterzi.includes(newContoTerziId)) {
                        // Aggiungi l'ID di newContoTerzi al campo contoterzi del lotto se non presente
                        lotto.contoterzi.push(newContoTerziId);

                        // Salva il lotto aggiornato
                        await lotto.save();
                    }
                }
              }
            newDdt[0].contoterzi = newContoTerzi[0]._id;
            await newDdt[0].save();
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json(newDdt);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        res.status(500).json({ message: error.message });
    }
};

const getAllddt = async (req,res) => {
    try {
        const ddt = await Ddt.find({})
        .populate({
            path: 'destinatario',
            model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
          })
        .populate({
            path: 'fattura',
            model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
        })

        res.status(200).json(ddt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllDdteSelected = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        data = "",
        name_like = "",
    } = req.query;

    const query = {};
    
    if (data !== "") {
        query.data = data;
    }

    if (name_like) {
        query.id = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Ddt.countDocuments({ query });

        const ddt = await Ddt.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'destinatario',
                model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              })
            .populate({
            path: 'fattura',
            model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            })

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(ddt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVenditaddt = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        data = "",
    } = req.query;

    const query = {};
    
    if (data !== "") {
        query.dataentrata = data;
    }
    query.causale = "vendita";

    query.fattura = { $eq: null };


    try {
        const count = await Ddt.countDocuments({ query });

        const ddt = await Ddt.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'destinatario',
                model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              })
            .populate({
                path: 'beni.lotto',
                model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            })
            .populate({
                path: 'beni.colore',
                model: 'Colore', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(ddt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getDdtDetail = async (req,res) => {
    const { id } = req.params;
    const ddtExist = await Ddt.findOne({ _id : id })
    .populate({
        path: 'destinatario',
        model: 'Cliente', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
        path: 'beni.lotto',
        model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
        path: 'beni.colore',
        model: 'Colore', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    });


    if(ddtExist) { 
        res.status(200).json(ddtExist)
    } else {
        res.status(404).json({ message : "Ddt non trovato" })
    }
};


const updateDdt = async (req,res) => {}; 


    
const deleteDdt = async (req, res) => {
    const { id } = req.params;

    try {
        // Trova il documento prima
        const doc = await Ddt.findOne({ _id: id });

        if (!doc) {
            throw new Error("DDT not found");
        }

        // Usa deleteOne sull'istanza del documento
        await doc.deleteOne();

        res.status(200).json({ message: "DDT deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export {
    getAllddt,
    getDdtDetail,
    updateDdt,
    deleteDdt,
    createDdt,
    getVenditaddt, 
    getAllDdteSelected
}


