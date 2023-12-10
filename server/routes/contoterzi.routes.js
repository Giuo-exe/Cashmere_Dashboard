import express from 'express';

import{
    createContoTerzi,getAllContoTerzi,getContoTerziDetail,getContoterziLavorata,deleteContoTerzi,updateContoTerzi,RemoveLavorata ,updateLavorataCheckedStatus,getSingleContoterziDifference,getContoterziDifference, lavorataContoTerzi
} from "../controllers/contoterzi.controller.js"

const router = express.Router();


//router.route("/difference/:id").get(getContoterziDifference);
router.route("/difference").get(getContoterziDifference);
router.route("/checked/:id").patch(updateLavorataCheckedStatus)
router.route("/removelavorata/:id").patch(RemoveLavorata)
router.route("/lavorata/:id").patch(lavorataContoTerzi);
router.route("/lavorata").get(getContoterziLavorata);

router.route("/").get(getAllContoTerzi);
router.route("/:id").get(getSingleContoterziDifference);
router.route("/").post(createContoTerzi);
router.route("/:id").patch(updateContoTerzi);
router.route("/:id").delete(deleteContoTerzi);

export default router;

