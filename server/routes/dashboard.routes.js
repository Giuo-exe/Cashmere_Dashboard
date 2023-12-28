import express from 'express';

import {
   getCombinedTotalKgDate
} from "../controllers/dashboard.controller.js"

const router = express.Router();

router.route("/tot/").get(getCombinedTotalKgDate)


export default router;