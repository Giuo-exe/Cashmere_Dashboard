import Pagamento from "../mongodb/models/pagamento.js"
import Fattura from "../mongodb/models/fattura.js"
import mongoose from "mongoose"

const getAllPagamenti = async (req,res) => {
    try {
        console.log("ci sono arrivato")
        const pagamento = await Pagamento.find({})
        .populate({
            path: 'fattura',
            model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            populate: {
                path: 'cliente',
                model: 'Cliente' // Assicurati che 'Cliente' corrisponda al nome effettivo del tuo modello Mongoose per i clienti
            }
        })

        res.status(200).json(pagamento);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getPagamentoDetail = async (req,res) => {
    const { id } = req.params;
    const PagamentoExist = await Pagamento.findOne({ _id : id })
    .populate({
        path: 'fattura',
        model: 'Fattura', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
        populate: {
            path: 'cliente',
            model: 'Cliente' // Assicurati che 'Cliente' corrisponda al nome effettivo del tuo modello Mongoose per i clienti
        }
    })

    if(PagamentoExist) { 
        res.status(200).json(PagamentoExist)
    } else {
        res.status(404).json({ message : "Pagamento non trovato" })
    }
}

const createPagamento = async (req,res) => {
    try {
        const {
            data,
            id,
            ammount,
            note,
            kg,
            fattura
        } = req.body;


        console.log(fattura)

        

        const session = await mongoose.startSession();
        session.startTransaction();

        const fatturaTrovata = await Fattura.findById(fattura).session(session);

        if (!fatturaTrovata) throw new Error("Fattura non trovata");

        const PagamentoTrovato = await Pagamento.findOne({ id }).session(session);

        if(!PagamentoTrovato) {
            const newPagamento = await Pagamento.create({
                data,
                id,
                ammount,
                note,
                kg,
                fattura: fatturaTrovata._id
            });
    
            fatturaTrovata.allPagamenti.push(newPagamento._id);
            await fatturaTrovata.save({ session });
    
            await session.commitTransaction();
    
            res.status(200).json({ message: "Pagamento creato con successo" });
        } else {
            res.status(500).json({massage: "Id già in uso"})
        }

        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deletePagamento = async (req,res) => {
    const { id } = req.params;

    try {
        // Trova il documento prima
        const doc = await Pagamento.findOne({ _id: id });

        if (!doc) {
            throw new Error("DDT not found");
        }

        // Usa deleteOne sull'istanza del documento
        await doc.deleteOne();

        res.status(200).json({ message: "Pagamento deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updatePagamento = async (req,res) => {
    try {
        const { id } = req.params;
        const { ammount, data, kg, note } =
            req.body;

        console.log()

        await Fattura.findByIdAndUpdate(
            { _id: id },
            {
                ammount,
                data, 
                kg, 
                note
            },
        );

        res.status(200).json({ message: "Pagamento aggiornato" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getYearPagamenti = async (req,res) => {
    try{
        // Ottieni l'anno corrente
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        // Calcola le date per 12 mesi precedenti
        const startDate = new Date(currentYear - 1, currentMonth + 1, 1); // 1° del mese successivo al mese corrente, anno precedente
        const endDate = new Date(currentYear, currentMonth + 1, 1); // 1° del mese successivo al mese corrente, anno corrente

        console.log("Periodo di ricerca:", startDate, "fino a", endDate);

        Pagamento.aggregate([
            {
                $match: {
                    data: {
                        $gte: startDate, // Data di inizio
                        $lt: endDate, // Data di fine
                    },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$data" },
                        month: { $month: "$data" },
                    },
                    totalPayments: { $sum: "$ammount" }, // Calcola il totale dei pagamenti per ciascun giorno
                },
            },
            {
                $project: {
                    _id: 0, // Nascondi il campo "_id"
                    date: { // Crea un oggetto "date" con anno, mese e giorno
                        year: "$_id.year",
                        month: "$_id.month",
                    },
                    totalPayments: 1, // Mantieni il campo "totalPayments"
                },
            },
            { 
                $sort: {
                    "date.year": 1, // Ordina per anno in ordine crescente
                    "date.month": 1, // Poi per mese in ordine crescente
                }
            }
        ])
        .exec() // Non passare una callback qui
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((error) => {
            console.error(error);
        });
    }catch (error) {
        res.status(500).json({ message: error.message });

    }
    

}

export {
    getAllPagamenti,
    getPagamentoDetail,
    createPagamento,
    deletePagamento,
    updatePagamento,
    getYearPagamenti
}
