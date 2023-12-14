import mongoose from "mongoose";
import Lavorata from "../mongodb/models/lavorata.js"
import ContoTerzi from "../mongodb/models/contoterzi.js"

const createLavorata = async (req, res) => {
    const { lavorata, dataUscita, ddtUscita } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Create a single Lavorata document with the entire lavorata array
        const newLavorata = await Lavorata.create([{
            lavorata: lavorata,
            datauscita: dataUscita,
            ddtuscita: ddtUscita
        }], { session });

        if (newLavorata) {
            // Iterate over each item in lavorata
            for (const item of lavorata) {
                console.log(item);
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
                model: "ContoTerzi",
                populate: {
                    path: "ddt",
                    model: "Ddt",
                }
            });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(lavorata);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

const getGiacenza = async (req,res) => {

  try{

    const result = await Lavorata.Giacenza()
    // Send the HTTP response with the result
    res.status(200).json(result);

  } catch (err) {
    // Handle errors and send an error response
    res.status(500).json({ error: "Error retrieving Giacenza" });
  }
}

const getLavorataGiacenza = async (req,res) => {
    const {
        _end = 10,
        _order = 'asc',
        _start = 0,
        _sort = '',
        datauscita = "",
        name_like
    } = req.query;

    console.log(_end, _sort)

    if (datauscita !== "") {
        query.datauscita = datauscita;
    }

    if (name_like) {
        query.name = { $regex: name_like, $options: "i" };
    }


    // Ensure values are numbers and not NaN
    if (isNaN(_start)) _start = 0;
    if (isNaN(_end)) _end = 10;

    // Calculate the limit
    const limit = _end - _start;
    try {
        const giacenza = await Lavorata.Giacenza();

        console.log(giacenza)
        res.status(200).json(giacenza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export {
    createLavorata,
    getAllLavorata,
    getGiacenza,
    getLavorataGiacenza
}