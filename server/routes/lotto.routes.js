import express from 'express';

import{
    createLotto, deleteLotto, getAllLotti, getLottoDetail, lottoContoterzi, updateLotto, LottoSingleDifferencesContoterzi, getLottoType,getTotals,LottoDifferencesContoterzi,AddFattura
} from "../controllers/lotto.controller.js"

const router = express.Router();

router.route("/addfattura").post(AddFattura)
router.route("/difference").get(LottoDifferencesContoterzi);
router.route("/difference/:id").get(LottoSingleDifferencesContoterzi);
router.route("/contoterzi").get(getLottoType)
router.route("/totals").get(getTotals)
router.route("/").get(getAllLotti);
router.route("/:id").get(getLottoDetail);
router.route("/").post(createLotto);
router.route("/:id").patch(updateLotto);
router.route("/:id").delete(deleteLotto);

export default router;   

