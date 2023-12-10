import express from 'express';

import {createLavorata, getAllLavorata} from "../controllers/lavorata.controller.js"

const router = express.Router();

router.route("/").get(getAllLavorata);
router.route("/").post(createLavorata);

export default router;