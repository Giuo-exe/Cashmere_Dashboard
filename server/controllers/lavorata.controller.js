import mongoose from "mongoose";
import Lavorata from "../mongodb/models/lavorata.js"
import ContoTerzi from "../mongodb/models/contoterzi.js"

const createLavorata  = async (req,res) => {
    const {lavorata , dataUscita, ddtuscita} = req.body 

    let lavorataJSON;
    try {
        // Parse the lavorataJSON string into an array
        lavorataJSON = JSON.parse(lavorata);
        if (!Array.isArray(lavorataJSON)) {
            return res.status(400).send({ error: "Invalid lavorataJSON format" });
        }
    } catch (error) {
        return res.status(400).send({ error: "Invalid JSON format in lavorataJSON" });
    }

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
                ddtentrata: ddtuscita
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


export {
    createLavorata
}