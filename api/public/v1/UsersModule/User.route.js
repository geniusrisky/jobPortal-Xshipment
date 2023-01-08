import { Router } from "express";
import userController from "./User.controller.js";

import { verifyTokenClient,requireAuth } from "../../../../utils/commons/authUtils/index.js";


const router = Router();



  

router.post("/createUser", userController.createUser ); 
router.post("/signIn", userController.signIn);
router.get("/getUser/:id", verifyTokenClient, requireAuth, userController.getUser);

router.post('/convert', (req, res, next)=> {
    console.log(req.body);                   
    if(typeof req.body.content == 'undefined' || req.body.content == null) {
        res.json(["error", "No data found"]);
    } else {
        res.json(["markdown", req.body.content]);
    }
})

export default router;