import express from 'express';

import {createLavorata, getAllLavorata, getGiacenza} from "../controllers/lavorata.controller.js"

const router = express.Router();

router.route("/giacenza").get(getGiacenza);
router.route("/").get(getAllLavorata);
router.route("/").post(createLavorata);


export default router;