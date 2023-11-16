import Colore from "../mongodb/models/colore.js";

const getAllColoriWithoutCondition = async (req,res) => {
    try {
        const colore = await Colore.find({})
        
        res.status(200).json(colore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllColori = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        name_like = "",
    } = req.query;

    const query = {};

    if (name_like) {
        query.name = { $regex: name_like, $options: "i" };
    }

    try {
        const count = await Colore.countDocuments({ query });

        const colore = await Colore.find(query)
            .limit(_end)
            .skip(_start)
            .sort({ [_sort]: _order });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(colore);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createColore = async (req,res) => {
    try{
        const {codice,name,hex} = req.body;

        const ColoreExist = await Colore.findOne({ codice });

        if(ColoreExist) return res.status(200).json(ColoreExist);

        const newColore = await Colore.create({
            codice,
            name,
            hex
        });

        res.status(200).json( newColore );

    }catch(error){
        res.status(500).json( {message : error.message} );
    }
};


const getColoreInfo = async (req,res) => {
    const { id } = req.params;
    const ColoreExist = await Colore.findOne({ _id : id })

    if(ColoreExist) { 
        res.status(200).json(ColoreExist)
    } else {
        res.status(404).json({ message : "Pagamento non trovato non trovata" })
    }
};
const updateColore = async (req,res) => {}

const deleteColore = async (req,res) => {
    const { id } = req.params;

    const ColoreToDelete = await Colore.findById({ _id: id });

    if (!ColoreToDelete) throw new Error("Colore not found");


    try {
    // Elimina i pagamenti associatfattura
        await Colore.deleteOne({ _id: id });

        res.status(200).json({ message: "Colore cancellato con successo" });
        
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}


export {
    getAllColori,
    createColore,
    getColoreInfo,
    updateColore,
    deleteColore,
    getAllColoriWithoutCondition
}