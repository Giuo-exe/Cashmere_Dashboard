import Lotto from "../mongodb/models/lotto.js"
import Colore from "../mongodb/models/colore.js"
import Fattura from "../mongodb/models/fattura.js"

import mongoose from "mongoose";

const getAllLotti = async (req,res) => {
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
        query.name = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Lotto.countDocuments({ query });

        const lotti = await Lotto.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'contoterzi',
                model: 'ContoTerzi', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(lotti);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const AddFattura = async (req, res) => {
    const { fattura, lotto} = req.body;

    // Starting a session for the transaction
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // Check if both Lotto and Fattura exist
        const LottoExist = await Lotto.findOne({ _id: lotto }).session(session);
        const FatturaExist = await Fattura.findOne({ _id: fattura }).session(session);


        if (LottoExist && FatturaExist) {
            // Push the fattura to the Lotto's allFatture array
            LottoExist.allFatture.push(fattura);
            await LottoExist.save({ session });

            // Set the lotto field in the Fattura document
            FatturaExist.lotto = lotto;
            await FatturaExist.save({ session });
            
            // Commit the transaction
            await session.commitTransaction();
            res.status(200).send('Fattura added to Lotto successfully');
        } else {
            // If either does not exist, we should not proceed
            await session.abortTransaction();
            res.status(404).send('Lotto or Fattura not found');
        }
    } catch (error) {
        // If an error occurred, abort the transaction
        await session.abortTransaction();
        console.error('Error adding Fattura to Lotto:', error);
        res.status(500).send('Error adding Fattura to Lotto');
    } finally {
        // End the session
        session.endSession();
    }
};

const getLottoType = async (req, res) => {
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
        query.name = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Lotto.countDocuments({ query });

        // Ottieni l'elenco dei lotti senza popolare 'cashmere.colore' in questo endpoint
        const lotti = await Lotto.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'contoterzi',
                model: 'ContoTerzi', // Assicurati che 'ContoTerzi' corrisponda al tuo modello effettivo
            });


        // Restituisci la risposta al client con i risultati e l'header 'x-total-count'
        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        // Invia i risultati al client come JSON con la proprietà 'hex' aggiunta
        res.status(200).json(lotti);
    } catch (error) {
        // Gestisci gli errori e restituisci una risposta di errore al client
        res.status(500).json({ message: error.message });
    }
};



const getLottoDetail = async (req,res) => {
    const { id } = req.params;
    const LottoExist = await Lotto.findOne({ _id : id })
        .populate({
            path: 'contoterzi',
            model: 'ContoTerzi', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
        })
        .populate({
            path: 'allFatture',
            model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            populate: [
                { 
                    path: 'cliente',
                    model: 'Cliente'
                },
                {
                    path: 'allDdt',
                    model: 'Ddt'
                },
                {
                    path: 'allPagamenti',
                    model: 'Pagamento'
                }
            ],
        })

    if(LottoExist) { 
        res.status(200).json(LottoExist)
    } else {
        res.status(404).json({ message : "Lotto non trovato" })
    }
}


const createLotto = async (req,res) => {
    try{
        const {name,ft,data,cashmere,fornitore,balle} = req.body;


        const LottoExist = await Lotto.findOne({ name: name });

        if(LottoExist) return res.status(200).json(LottoExist);

        const newLotto = await Lotto.create({
            name,
            ft,
            data,
            cashmere,
            fornitore,
            balle
        });


        res.status(200).json( newLotto );

    }catch(error){
        res.status(500).json( {message : error.message} );
    }
}

const getTotals = async (req,res) => {
    try{
        const result = await Lotto.getTotals()
        // Send the HTTP response with the result
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

const deleteLotto = async (req,res) => {
    const { id } = req.params;

    try {
        // Trova il documento prima
        const doc = await Lotto.findOne({ _id: id });
        console.log("cliente")

        if (!doc) {
            throw new Error("Cliente not found");
        }

        // Usa deleteOne sull'istanza del documento
        await doc.deleteOne();

        res.status(200).json({ message: "Lotto deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const updateLotto = async (req,res) => {}

const lottoContoterzi = async (req,res) => {
    try {
        const { id } = req.params;
        const { valore, data } = req.body
 
        const lotto = await Lotto.findOne({ id });

        if(!lotto) {
            return;
        }

        const newContoterzi = {
            quantity: valore,
            dataentrata: data
        }

        lotto.contoterzi.push(newContoterzi)

        lotto.quantity -= valore;

    // Salva le modifiche
    await lotto.save();

        res.status(200).json({ message: "Trasferimento al contoterzi effettuato" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const LottoDifferencesContoterzi = async (req, res) => {
    try{
        
        const result = await Lotto.getStats()
        
        // Send the HTTP response with the result
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}

const LottoSingleDifferencesContoterzi = async (req, res) => {
    const {id} = req.params

    try{
        const result = await Lotto.getStats(id)
        
        // Send the HTTP response with the result
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({ message: error.message })
    }
}
const contoterziLotto = async (req,res) => {}

export {
    getTotals,
    getAllLotti,
    getLottoDetail,
    deleteLotto,
    updateLotto,
    createLotto,
    lottoContoterzi,
    LottoDifferencesContoterzi,
    getLottoType,
    LottoSingleDifferencesContoterzi,
    AddFattura,
}