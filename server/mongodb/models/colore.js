import mongoose from "mongoose";

const ColoreSchema = new mongoose.Schema({
    name: {type: String, required: true },
    codice: {type: String, required: true},
    hex: {type: String, default: "#ffffff"},
    lotti: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lotto"}]
});

const coloreModel = mongoose.model("Colore", ColoreSchema);

export default coloreModel;