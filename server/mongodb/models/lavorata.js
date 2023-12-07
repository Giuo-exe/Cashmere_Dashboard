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
            checked : {type: Boolean, default: false}
        }],
    default: []},
    datauscita: {type: Date, required: true},
    ddtuscita: {type: String, required: true} 
});

const lavorataModel = mongoose.model("Lavorata", LavorataSchema);

export default lavorataModel