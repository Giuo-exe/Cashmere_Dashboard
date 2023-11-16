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
        colore: {type: String},
        hex: {type: String},
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

const ddtModel = mongoose.model("Ddt", DdtSchema);

export default ddtModel