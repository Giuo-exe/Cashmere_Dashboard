import express from 'express';

import{
    createCliente, getAllClienti, getClienteInfoByName,deleteCliente,getClientiDetail,updateCliente,getClienteByType,getAllClienteInfo
} from "../controllers/cliente.controller.js"

const router = express.Router();

router.route("/allinfo/:id").get(getAllClienteInfo);
router.route("/").get(getAllClienti);
router.route("/").post(createCliente);
router.route("/:id").get(getClientiDetail);
router.route("/:id").delete(deleteCliente);
router.route("/:id").patch(updateCliente);

router.route("/type/:type").get(getClienteByType);



export default router;

