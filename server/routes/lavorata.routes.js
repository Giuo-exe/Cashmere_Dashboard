import express from 'express';

import {createLavorata, getAllLavorata, getGiacenza, getLavorataGiacenza,getTotalKgDate} from "../controllers/lavorata.controller.js"

const router = express.Router();

router.route("/giacenza").get(getLavorataGiacenza);
router.route("/tot/").get(getTotalKgDate);
router.route("/").get(getAllLavorata);
router.route("/").post(createLavorata);


export default router;