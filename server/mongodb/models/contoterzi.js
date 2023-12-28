import mongoose from "mongoose";

const ContoterziSchema = new mongoose.Schema({
    beni: [{
        colore:{type: mongoose.Schema.Types.ObjectId, ref: "Colore"},
        hex: {type: String},
        lotto: {type: mongoose.Schema.Types.ObjectId, ref: "Lotto"},
        kg: {type: Number},
        n: {type: Number},
    }],
    lavorata: [{type:mongoose.Schema.Types.ObjectId, ref: "Lavorata"}],
    tara: {type: Number},
    dataentrata: {type: Date, required: true},
    ddt: {type: mongoose.Schema.Types.ObjectId, ref: "Ddt"}
});

ContoterziSchema.pre('deleteOne', { document: true }, async function(next) {
  const LottoModel = this.model('Lotto');
  console.log("lotto dhn")

  // `this.beni` è l'array di oggetti che contiene le proprietà `lotto`
  if (this.beni && this.beni.length) {
      // Itera su ogni `bene` per rimuovere il riferimento a questo `ContoTerzi`
      for (const bene of this.beni) {
          if (bene.lotto) {
              await LottoModel.findByIdAndUpdate(
                  bene.lotto,
                  { $pull: { contoterzi: this._id } }
              );
          }
      }
  }
  
  next();
});


