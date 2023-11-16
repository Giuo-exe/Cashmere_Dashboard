const mongoose = require("mongoose");

const Payment = mongoose.model("Pagamento"); // Sostituisci con il tuo modello di pagamento

// Ottieni l'anno corrente
const currentYear = new Date().getFullYear();


Payment.aggregate([
  {
    $match: {
      data: {
        $gte: new Date(currentYear, 0, 1), // 1° gennaio dell'anno corrente
        $lt: new Date(currentYear + 1, 0, 1), // 1° gennaio dell'anno successivo
      },
    },
  },
  {
    $group: {
      _id: { $month: "$data" }, // Raggruppa per mese
      totalPayments: { $sum: "$ammount" }, // Calcola il totale dei pagamenti per ciascun mese
    },
  },
  {
    $project: {
      _id: 0, // Nascondi il campo "_id"
      month: "$_id", // Rinomina "_id" in "month"
      totalPayments: 1, // Mantieni il campo "totalPayments"
    },
  },
])
  .exec((err, result) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(result);
  });
