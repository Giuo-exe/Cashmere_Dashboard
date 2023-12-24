import mongoose from "mongoose";

const LottoSchema = new mongoose.Schema({
    name: {type: String, required: true },
    ft: {type: String},
    cashmere: [{
        kg :{type: Number, required: true, min: 1},
        colore: {type: String, default: ""},
        hex: {type: String, default: "#ffffff"},
        n: {type: Number, min:1}
    }],
    contoterzi: [{ type: mongoose.Schema.Types.ObjectId, ref: "ContoTerzi"}],
    allFatture: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fattura", default: []}],
    fornitore: {type : String},
    balle: {type: Number},
    data: {type: Date, required: true}
});

LottoSchema.pre('deleteOne', { document: true }, async function(next) {
  const lottoId = this._id;

  const DdtModel = mongoose.model('Ddt');
  const ContoTerziModel = mongoose.model('ContoTerzi');


  try {
      // Aggiorna i documenti Ddt rimuovendo gli elementi in 'beni' che hanno 'lotto' uguale a 'lottoId'
      await DdtModel.updateMany(
          {},
          { $pull: { beni: { lotto: lottoId } } }
      );

      // Aggiorna i documenti ContoTerzi rimuovendo gli elementi in 'lavorata' e 'beni' che hanno 'lotto' uguale a 'lottoId'
      await ContoTerziModel.updateMany(
          {},
          { $pull: { lavorata: { lotto: lottoId }, beni: { lotto: lottoId } } }
      );
  } catch (error) {
      console.error("Errore durante il middleware pre-delete in Lotto:", error);
      return next(error);
  }

  next();
});

