import express from 'express';

import { getAllPagamenti,getPagamentoDetail,createPagamento,deletePagamento,updatePagamento, getYearPagamenti } from '../controllers/pagamento.controller.js';

const router = express.Router();

router.route("/").get(getAllPagamenti);
router.route("/year").get(getYearPagamenti);
router.route("/:id").get(getPagamentoDetail);
router.route("/").post(createPagamento);
router.route("/:id").patch(updatePagamento);
router.route("/:id").delete(deletePagamento);

export default router;

