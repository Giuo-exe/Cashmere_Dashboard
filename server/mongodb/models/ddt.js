import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 }
});

const CounterModel = mongoose.model('Counter', CounterSchema);

const DdtSchema = new mongoose.Schema({
    causale: {type: String},
    id: {type: Number},
    data: {type: Date, required: true},
    destinatario: {type: mongoose.Schema.Types.ObjectId, ref: "Cliente"}, //cliente
    destinazione: {type: String, required: true}, //luogo
    beni: [{
        colore:{type: mongoose.Schema.Types.ObjectId, ref: "Colore"},
        lotto: {type: mongoose.Schema.Types.ObjectId, ref: "Lotto"},
        kg: {type: Number},
        n: {type: Number}
    }],
    tara : {type: Number},
    contoterzi : {type: mongoose.Schema.Types.ObjectId, ref: "ContoTerzi"},
    fattura : {type: mongoose.Schema.Types.ObjectId, ref: "Fattura"}
    });

    DdtSchema.pre('save', async function(next) {
        if (this.isNew) {
            const counter = await CounterModel.findByIdAndUpdate(
                { _id: 'ddtId' }, 
                { $inc: { seq: 1 } }, 
                { new: true, upsert: true }
            );
            this.id = counter.seq;
        }
        next();
    });
    
    DdtSchema.pre('deleteOne', { document: true}, async function(next) {
        console.log("Pre-deleteOne middleware su Ddt");
    
        const contoterziId = this.contoterzi;
        console.log(contoterziId)
        if (contoterziId) {
            const ContoTerziModel = this.model('ContoTerzi');
            
            // Recupera l'istanza del documento ContoTerzi e chiama deleteOne su di essa
            const contoterziDoc = await ContoTerziModel.findOne({ _id : contoterziId});

            console.log(contoterziDoc)
            if (contoterziDoc) {
                await contoterziDoc.deleteOne(); // Questo attiverà i middleware su ContoTerzi
            }
        }
    
        next();
    });

    DdtSchema.statics.calculateTotalKgVendita = async function (startDate, endDate) {
        const pipeline = [
          // Step 1: Optionally filter documents by date range and causale if startDate and endDate are provided
          {
            $match: {
              ...(startDate && endDate ? { data: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {}),
              causale: 'vendita'
            }
          },
          // Step 2: Unwind the 'beni' array to process each item
          { $unwind: "$beni" },
          
          // Step 3: Group documents and sum the kg
          {
            $group: {
              _id: {
                year: { $year: "$datauscita" },
                month: { $month: "$datauscita" }
              },
              totalKg: { $sum: "$beni.kg" }
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

      DdtSchema.statics.VenditaEColori = async function (startDate, endDate) {
        const pipeline = [
          // Step 1: Filter by date and causale
          {
            $match: {
              ...(startDate && endDate ? { data: { $gte: new Date(startDate), $lte: new Date(endDate) } } : {}),
              causale: 'vendita'
            }
          },
          // Step 2: Unwind the 'beni' array
          { $unwind: "$beni" },
          
          // Step 3: Lookup to enrich 'beni' with color details
          {
            $lookup: {
              from: "colores",       // The collection to join
              localField: "beni.colore",  // Field from the input documents
              foreignField: "_id", // Field from the documents of the "from" collection
              as: "beni.colorDetails"    // Output array field added to 'beni'
            }
          },
    
          // Step 4: Unwind the result from the lookup to normalize
          {
            $unwind: "$beni.colorDetails"
          },
          
          // Step 5: Group by DDT ID and summarize colors with enriched details
          {
            $group: {
              _id: "$_id",
              ddtRoot: { $first: "$$ROOT" }, // Keep the entire DDT document
              colors: {
                $push: { 
                  color: "$beni.colorDetails", // Includes detailed information
                  kg: "$beni.kg"
                }
              }
            }
          },
          
          // Step 4: Regroup to separate the color summarization
          {
            $group: {
              _id: null,
              ddts: { $push: "$ddtRoot" },
              colorsSummary: { $push: "$colors" }
            }
          },
          
          // Step 5: Reduce the colors to a single list
          {
            $project: {
              ddts: 1,
              colors: {
                $reduce: {
                  input: "$colorsSummary",
                  initialValue: [],
                  in: { $concatArrays: ["$$value", "$$this"] }
                }
              }
            }
          },
          
          // Step 6: Unwind the colors for summarization
          {
            $unwind: "$colors"
          },
          
          // Step 7: Group colors to summarize the total kilograms per color
          {
            $group: {
              _id: "$colors.color",
              ddts: { $first: "$ddts" }, // Preserve the ddts array
              totalKg: { $sum: "$colors.kg" }
            }
          },
          
          // Step 8: Group everything back together
          {
            $group: {
              _id: null,
              ddts: { $first: "$ddts" },
              colors: {
                $push: {
                  color: "$_id",
                  totalKg: "$totalKg"
                }
              }
            }
          }
        ]
      
        const result = await this.aggregate(pipeline).exec();
        return result;
    };
    

const ddtModel = mongoose.model("Ddt", DdtSchema);

export default ddtModel