ContoterziSchema.statics.Aggregazione = async function (id) {
    const pipeline =   [
      {
        $lookup: {
          from: "lottos", // sostituisci con il nome effettivo della tua collezione di lotti
          localField: "beni.lotto",
          foreignField: "_id",
          as: "beniLottoInfo"
        }
      },
    // Unisci (join) i dati della collezione 'lotti' con l'array 'lavorata'
      {
        $lookup: {
          from: "lottos", // sostituisci con il nome effettivo della tua collezione di lotti
          localField: "lavorata.lotto",
          foreignField: "_id",
          as: "lavorataLottoInfo"
        }
      },
      {
        $lookup: {
          from: "ddts", // sostituisci con il nome effettivo della tua collezione di lotti
          localField: "ddt",
          foreignField: "_id",
          as: "allddts"
        }
      },
    // Aggiungi il campo 'lottoname' ad ogni elemento dell'array 'beni'
      {
        $addFields: {
          beni: {
            $map: {
              input: "$beni",
              as: "b",
              in: {
                $mergeObjects: [
                  "$$b",
                  {
                    lottoname: {
                      $let: {
                        vars: {
                          lottoInfo: {
                            $first: {
                              $filter: {
                                input: "$beniLottoInfo",
                                as: "lottoInfo",
                                cond: { $eq: ["$$lottoInfo._id", "$$b.lotto"] }
                              }
                            }
                          }
                        },
                        in: "$$lottoInfo.name" // Il nome del lotto viene preso dal documento corrispondente
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
    // Aggiungi il campo 'lottoname' ad ogni elemento dell'array 'lavorata'
      {
        $addFields: {
          lavorata: {
            $map: {
              input: "$lavorata",
              as: "l",
              in: {
                $mergeObjects: [
                  "$$l",
                  {
                    lottoname: {
                      $let: {
                        vars: {
                          lottoInfo: {
                            $first: {
                              $filter: {
                                input: "$lavorataLottoInfo",
                                as: "lottoInfo",
                                cond: { $eq: ["$$lottoInfo._id", "$$l.lotto"] }
                              }
                            }
                          }
                        },
                        in: "$$lottoInfo.name" // Il nome del lotto viene preso dal documento corrispondente
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      {
        $unwind: "$beni",
      },
        {
          $addFields: {
              "beni.kg": {
                  $subtract: [
                      "$beni.kg", 
                      {
                          $reduce: {
                              input: { $ifNull: ["$lavorata", []] },
                              initialValue: 0,
                              in: {
                                  $cond: {
                                      if: {
                                          $and: [
                                              { $eq: ["$$this.colore", "$beni.colore"] },
                                              { $eq: ["$$this.lotto", "$beni.lotto"] }
                                              // { $eq: ["$$this.checked", true] } // Commentato, ma può essere decommentato se necessario
                                          ],
                                      },
                                      then: { $add: ["$$value", "$$this.kg"] },
                                      else: "$$value",
                                  },
                              },
                          },
                      }
                  ],
              },
              "beni.n": {
                  $subtract: [
                      "$beni.n", 
                      {
                          $reduce: {
                              input: { $ifNull: ["$lavorata", []] },
                              initialValue: 0,
                              in: {
                                  $cond: {
                                      if: {
                                          $and: [
                                              { $eq: ["$$this.colore", "$beni.colore"] },
                                              { $eq: ["$$this.lotto", "$beni.lotto"] }
                                              // { $eq: ["$$this.checked", true] } // Commentato, ma può essere decommentato se necessario
                                          ],
                                      },
                                      then: { $add: ["$$value", "$$this.n"] },
                                      else: "$$value",
                                  },
                              },
                          },
                      }
                  ],
              },
              "beni.hex": "$beni.hex"
          },
      },
      {
        $project: {
            _id: 1,
            beni: 1,
            lavorata: {
                $filter: {
                input: "$lavorata",
                as: "lavorataItem",
                cond: { $eq: ["$$lavorataItem.checked", true] },
                },
            },
            unchecked: {
                $filter: {
                    input: "$lavorata",
                    as: "lavorataItem",
                    cond: { $eq: ["$$lavorataItem.checked", false] },
                    },
            },
            tara: 1, // Includi il campo tara
            dataentrata: 1, // Includi il campo dataentrata
            allddts: 1, // Includi il campo ddt
        },
      },
        {
          $group: {
              _id: "$_id",
              beni: { $push: "$beni" },
              lavorata: { $first: "$lavorata" },
              unchecked: { $first: "$unchecked" },
              tara: { $first: "$tara" },
              dataentrata: { $first: "$dataentrata" },
              ddt: { $first: "$allddts" },
          },
        }
      ];
    
      // Aggiungi una fase $match solo se l'ID è definito
      if (id) {
        pipeline.unshift({
          $match: { _id: new mongoose.Types.ObjectId(id) },
        });
      }
    
      const risultato = await this.aggregate(pipeline).exec();
    
      return risultato;
}

ContoterziSchema.statics.Lavorata = async function (id){
  const pipeline = [
    {
        $lookup: {
            from: "lavoratas",
            localField: "lavorata",
            foreignField: "_id",
            as: "lavorataDetails"
        }
    },
    {
        $lookup: {
            from: "ddts",
            localField: "ddt",
            foreignField: "_id",
            as: "ddtDetails"
        }
    },
    {
        $lookup: {
            from: "colores",
            localField: "beni.colore",
            foreignField: "_id",
            as: "coloreDetails"
        }
    },
    {
        $lookup: {
            from: "lottos",
            localField: "beni.lotto",
            foreignField: "_id",
            as: "lottoDetails"
        }
    },
    {
        $addFields: {
            ddt: { $arrayElemAt: ["$ddtDetails", 0] },
            "beni.lotto": { $arrayElemAt: ["$lottoDetails", 0] }
        }
    },
    {
        $addFields: {
            lavorataFlattened: {
                $reduce: {
                    input: "$lavorataDetails",
                    initialValue: [],
                    in: { $concatArrays: ["$$value", "$$this.lavorata"] }
                }
            }
        }
    },
    {
        $addFields: {
            beni: {
                $map: {
                    input: "$beni",
                    as: "bene",
                    in: {
                        $mergeObjects: [
                            "$$bene",
                            {
                                kg: {
                                    $cond: [
                                        { $eq: [{ $arrayElemAt: ["$lavorataDetails.checked", 0] }, true] },
                                        0,
                                        {
                                            $subtract: [
                                                "$$bene.kg",
                                                {
                                                    $sum: {
                                                        $map: {
                                                            input: {
                                                                $filter: {
                                                                    input: "$lavorataFlattened",
                                                                    as: "lavorataItem",
                                                                    cond: {
                                                                        $eq: ["$$lavorataItem.beneId", { $convert: { input: "$$bene._id", to: "string" } }]
                                                                    }
                                                                }
                                                            },
                                                            as: "filteredLavorata",
                                                            in: "$$filteredLavorata.kg"
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                },
                                colore: {
                                    $first: {
                                        $filter: {
                                            input: "$coloreDetails",
                                            as: "coloreDetail",
                                            cond: { $eq: ["$$coloreDetail._id", "$$bene.colore"] }
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }
    },
    {
      $addFields: {
          beni: {
              $filter: {
                  input: "$beni",
                  as: "bene",
                  cond: { $gt: ["$$bene.kg", 0] }
              }
          }
      }
    },
    {
        $match: {
            "beni.0": { $exists: true } // Assicura che ci sia almeno un 'bene' dopo il filtraggio
        }
    },
    {
        $project: {
            beni: 1,
            lavorata: 1,
            tara: 1,
            dataentrata: 1,
            ddt: 1
        }
    }
]


  //   [
  //     {
  //         $lookup: {
  //             from: "lavoratas",
  //             localField: "lavorata",
  //             foreignField: "_id",
  //             as: "lavorataDetails"
  //         }
  //     },
  //     {
  //         $addFields: {
  //             lavorataFlattened: {
  //                 $reduce: {
  //                     input: "$lavorataDetails",
  //                     initialValue: [],
  //                     in: { $concatArrays: ["$$value", "$$this.lavorata"] }
  //                 }
  //             }
  //         }
  //     },
  //     {
  //         $addFields: {
  //             beni: {
  //                 $map: {
  //                     input: "$beni",
  //                     as: "bene",
  //                     in: {
  //                         $mergeObjects: [
  //                             "$$bene",
  //                             {
  //                                 kg: {
  //                                     $subtract: [
  //                                         "$$bene.kg",
  //                                         {
  //                                             $sum: {
  //                                                 $map: {
  //                                                     input: {
  //                                                         $filter: {
  //                                                             input: "$lavorataFlattened",
  //                                                             as: "lavorataItem",
  //                                                             cond: 
  //                                                               { $eq: ["$$lavorataItem.beneId", { $convert: { input: "$$bene._id", to: "string" }}] }
  //                                                         }
  //                                                     },
  //                                                     as: "filteredLavorata",
  //                                                     in: "$$filteredLavorata.kg"
  //                                                 }
  //                                             }
  //                                         }
  //                                     ]
  //                                 }
  //                             }
  //                         ]
  //                     }
  //                 }
  //             }
  //         }
  //     },
  //     {
  //       $project: {
  //           beni: 1, // Mostra l'array 'beni' con tutti i suoi campi
  //           lavorata: 1, // Mostra l'array 'lavorata'
  //           tara: 1, // Mostra il campo 'tara'
  //           dataentrata: 1, // Mostra il campo 'dataentrata'
  //           ddt: 1, // Mostra il riferimento al 'Ddt'
  //           // Altri campi che desideri includere nel risultato finale
  //       }
  //     }
  // ]

  if (id) {
    pipeline.unshift({
      $match: { _id: new mongoose.Types.ObjectId(id) },
    });
  }

  const risultato = await this.aggregate(pipeline).exec();

  return risultato;
}

ContoterziSchema.statics.calculateTotalKg = async function (startDate, endDate) {
  const pipeline = [
    // Step 1: Optionally filter documents by date range if startDate and endDate are provided
    ...(startDate && endDate ? [{
      $match: {
        "dataentrata": { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    }] : []),

    // Step 2: Unwind the 'beni' array to process each item
    { $unwind: "$beni" },

    // Step 3: Group documents and sum the kg
    {
      $group: {
        _id: {
          year: startDate || endDate ? { $year: "$datauscita" } : null, // Apply year grouping only if a date is provided
          month: startDate || endDate ? { $month: "$datauscita" } : null // Apply month grouping only if a date is provided
        }, // Grouping at the root level, change if needed
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

const contoterziModel = mongoose.model("ContoTerzi", ContoterziSchema);

export default contoterziModel