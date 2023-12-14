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
      { $unwind: "$lavorata" },
      {
        $lookup: {
          from: "colores",
          localField: "lavorata.colore",
          foreignField: "_id",
          as: "colorDetails"
        }
      },
      { $unwind: { path: "$colorDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "contoterzis",
          localField: "lavorata.contoterzi",
          foreignField: "_id",
          as: "contoterziDetails"
        }
      },
      { $unwind: { path: "$contoterziDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "ddts",
          localField: "contoterziDetails.ddt",
          foreignField: "_id",
          as: "ddtDetails"
        }
      },
      { $unwind: { path: "$ddtDetails", preserveNullAndEmptyArrays: true } },
      {
        $set: {
          "lavorata.colorDetails": "$colorDetails",
          "lavorata.contoterzi": {
            $mergeObjects: [
              "$contoterziDetails",
              { ddt: "$ddtDetails" }
            ]
          },
          "lavorata.ddtuscita": "$ddtuscita",
          "lavorata.datauscita": "$datauscita"
        }
      },
      {
        $group: {
          _id: "$lavorata.colorDetails.codice",
          lavorata: { $push: "$lavorata" },
          totalKg: { $sum: "$lavorata.kg" },
          codice: { $first: "$lavorata.colorDetails.codice" },
          colorInfo: { $first: "$lavorata.colorDetails" }
        }
      },
      {
        $project: {
          _id: 0,
          codice: 1,
          lavorata: {
            $map: {
              input: "$lavorata",
              as: "l",
              in: {
                colore: "$$l.colore",
                hex: "$$l.hex",
                lotto: "$$l.lotto",
                contoterzi: "$$l.contoterzi",
                kg: "$$l.kg",
                n: "$$l.n",
                checked: "$$l.checked",
                beneId: "$$l.beneId",
                ddtuscita: "$$l.ddtuscita",
                datauscita: "$$l.datauscita"
              }
            }
          },
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