LottoSchema.statics.getStats = async function (id) {
    const pipeline = [
      {
        $lookup: {
          from: "contoterzis",
          localField: "contoterzi",
          foreignField: "_id",
          as: "contoterziData",
        },
      },
      {
        $lookup: {
          from: "fatturas",
          localField: "allFatture",
          foreignField: "_id",
          as: "fattureData",
        },
      },
      {
        $lookup: {
          from: "ddts",
          localField: "fattureData.allDdt",
          foreignField: "_id",
          as: "ddtData",
        },
      },
      {
        $addFields: {
          cashmere: {
            $map: {
              input: "$cashmere",
              as: "cashItem",
              in: {
                hex: "$$cashItem.hex",
                colore: "$$cashItem.colore",
                kg: {
                  $reduce: {
                    input: "$contoterziData",
                    initialValue: "$$cashItem.kg",
                    in: {
                      $let: {
                        vars: {
                          matchingBeniKg: {
                            $sum: {
                              $map: {
                                input: {
                                  $filter: {
                                    input:
                                      "$$this.beni",
                                    as: "beniItem",
                                    cond: {
                                      $and: [
                                        {
                                          $eq: [
                                            "$$beniItem.colore",
                                            "$$cashItem.colore",
                                          ],
                                        },
                                        {
                                          $eq: [
                                            "$$beniItem.lotto",
                                            "$_id",
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                },
                                as: "filteredBeni",
                                in: "$$filteredBeni.kg",
                              },
                            },
                          },
                        },
                        in: {
                          $subtract: [
                            "$$value",
                            "$$matchingBeniKg",
                          ],
                        },
                      },
                    },
                  },
                },
                n: {
                  $reduce: {
                    input: "$contoterziData",
                    initialValue: "$$cashItem.n",
                    in: {
                      $let: {
                        vars: {
                          matchingBeniN: {
                            $sum: {
                              $map: {
                                input: {
                                  $filter: {
                                    input:
                                      "$$this.beni",
                                    as: "beniItem",
                                    cond: {
                                      $and: [
                                        {
                                          $eq: [
                                            "$$beniItem.colore",
                                            "$$cashItem.colore",
                                          ],
                                        },
                                        {
                                          $eq: [
                                            "$$beniItem.lotto",
                                            "$_id",
                                          ],
                                        },
                                      ],
                                    },
                                  },
                                },
                                as: "filteredBeni",
                                in: "$$filteredBeni.n",
                              },
                            },
                          },
                        },
                        in: {
                          $subtract: [
                            "$$value",
                            "$$matchingBeniN",
                          ],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          venduti: {
            $reduce: {
              input: "$ddtData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $filter: {
                      input: "$$this.beni",
                      as: "bene",
                      cond: {
                        $eq: ["$$bene.lotto", "$_id"],
                      },
                    },
                  },
                ],
              },
            },
          },
          dalavoraretemp: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$$this.beni",
                          as: "beniItem",
                          cond: {
                            $eq: [
                              "$$beniItem.lotto",
                              "$_id",
                            ],
                          },
                        },
                      },
                      as: "filteredItem",
                      in: {
                        kg: "$$filteredItem.kg",
                        n: "$$filteredItem.n",
                        colore:
                          "$$filteredItem.colore",
                        hex: "$$filteredItem.hex",
                        lotto: "$$filteredItem.lotto",
                        contoterzi: "$$this._id", // Aggiungi l'ID di contoterzi qui
                      },
                    },
                  },
                ],
              },
            },
          },
    
          lavoratatemp: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$$this.lavorata",
                          as: "lavorataItem",
                          cond: {
                            $and: [
                              {
                                $eq: [
                                  "$$lavorataItem.lotto",
                                  "$_id",
                                ],
                              },
                              {
                                $eq: [
                                  "$$lavorataItem.checked",
                                  true,
                                ],
                              },
                            ],
                          },
                        },
                      },
                      as: "filteredLavorata",
                      in: {
                        kg: "$$filteredLavorata.kg",
                        n: "$$filteredLavorata.n",
                        colore:
                          "$$filteredLavorata.colore",
                        lotto:
                          "$$filteredLavorata.lotto",
                        hex: "$$filteredLavorata.hex",
                        scarto:
                          "$$filteredLavorata.scarto",
                        contoterzi: "$$this._id", // Includere l'ID di contoterzi in ogni elemento
                      },
                    },
                  },
                ],
              },
            },
          },
    
          unchecked: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $filter: {
                      input: "$$this.lavorata",
                      as: "lavorataItem",
                      cond: {
                        $and: [
                          {
                            $eq: [
                              "$$lavorataItem.lotto",
                              "$_id",
                            ],
                          },
                          {
                            $eq: [
                              "$$lavorataItem.checked",
                              false,
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          dalavorare: {
            $map: {
              input: "$dalavoraretemp",
              as: "item",
              in: {
                colore: "$$item.colore",
                lotto: "$$item.lotto",
                hex: "$$item.hex",
                contoterzi: "$$item.contoterzi",
                // Assicurati di trasportare il campo contoterzi
                kg: {
                  $subtract: [
                    "$$item.kg",
                    {
                      $ifNull: [
                        {
                          $reduce: {
                            input: "$lavoratatemp",
                            initialValue: 0,
                            in: {
                              $cond: {
                                if: {
                                  $and: [
                                    {
                                      $eq: [
                                        "$$this.colore",
                                        "$$item.colore",
                                      ],
                                    },
                                    {
                                      $eq: [
                                        "$$this.lotto",
                                        "$$item.lotto",
                                      ],
                                    },
                                    {
                                      $eq: [
                                        "$$this.contoterzi",
                                        "$$item.contoterzi",
                                      ],
                                    }, // Confronta anche l'ID di contoterzi
                                  ],
                                },
    
                                then: {
                                  $add: [
                                    "$$value",
                                    "$$this.kg",
                                  ],
                                },
                                else: "$$value",
                              },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
                n: {
                  $subtract: [
                    "$$item.n",
                    {
                      $ifNull: [
                        {
                          $reduce: {
                            input: "$lavoratatemp",
                            initialValue: 0,
                            in: {
                              $cond: {
                                if: {
                                  $and: [
                                      {
                                        $eq: [
                                          "$$this.colore",
                                          "$$item.colore",
                                        ],
                                      },
                                      {
                                        $eq: [
                                          "$$this.lotto",
                                          "$$item.lotto",
                                        ],
                                      },
                                      {
                                        $eq: [
                                          "$$this.contoterzi",
                                          "$$item.contoterzi",
                                        ],
                                      }, // Confronta anche l'ID di contoterzi
                                    ],
                                },
                                then: {
                                  $add: ["$$value", "$$this.n"],
                                },
                                else: "$$value",
                              },
                            },
                          },
                        },
                        0,
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          lavorataGroupedByColor: {
            $map: {
              input: {
                $setUnion: [
                  // to get a list of unique color-hex pairs
                  "$lavoratatemp.colore",
                  "$venduti.colore",
                ],
              },
              as: "color",
              in: {
                colore: "$$color",
                hex: {
                  // Assuming hex is determined by colore, take the first match
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$lavoratatemp",
                            as: "l",
                            cond: {
                              $eq: [
                                "$$l.colore",
                                "$$color",
                              ],
                            },
                          },
                        },
                        as: "lItem",
                        in: "$$lItem.hex",
                      },
                    },
                    0,
                  ],
                },
                totalKgLavorati: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$lavoratatemp",
                          as: "lavorata",
                          cond: {
                            $eq: [
                              "$$lavorata.colore",
                              "$$color",
                            ],
                          },
                        },
                      },
                      as: "filteredLavorata",
                      in: "$$filteredLavorata.kg",
                    },
                  },
                },
                totalScarto: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$lavoratatemp",
                          as: "lavorata",
                          cond: {
                            $eq: [
                              "$$lavorata.colore",
                              "$$color",
                            ],
                          },
                        },
                      },
                      as: "filteredLavorata",
                      in: "$$filteredLavorata.scarto",
                    },
                  },
                },
                totalKgVenduti: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$venduti",
                          as: "venduto",
                          cond: {
                            $eq: [
                              "$$venduto.colore",
                              "$$color",
                            ],
                          },
                        },
                      },
                      as: "filteredVenduti",
                      in: "$$filteredVenduti.kg",
                    },
                  },
                },
                totalN: {
                $sum: {
                  $map: {
                    input: {
                      $filter: {
                        input: "$lavoratatemp",
                        as: "lavorata",
                        cond: {
                          $eq: ["$$lavorata.colore", "$$color"],
                        },
                      },
                    },
                    as: "filteredLavorata",
                    in: "$$filteredLavorata.n",
                  },
                },
              },
              },
            },
          },
        },
      },
      {
        $addFields: {
          lavorata: {
            $map: {
              input: "$lavorataGroupedByColor",
              as: "groupedItem",
              in: {
                colore: "$$groupedItem.colore",
                hex: "$$groupedItem.hex",
                kg: {
                  $subtract: [
                    "$$groupedItem.totalKgLavorati",
                    "$$groupedItem.totalKgVenduti",
                  ],
                },
                n: "$$groupedItem.totalN",
                scarto: "$$groupedItem.totalScarto",
              },
            },
          },
        },
      },
      // Altre fasi di trasformazione se necessario
      // {
      //   $project: {
      //     contoterziData: 0, // Ometti il campo contoterziData intero se non necessario
      // altri_campi_temporanei: 0 // Ometti altri campi temporanei se ce ne sono
      //   },
      // }
      // Fase di group se necessario
      {
        $group: {
          _id: "$_id",
          cashmere: {
            $first: "$cashmere",
          },
          //dalavoraretemp: { $first: "$dalavoraretemp" },
          dalavorare: {
            $first: "$dalavorare",
          },
          venduti: {
            $first: "$venduti",
          },
          //lavoratatemp: { $first: "$lavoratatemp" },
          lavorata: {
            $first: "$lavorata",
          },
          //lavorataGroupedByColor: { $first: "$lavorataGroupedByColor" },
          unchecked: {
            $first: "$unchecked",
          },
          // Aggiungi altri campi che vuoi includere nel gruppo
        },
      },
    ]
    

      if (id) {
        pipeline.unshift({
          $match: { _id: new mongoose.Types.ObjectId(id) },
        });
      }
    
      const risultato = await this.aggregate(pipeline).exec();
    
      return risultato; 
}

