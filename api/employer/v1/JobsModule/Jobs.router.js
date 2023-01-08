import { Router } from "express";
//import JobController from "./adminJobAuth.controller.js";
import JobController from "./Jobs.controller.js";
const router = Router();



//router.get("/getJob", JobController.getJob);
router.put("/updateJob/:jobId", JobController.updateJob)
router.get("/getAllJobs", JobController.getAllJobs)
router.delete("/removeJob/:id", JobController.removeJob)
router.post("/createJob", JobController.createJob ); 
router.get("/getJob/:id", JobController.getJob);

export default router;