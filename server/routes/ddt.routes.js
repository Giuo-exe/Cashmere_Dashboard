import express from 'express';

import { getDdtDetail,getAllddt,deleteDdt,updateDdt,createDdt,getVenditaddt, getAllDdteSelected} from '../controllers/ddt.controller.js';

const router = express.Router();

router.route("/vendita").get(getVenditaddt);
router.route("/selected").get(getAllDdteSelected);
router.route("/").post(createDdt);
router.route("/").get(getAllddt);
router.route("/:id").get(getDdtDetail);

router.route("/:id").patch(updateDdt);
router.route("/:id").delete(deleteDdt);

export default router;