LottoSchema.statics.getTotals = async function () {
  const pipeline = [
      {
        $lookup: {
          from: "contoterzis",
          localField: "contoterzi",
          foreignField: "_id",
          as: "contoterziData"
        }
      },
      {
        $lookup: {
          from: "fatturas",
          localField: "allFatture",
          foreignField: "_id",
          as: "fattureData"
        }
      },
      {
        $lookup: {
          from: "ddts",
          localField: "fattureData.allDdt",
          foreignField: "_id",
          as: "ddtData"
        }
      },
      {
        $addFields: {
          cashmere: {
            $map: {
              input: "$cashmere",
              as: "cashItem",
              in: {
                hex: "$$cashItem.hex",
                colore: "$$cashItem.colore",
                kg: {
                  $reduce: {
                    input: "$contoterziData",
                    initialValue: "$$cashItem.kg",
                    in: {
                      $let: {
                        vars: {
                          matchingBeniKg: {
                            $sum: {
                              $map: {
                                input: {
                                  $filter: {
                                    input: "$$this.beni",
                                    as: "beniItem",
                                    cond: {
                                      $and: [
                                        { $eq: ["$$beniItem.colore", "$$cashItem.colore"] },
                                        { $eq: ["$$beniItem.lotto", "$_id"] }
                                      ]
                                    }
                                  }
                                },
                                as: "filteredBeni",
                                in: "$$filteredBeni.kg"
                              }
                            }
                          }
                        },
                        in: {
                          $subtract: [
                            "$$value",
                            "$$matchingBeniKg"
                          ]
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          venduti: {
            "$reduce": {
              "input": "$ddtData",
              "initialValue": [],
              "in": {
                "$concatArrays": [
                  "$$value",
                  {
                    "$filter": {
                      "input": "$$this.beni",
                      "as": "bene",
                      "cond": {
                        "$eq": ["$$bene.lotto", "$_id"]
                      }
                    }
                  }
                ]
              }
            }
          },
          dalavoraretemp: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$$this.beni",
                          as: "beniItem",
                          cond: { $eq: ["$$beniItem.lotto", "$_id"] }
                        }
                      },
                      as: "filteredItem",
                      in: {
                        kg: "$$filteredItem.kg",
                        colore: "$$filteredItem.colore",
                        hex: "$$filteredItem.hex",
                        lotto: "$$filteredItem.lotto",
                        contoterzi: "$$this._id" // Aggiungi l'ID di contoterzi qui
                      }
                    }
                  }
                ]
              }
            }
          },
          lavoratatemp: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$$this.lavorata",
                          as: "lavorataItem",
                          cond: {
                            $and: [
                              { $eq: ["$$lavorataItem.lotto", "$_id"] },
                              { $eq: ["$$lavorataItem.checked", true] }
                            ]
                          }
                        }
                      },
                      as: "filteredLavorata",
                      in: {
                        kg: "$$filteredLavorata.kg",
                        colore: "$$filteredLavorata.colore",
                        lotto: "$$filteredLavorata.lotto",
                        hex: "$$filteredLavorata.hex",
                        scarto: "$$filteredLavorata.scarto",
                        contoterzi: "$$this._id" // Includere l'ID di contoterzi in ogni elemento
                      }
                    }
                  }
                ]
              }
            }
          },
          unchecked: {
            $reduce: {
              input: "$contoterziData",
              initialValue: [],
              in: {
                $concatArrays: [
                  "$$value",
                  {
                    $filter: {
                      input: "$$this.lavorata",
                      as: "lavorataItem",
                      cond: {
                        $and: [
                          { $eq: ["$$lavorataItem.lotto", "$_id"] },
                          { $eq: ["$$lavorataItem.checked", false] }
                        ]
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
          dalavorare: {
            $map: {
              input: "$dalavoraretemp",
              as: "item",
              in: {
                colore: "$$item.colore",
                lotto: "$$item.lotto",
                hex: "$$item.hex",
                contoterzi: "$$item.contoterzi", // Assicurati di trasportare il campo contoterzi
                kg: {
                  $subtract: [
                    "$$item.kg",
                    {
                      $ifNull: [
                        {
                          $reduce: {
                            input: "$lavoratatemp",
                            initialValue: 0,
                            in: {
                              $cond: {
                                if: {
                                  $and: [
                                    { $eq: ["$$this.colore", "$$item.colore"] },
                                    { $eq: ["$$this.lotto", "$$item.lotto"] },
                                    { $eq: ["$$this.contoterzi", "$$item.contoterzi"] } // Confronta anche l'ID di contoterzi
                                  ]
                                },
                                then: { $add: ["$$value", "$$this.kg"] },
                                else: "$$value"
                              }
                            }
                          }
                        },
                        0
                      ]
                    }
                  ]
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          lavorataGroupedByColor: {
            $map: {
              input: {
                $setUnion: [ // to get a list of unique color-hex pairs
                  "$lavoratatemp.colore",
                  "$venduti.colore"
                ]
              },
              as: "color",
              in: {
                colore: "$$color",
                hex: { // Assuming hex is determined by colore, take the first match
                  $arrayElemAt: [
                    {
                      $map: {
                        input: {
                          $filter: {
                            input: "$lavoratatemp",
                            as: "l",
                            cond: { $eq: ["$$l.colore", "$$color"] }
                          }
                        },
                        as: "lItem",
                        in: "$$lItem.hex"
                      }
                    },
                    0
                  ]
                },
                totalKgLavorati: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$lavoratatemp",
                          as: "lavorata",
                          cond: { $eq: ["$$lavorata.colore", "$$color"] }
                        }
                      },
                      as: "filteredLavorata",
                      in: "$$filteredLavorata.kg"
                    }
                  }
                },
                totalScarto: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$lavoratatemp",
                          as: "lavorata",
                          cond: { $eq: ["$$lavorata.colore", "$$color"] }
                        }
                      },
                      as: "filteredLavorata",
                      in: "$$filteredLavorata.scarto"
                    }
                  }
                },
                totalKgVenduti: {
                  $sum: {
                    $map: {
                      input: {
                        $filter: {
                          input: "$venduti",
                          as: "venduto",
                          cond: { $eq: ["$$venduto.colore", "$$color"] }
                        }
                      },
                      as: "filteredVenduti",
                      in: "$$filteredVenduti.kg"
                    }
                  }
                }
              }
            }
          }
        }
      },
      {
        $addFields: {
          lavorata: {
            $map: {
              input: "$lavorataGroupedByColor",
              as: "groupedItem",
              in: {
                colore: "$$groupedItem.colore",
                hex: "$$groupedItem.hex",
                kg: {
                  $subtract: [
                    "$$groupedItem.totalKgLavorati",
                    "$$groupedItem.totalKgVenduti"
                  ]
                },
                scarto: "$$groupedItem.totalScarto"
              }
            }
          }
        }
      },
      // Altre fasi di trasformazione se necessario
      // {
      //   $project: {
      //     contoterziData: 0, // Ometti il campo contoterziData intero se non necessario
      //     // altri_campi_temporanei: 0 // Ometti altri campi temporanei se ce ne sono
      //   }
      // },
      // Fase di group se necessario
      {
        $group: {
          _id: "$_id",
          cashmere: { $first: "$cashmere" },
          //dalavoraretemp: { $first: "$dalavoraretemp" },
          dalavorare: { $first: "$dalavorare" },
          venduti: { $first: "$venduti" },
          //lavoratatemp: { $first: "$lavoratatemp" },
          lavorata: { $first: "$lavorata" },
          //lavorataGroupedByColor: { $first: "$lavorataGroupedByColor" },
          unchecked: { $first: "$unchecked" }
          // Aggiungi altri campi che vuoi includere nel gruppo
        }
      },
    
      {
        $group: {
          _id: null,
          totalCashmere: {
            $sum: {
              $reduce: {
                input: "$cashmere",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.kg"],
                },
              },
            },
          },
          totalDaLavorare: {
            $sum: {
              $reduce: {
                input: "$dalavorare",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.kg"],
                },
              },
            },
          },
          totalLavorata: {
            $sum: {
              $reduce: {
                input: "$lavorata",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.kg"],
                },
              },
            },
          },
          totalVenduta: {
            $sum: {
              $reduce: {
                input: "$venduti",
                initialValue: 0,
                in: {
                  $add: ["$$value", "$$this.kg"],
                },
              },
            },
          },
        },
      }
    ]
  
    const risultato = await this.aggregate(pipeline).exec();
  
    return risultato; 
}


