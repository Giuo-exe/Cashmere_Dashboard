import mongoose from "mongoose";
import Lavorata from "../mongodb/models/lavorata.js"
import ContoTerzi from "../mongodb/models/contoterzi.js"

const createLavorata  = async (req,res) => {
    const {lavorataJSON, dataUscita, numeroDDT} = req.params

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Iterate over each item in lavorataJSON
        for (const item of lavorataJSON) {
            // Create a new Lavorata document
            const newLavorata = await Lavorata.create([{
                lavorata: [item],
                datauscita: dataUscita,
                ddtentrata: numeroDDT
            }], { session });

            if(newLavorata){
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
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export {
    createLavorata
}