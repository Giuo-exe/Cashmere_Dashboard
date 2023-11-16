import mongoose from "mongoose";

const PagamentoSchema = new mongoose.Schema({
    data: {type: Date, required: true},
    id: {type: String, required: true},
    ammount: {type: Number, min: 0, required:true},
    note: {type: String},
    fattura: {type: mongoose.Schema.Types.ObjectId, ref: "Fattura"}
});

PagamentoSchema.pre('deleteOne', { document: true}, async function(next) {
    console.log("Pre-deleteOne middleware su Ddt");

    const fatturaId = this.fattura;
    if (fatturaId) {
        const FatturaModel = this.model('Fattura');
        
        // Recupera l'istanza del documento ContoTerzi e chiama deleteOne su di essa
        const fatturaDoc = await FatturaModel.findOne({ _id : fatturaId});

        console.log(fatturaDoc)
        if (fatturaId) {
    
            // Find the Fattura document and remove the reference to this Pagamento
            await FatturaModel.findByIdAndUpdate(fatturaId, {
                $pull: { allPagamenti: this._id }
            });
        }
    }

    next();
});

const PagamentoModel = mongoose.model("Pagamento", PagamentoSchema);

export default PagamentoModel;