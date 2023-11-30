import ContoTerzi from "../mongodb/models/contoterzi.js"
import Lotto from "../mongodb/models/lotto.js"
import mongoose from "mongoose"


const getAllContoTerzi = async (req,res) => {
    const {
        _end,
        _order,
        _start,
        _sort,
        dataentrata = "",
    } = req.query;

    const query = {};
    
    if (dataentrata !== "") {
        query.dataentrata = dataentrata;
    }

    try {
        const count = await ContoTerzi.countDocuments({ query });
        const contoterzi = await ContoTerzi.find(query)
            .limit()
            .skip(_start)
            .sort({ [_sort]: _order })
            .populate({
                path: 'beni.lotto',
                model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
              })
            .populate({
              path: 'ddt',
              model: 'Ddt', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
            })
            .populate({
              path: "beni.colore",
              model: "Colore"
            });

        res.header("x-total-count", count);
        res.header("Access-Control-Expose-Headers", "x-total-count");

        res.status(200).json(contoterzi);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const createContoTerzi = async (req,res) => {
    try {
        const {
            dataentrata,
            quantity,
            lotto
        } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const LottoTrovato = await Lotto.findOne({ _id: lotto }).session(session);
        if (!LottoTrovato) throw new Error("Lotto non Trovato");

        const newContoTerzi = await ContoTerzi.create({
            dataentrata,
            quantity,
            lotto: LottoTrovato._id
        });

        LottoTrovato.contoterzi.push(newContoTerzi._id);
        await LottoTrovato.save({ session });

        await session.commitTransaction();

        res.status(200).json({ message: "Merce mandata al contoterzi" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateLavorataCheckedStatus = async (req, res) => {
  const { id } = req.params; // Assumo che gli ID siano passati tramite i parametri della richiesta
  const { lavorataId } = req.body 
  try {

      // Verifica se ContoTerzi esiste
      const contoterzi = await ContoTerzi.findById(id);
      if (!contoterzi) {
          return res.status(404).json({ message: "Contoterzi non trovato" });
      }

      // Verifica se l'elemento lavorata esiste
      const lavorataItem = contoterzi.lavorata.id(lavorataId);
      if (!lavorataItem) {
          return res.status(404).json({ message: "Elemento lavorata non trovato" });
      }

      // Aggiorna lo stato checked
      lavorataItem.checked = true;
      await contoterzi.save();

      res.status(200).json({ message: "Stato checked di lavorata aggiornato con successo" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const RemoveLavorata = async (req, res) => {
  const { id } = req.params; // Assumo che gli ID siano passati tramite i parametri della richiesta
  const { lavorataId } = req.body;

  try {
      // Verifica se ContoTerzi esiste
      const contoterzi = await ContoTerzi.findById(id);
      if (!contoterzi) {
          return res.status(404).json({ message: "Contoterzi non trovato" });
      }

      // Verifica se l'elemento lavorata esiste
      const lavorataItemIndex = contoterzi.lavorata.findIndex(item => item.id === lavorataId);
      if (lavorataItemIndex === -1) {
          return res.status(404).json({ message: "Elemento lavorata non trovato" });
      }

      // Rimuove l'elemento dall'array di lavorata
      contoterzi.lavorata.splice(lavorataItemIndex, 1);
      await contoterzi.save();

      res.status(200).json({ message: "Elemento lavorata rimosso con successo" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


const getSingleContoterziDifference = async (req, res) => {

  const {id} = req.params

  try{

    const result = await ContoTerzi.Aggregazione(id)
    // Send the HTTP response with the result
    res.status(200).json(result);

  } catch (err) {
    // Handle errors and send an error response
    res.status(500).json({ error: "Error retrieving differences" });
  }
};

const getContoterziDifference = async (req, res) => {

  try{

    const result = await ContoTerzi.Aggregazione()
 
    // Send the HTTP response with the result
    res.status(200).json(result);

  } catch (err) {
    // Handle errors and send an error response
    res.status(500).json({ error: "Error retrieving differences" });
  }
};

const getContoTerziDetail = async (req,res) => {
  const {id} = req.params

  try{

    const ConterterziDetail = await ContoTerzi.findOne({_id : id})
    .populate({
      path: 'beni.lotto',
      model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
      path: 'colore',
      model: 'Colore', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
      path: 'lavorata.lotto',
      model: 'Lotto', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    })
    .populate({
      path: 'ddt',
      model: 'Ddt', // Make sure 'Pagamento' matches your actual Mongoose model name for payments
    });
    if(ConterterziDetail){
      if (!ConterterziDetail.lavorata) {
        ConterterziDetail.lavorata = [];
      }

      res.status(200).json(ConterterziDetail); 

    } else {
      res.status(404).json("ContoTerzi non trovato") 
    }

    // Send the HTTP response with the result
  }catch(error){
    res.status(500).json(error) 
  }
}

const lavorataContoTerzi = async (req, res) => {
  const { id } = req.params; // Note: It should be req.params not res.params

  const { cart } = req.body;

  if (!cart || !Array.isArray(cart)) {
      return res.status(400).send({ message: "Invalid input data." });
  }

  try {
      const contoterzi = await ContoTerzi.findById(id);
      if (!contoterzi) {
          return res.status(404).send({ message: "Contoterzi not found." });
      }

      for(let item of cart){
        const data = item.beni;
        const newLavorata = {
            colore: data.colore,
            lotto: data.lotto,
            hex: data.hex,
            kg: data.kg,
            n: data.n,
            scarto: data.scarto,
            datauscita: data.datauscita
        }
    
        contoterzi.lavorata.push(newLavorata);
    }
      
      await contoterzi.save();

      res.status(200).send({ message: "Lavorata updated successfully." });
  } catch (error) {
      res.status(500).send({ message: "Error updating lavorata.", error: error.message });
  }
};



const deleteContoTerzi = async (req,res) => {

}

const updateContoTerzi = async (req,res) => {
    
}

export {
    getAllContoTerzi,
    createContoTerzi,
    getContoTerziDetail,
    deleteContoTerzi,
    updateContoTerzi, 
    getSingleContoterziDifference,
    getContoterziDifference,
    lavorataContoTerzi,
    RemoveLavorata,
    updateLavorataCheckedStatus}