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

LavorataSchema.statics.calculateTotalKg = async function (startDate, endDate) {
  const pipeline = [
    // Step 1: Unwind the 'lavorata' array
    { $unwind: "$lavorata" },
  
  // Step 2: Optionally filter documents by date range if startDate and endDate are provided
    ...(startDate && endDate ? [{
      $match: {
        "datauscita": { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    }] : []),

    // Step 3: Group documents by the desired timeframe and sum the kg
    {
      $group: {
        _id: {
          year: startDate || endDate ? { $year: "$datauscita" } : null, // Apply year grouping only if a date is provided
          month: startDate || endDate ? { $month: "$datauscita" } : null // Apply month grouping only if a date is provided
        },
        totalKg: { $sum: "$lavorata.kg" }
      }
    },

    // Step 4: Optionally format the output
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        totalKg: 1
      }
    }
  ];

  const result = await this.aggregate(pipeline).exec();
  return result;

}


const lavorataModel = mongoose.model("Lavorata", LavorataSchema);


export default lavorataModel;