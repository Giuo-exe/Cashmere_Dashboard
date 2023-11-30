import mongoose from "mongoose";


const FatturaSchema = new mongoose.Schema({
    data: {type: Date, required: true},
    id: {type: String, required: true},
    cliente: {type: mongoose.Schema.Types.ObjectId, ref: "Cliente"}, //da fixare
    totale: {type: Number, min:0 , required:true},
    //iva da aggiungere ma automaticamente
    note: {type: String},
    scadenza: {type: Date, required:true},
    pagato: {type: Boolean, default: false},
    allPagamenti: [{ type: mongoose.Schema.Types.ObjectId, ref: "Pagamento"}],
    allDdt: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dtt"}],
    lotto: { type: mongoose.Schema.Types.ObjectId, ref: "Lotto"},
    idKg : {type : [
        {
            id: {type: String},
            kg: {type: Number}
        }
    ], default: []}
    //incassato
    //saldo = totale-incassato
});

FatturaSchema.pre('findOneAndUpdate', async function(next) {
    const query = this;
    const update = query.getUpdate();
    const ClienteModel = mongoose.model('Cliente');

    // Ottieni il vecchio documento prima dell'aggiornamento
    const oldDocument = await query.model.findOne(query.getQuery());

    if (oldDocument && update.cliente && !oldDocument.cliente.equals(update.cliente)) {
        // Rimuovi l'ID della fattura dall'array allFatture del vecchio cliente
        await ClienteModel.findByIdAndUpdate(
            oldDocument.cliente,
            { $pull: { allFatture: oldDocument._id } }
        );

        // Aggiungi l'ID della fattura all'array allFatture del nuovo cliente
        await ClienteModel.findByIdAndUpdate(
            update.cliente,
            { $addToSet: { allFatture: oldDocument._id } }
        );
    }

    next();
});

FatturaSchema.pre('deleteOne',{ document : true }, async function(next) {
    const fatturaId = this._id;

    console.log("arrivo qya")
    const ClienteModel = mongoose.model('Cliente');
    const LottoModel = mongoose.model('Lotto');
    const DdtModel = mongoose.model('Ddt');
    const PagamentoModel = mongoose.model('Pagamento');
    
    // Remove all associated Pagamento documents
    for (const pagamentoId of this.allPagamenti) {
        console.log(pagamentoId)
        await PagamentoModel.deleteOne({ _id: pagamentoId });
    }

    // Update all Ddt documents by removing the reference to this Fattura
    await DdtModel.updateMany(
        { fatture: fatturaId },
        { $pull: { fatture: fatturaId } }
    );

    // Update all Lotto documents by removing the reference to this Fattura
    await LottoModel.updateMany(
        { allFatture: fatturaId },
        { $pull: { allFatture: fatturaId } }
    );

    await ClienteModel.updateMany(
        { allFatture: fatturaId },
        { $pull: { allFatture: fatturaId } }
    );

    next();
});

FatturaSchema.pre('deleteMany',{ document : true }, async function(next) {
    const fatturaId = this._id;

    console.log("arrivo qya")
    const ClienteModel = mongoose.model('Cliente');
    const LottoModel = mongoose.model('Lotto');
    const DdtModel = mongoose.model('Ddt');
    const PagamentoModel = mongoose.model('Pagamento');
    
    // Remove all associated Pagamento documents
    await PagamentoModel.deleteMany({ fattura: fatturaId });

    // Update all Ddt documents by removing the reference to this Fattura
    await DdtModel.updateMany(
        { fatture: fatturaId },
        { $pull: { fatture: fatturaId } }
    );

    // Update all Lotto documents by removing the reference to this Fattura
    await LottoModel.updateMany(
        { allFatture: fatturaId },
        { $pull: { allFatture: fatturaId } }
    );

    await ClienteModel.updateMany(
        { allFatture: fatturaId },
        { $pull: { allFatture: fatturaId } }
    );

    next();
});

const fatturaModel = mongoose.model("Fattura", FatturaSchema);

export default fatturaModel;