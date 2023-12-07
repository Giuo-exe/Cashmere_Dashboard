import express from 'express';

import {createLavorata} from "../controllers/lavorata.controller.js"

const router = express.Router();

router.route("/").get();
router.route("/").post(createLavorata);

export default router;