import express from 'express';

import{
    createColore,getAllColori,getColoreInfo,updateColore,deleteColore, getAllColoriWithoutCondition
} from "../controllers/colore.controller.js"
const router = express.Router();

router.route("/").get(getAllColori);
router.route("/condition").get(getAllColoriWithoutCondition)
router.route("/").post(createColore);
router.route("/:id").get(getColoreInfo);
router.route("/:id").patch(updateColore);
router.route("/:id").delete(deleteColore);


export default router;

