import mongoose from "mongoose";

//const Payment = mongoose.model("Pagamento"); // Sostituisci con il tuo modello di pagamento
import Lotto from "../mongodb/models/lotto.js"
import Lavorata from "../mongodb/models/lavorata.js"
import ContoTerzi from "../mongodb/models/contoterzi.js"
import Ddt from "../mongodb/models/ddt.js"

// Ottieni l'anno corrente
// const currentYear = new Date().getFullYear();


// Payment.aggregate([
//   {
//     $match: {
//       data: {
//         $gte: new Date(currentYear, 0, 1), // 1° gennaio dell'anno corrente
//         $lt: new Date(currentYear + 1, 0, 1), // 1° gennaio dell'anno successivo
//       },
//     },
//   },
//   {
//     $group: {
//       _id: { $month: "$data" }, // Raggruppa per mese
//       totalPayments: { $sum: "$ammount" }, // Calcola il totale dei pagamenti per ciascun mese
//     },
//   },
//   {
//     $project: {
//       _id: 0, // Nascondi il campo "_id"
//       month: "$_id", // Rinomina "_id" in "month"
//       totalPayments: 1, // Mantieni il campo "totalPayments"
//     },
//   },
// ])
//   .exec((err, result) => {
//     if (err) {
//       console.error(err);
//       return;
//     }

//     console.log(result);
//   });


const getCombinedTotalKgDate = async (req, res) => {
    const { id } = req.params;  // If needed for 'Lotto.calculateTotalKg'
    const { start, finish } = req.query;

    try {
        // Retrieve totals from both functions
        const lottoResult = await Lotto.calculateTotalKg(start, finish);
        const lavorataResult = await Lavorata.calculateTotalKg(start, finish);
        const ContoterziResult = await ContoTerzi.calculateTotalKg(start, finish);
        const VendutaResult = await Ddt.calculateTotalKgVendita(start, finish);


        // Check if lottoResult is an array with an element and convert it to an object
        const lottoTotalKg = lottoResult.length > 0 ? lottoResult[0] : { totalKg: 0, year: null, month: null };
        const lavorataTotalKg = lavorataResult.length > 0 ? lavorataResult[0] : { totalKg: 0, year: null, month: null };
        const ContoterziTotalKG = ContoterziResult.length > 0 ? ContoterziResult[0] : { totalKg: 0, year: null, month: null };
        const VendutaTotalKg = VendutaResult.length > 0 ? VendutaResult[0] : { totalKg: 0, year: null, month: null };

        // Structure the final result with specific names for each part
        const combinedResult = {
            totalCashmere: lottoTotalKg,  // This is now an object
            totalDaLavorare: ContoterziTotalKG,
            totalLavorata: lavorataTotalKg,  // Assuming this is an array and handled similarly
            totalVenduta: VendutaTotalKg
        };

        // Send the HTTP response with the combined result
        res.status(200).json(combinedResult);
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).json({ message: error.message });
    }
};


export {
  getCombinedTotalKgDate
}