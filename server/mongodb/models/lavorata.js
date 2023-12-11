import mongoose from "mongoose";

const LavorataSchema = new mongoose.Schema({
    lavorata: {type: 
        [{
            colore:{type: mongoose.Schema.Types.ObjectId, ref: "Colore"},
            hex: {type: String},
            lotto: {type: mongoose.Schema.Types.ObjectId, ref: "Lotto"},
            contoterzi: {type: mongoose.Schema.Types.ObjectId, ref: "ContoTerzi"},
            kg: {type: Number},
            n: {type: Number},
            checked : {type: Boolean, default: false},
            beneId : {type: String}
        }],
    default: []},
    datauscita: {type: Date, required: true},
    ddtuscita: {type: String, required: true} 
});

LavorataSchema.statics.Giacenza = async function() {
    const pipeline =
    [
      {
        $lookup: {
          from: "colores", // Replace with the actual collection name for 'Colore'
          localField: "lavorata.colore",
          foreignField: "_id",
          as: "colorDetails"
        }
      },
      { $unwind: "$lavorata" },
      {
        $lookup: {
          from: "contoterzis", // Replace with the actual collection name for 'ContoTerzi'
          localField: "lavorata.contoterzi",
          foreignField: "_id",
          as: "lavorata.contoterzi"
        }
      },
      { $unwind: "$colorDetails" },
      { $unwind: { path: "$lavorata.contoterzi", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "ddts", // Replace with the actual collection name for 'Ddt'
          localField: "lavorata.contoterzi.ddt",
          foreignField: "_id",
          as: "lavorata.contoterzi.ddt"
        }
      },
      { $unwind: { path: "$lavorata.contoterzi.ddt", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: "$colorDetails.codice",
          lavorata: {
            $push: {
              hex: "$lavorata.hex",
              lotto: "$lavorata.lotto",
              contoterzi: "$lavorata.contoterzi",
              ddt: "$lavorata.contoterzi.ddt",
              kg: "$lavorata.kg",
              n: "$lavorata.n",
              checked: "$lavorata.checked",
              beneId: "$lavorata.beneId",
              ddtUscita: "$ddtuscita",
              dataUscita: "$datauscita"
            }
          },
          totalKg: { $sum: "$lavorata.kg" },
          codice: { $first: "$colorDetails.codice" },
          colorInfo: { $first: "$colorDetails" }
        }
      },
      {
        $project: {
          _id: 0, // Exclude _id from the result
          codice: 1,
          lavorata: 1,
          totalKg: 1,
          colorInfo: 1
        }
      }
    ]
    ;

    const risultato = await this.aggregate(pipeline).exec();
    
    return risultato;

}

const lavorataModel = mongoose.model("Lavorata", LavorataSchema);


export default lavorataModel