LottoSchema.statics.getStatss = async function (id) {
  const pipeline = 
  [{
    $lookup: {
      from: "contoterzis",
      localField: "contoterzi",
      foreignField: "_id",
      as: "contoterziData",
    },
  },
  {
    $lookup: {
      from: "fatturas",
      localField: "allFatture",
      foreignField: "_id",
      as: "fattureData",
    },
  },
  {
    $lookup: {
      from: "ddts",
      localField: "fattureData.allDdt",
      foreignField: "_id",
      as: "ddtData",
    },
  },
  {
  $addFields: {
  cashmere: {
    $map: {
      input: "$cashmere",
      as: "cashItem",
      in: {
        hex: "$$cashItem.hex",
        colore: "$$cashItem.colore",
        kg: {
          $reduce: {
            input: "$contoterziData",
            initialValue: "$$cashItem.kg",
            in: {
              $subtract: [
                "$$value",
                { // Calculate the total kg to subtract without considering color
                  $sum: {
                    $map: {
                      input: "$$this.beni",
                      as: "beniItem",
                      in: "$$beniItem.kg"
                    }
                  }
                }
              ]
            }
          }
        },
        n: {
          $reduce: {
            input: "$contoterziData",
            initialValue: "$$cashItem.n",
            in: {
              $subtract: [
                "$$value",
                { // Calculate the total n to subtract without considering color
                  $sum: {
                    $map: {
                      input: "$$this.beni",
                      as: "beniItem",
                      in: "$$beniItem.n"
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  },
  },
  },
  
  // Altre fasi di trasformazione se necessario
  // {
  //   $project: {
  //     contoterziData: 0, // Ometti il campo contoterziData intero se non necessario
  // altri_campi_temporanei: 0 // Ometti altri campi temporanei se ce ne sono
  //   },
  // }
  // Fase di group se necessario
  {
    $group: {
      _id: "$_id",
      cashmere: {
        $first: "$cashmere",
      },
      //dalavoraretemp: { $first: "$dalavoraretemp" },
      dalavorare: {
        $first: "$dalavorare",
      },
      venduti: {
        $first: "$venduti",
      },
      //lavoratatemp: { $first: "$lavoratatemp" },
      lavorata: {
        $first: "$lavorata",
      },
      //lavorataGroupedByColor: { $first: "$lavorataGroupedByColor" },
      unchecked: {
        $first: "$unchecked",
      },
      // Aggiungi altri campi che vuoi includere nel gruppo
    },
  },
  ]

  if (id) {
    pipeline.unshift({
      $match: { _id: new mongoose.Types.ObjectId(id) },
    });
  }

  const risultato = await this.aggregate(pipeline).exec();

  return risultato; 
}

const lottoModel = mongoose.model("Lotto", LottoSchema);

export default lottoModel