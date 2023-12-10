import mongoose from "mongoose";
import Lavorata from "../mongodb/models/lavorata.js"
import ContoTerzi from "../mongodb/models/contoterzi.js"

const createLavorata  = async (req,res) => {
    const {lavorata , dataUscita, ddtUscita} = req.body 

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Iterate over each item in lavorataJSON
        for (const item of lavorata) {
            // Create a new Lavorata document
            console.log(item)
            const newLavorata = await Lavorata.create([{
                lavorata: [item],
                datauscita: dataUscita,
                ddtuscita: ddtUscita
            }], { session });

            if (newLavorata) {
                if (Array.isArray(item.contoterzi)) {
                    for (const contoterziId of item.contoterzi) {
                        await ContoTerzi.findByIdAndUpdate(
                            contoterziId,
                            { $addToSet: { lavorata: newLavorata[0]._id } },
                            { session }
                        );
                    }
                } else {
                    await ContoTerzi.findByIdAndUpdate(
                        item.contoterzi,
                        { $addToSet: { lavorata: newLavorata[0]._id } },
                        { session }
                    );
                }
            }
        }

        await session.commitTransaction();
        res.status(200).send({ message: "Lavorata created successfully" });
    } catch (error) {
        await session.abortTransaction();
        res.status(500).send({ error: "Transaction failed", details: error.message });
    } finally {
        session.endSession();
    }
};

const getAllLavorata = async (req,res) =>{
    const {
        _end,
        _order,
        _start,
        _sort,
        datauscita = "",
    } = req.query;

    const query = {};
    
    if (datauscita !== "") {
        query.datauscita = datauscita;
    }

    try {
        const count = await Lavorata.countDocuments({ query });
        const lavorata = await Lavorata.find(query)
            .limit()
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'lavorata.lotto',
                model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
                })
            .populate({
                path: "lavorata.colore",
                model: "Colore"
            })
            .populate({
                path: "lavorata.contoterzi",
                model: "ContoTerzi"
            });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(lavorata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}


export {
    createLavorata,
    getAllLavorata
}