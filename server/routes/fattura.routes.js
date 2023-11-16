import express from 'express';

import{
    createFattura, getAllFatture, updateFattura, deleteFattura, getFattureDetail,ShowDeadlineFattura, addDdt ,updatePagato, getAllFattureSelected
} from "../controllers/fattura.controller.js"

const router = express.Router();

router.route("/").get(getAllFatture);
router.route("/selected").get(getAllFattureSelected);
router.route("/deadline").get(ShowDeadlineFattura);
router.route("/pagato/:id").patch(updatePagato);
router.route("/addddt").post(addDdt);
router.route("/:id").get(getFattureDetail);
router.route("/").post(createFattura);
router.route("/:id").patch(updateFattura);
router.route("/:id").delete(deleteFattura);

export default router;



