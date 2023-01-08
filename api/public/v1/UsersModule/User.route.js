import { Router } from "express";
import userController from "./User.controller.js";

import { verifyTokenClient,requireAuth } from "../../../../utils/commons/authUtils/index.js";


const router = Router();



  

router.post("/createUser", userController.createUser ); 
router.post("/signIn", userController.signIn);
router.get("/getUser/:id", verifyTokenClient, requireAuth, userController.getUser);



export default router;