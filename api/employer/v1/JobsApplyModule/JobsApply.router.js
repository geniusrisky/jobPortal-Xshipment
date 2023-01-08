import { Router } from "express";
//import JobApplyController from "./adminJobApplyAuth.controller.js";
import JobApplyController from "./JobsApply.controller.js";
const router = Router();



//router.get("/getJobApply", JobApplyController.getJobApply);
router.put("/updateJobApply/:jobApplyId", JobApplyController.updateJobApply)
router.get("/getAllJobApply", JobApplyController.getAllJobApplys)
router.delete("/removeJobApply/:id", JobApplyController.removeJobApply)
router.post("/createJobApply", JobApplyController.createJobApply ); 
router.get("/getJobApply/:id", JobApplyController.getJobApply);

export default router;