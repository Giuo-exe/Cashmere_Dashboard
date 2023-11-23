// Nel tuo file clienteModel.js

import mongoose from "mongoose";

const ClienteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  telefono: { type: Number },
  indirizzo: { type: String },
  piva: { type: String , required: false},
  rea: { type: String },
  cap: { type: Number },
  cf: { type: String },
  contoterzi: { type: Boolean, default: false },
  dataoffset: {type: Number, default: 30},
  allFatture: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fattura" }],
  allDdt: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ddt" }],

});

ClienteSchema.pre('deleteOne', { document : true }, async function(next) {
  // `this` is the document Cliente that is being removed.
  console.log("Middleware attivato per Cliente");

  try {
      // Rimuovere tutti i documenti Fattura associati.
      for (const fatturaId of this.allFatture) {
          await this.model('Fattura').deleteOne({ _id: fatturaId });
      }

      // Rimuovere tutti i documenti Ddt associati.
      for (const ddtId of this.allDdt) {
          await this.model('Ddt').deleteOne({ _id: ddtId });
      }
  } catch (error) {
      // Gestire eventuali errori che si verificano durante la rimozione.
      console.error("Errore durante l'esecuzione del middleware pre-delete in Cliente:", error);
      // Propagare l'errore al prossimo middleware o gestore di errori.
      return next(error);
  }

  // Continuare con il processo di cancellazione dopo aver completato le operazioni.
  next();

  next();
});


ClienteSchema.statics.getInfo = async function (id){
  const pipeline = [
    {
      $lookup: {
        from: "fatturas",
        localField: "_id",
        foreignField: "cliente",
        as: "fattureAssociate",
      },
    },
    {
      $lookup: {
        from: "pagamentos",
        let: {
          fattureId: "$fattureAssociate._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$fattura", "$$fattureId"],
              },
            },
          },
          {
            $project: {
              id: "$_id",
              data: "$data",
              ammount: "$ammount",
              tipo: "Pagamento",
              descrizione: "Pagamento effettuato",
            },
          },
        ],
        as: "pagamentiAssociati",
      },
    },
    {
      $lookup: {
        from: "ddts",
        localField: "_id",
        foreignField: "destinatario",
        as: "DdtAssociati",
      },
    },
    {
      $project: {
        nome: 1,
        azioni: {
          $concatArrays: [
            {
              $map: {
                input: "$fattureAssociate",
                as: "fattura",
                in: {
                  id: "$$fattura._id",
                  data: "$$fattura.data",
                  ammount: "$$fattura.totale",
                  tipo: "Fattura",
                  descrizione: "Fattura creata",
                },
              },
            },
            "$pagamentiAssociati",
            {
              $map: {
                  input: "$DdtAssociati",
                  as: "ddt",
                  in: {
                      id: "$$ddt._id",
                      data: "$$ddt.data",
                      tipo: "Ddt",
                      descrizione: "Ddt emesso",
                      kg: {
                          $sum: "$$ddt.beni.kg"
                      }
                  }
              }
          }
          ],
        },
        totaleSpeso: {
          $sum: "$pagamentiAssociati.ammount",
        },
        totaleKg: {
            $sum: {
                $map: {
                    input: "$DdtAssociati",
                    as: "ddt",
                    in: {
                        $sum: "$$ddt.beni.kg"
                    }
                }
            }
        }
      },
    },
    {
      $unwind: "$azioni"
    },
    {
      $sort: {
        "azioni.data": -1
      }
    },
    {
      $group: {
        _id: "$_id",
        nome: { $first: "$nome" },
        azioni: { $push: "$azioni" },
        totaleSpeso: { $first: "$totaleSpeso" },
        totaleKg: { $first: "$totaleKg" }
      }
    }
  ]

  if (id) {
    pipeline.unshift({
      $match: { _id: new mongoose.Types.ObjectId(id) },
    });
  }

  const risultato = await this.aggregate(pipeline).exec();
  
  return risultato; 
}

// Definizione del modello
const ClienteModel = mongoose.model("Cliente", ClienteSchema);

export default ClienteModel;
