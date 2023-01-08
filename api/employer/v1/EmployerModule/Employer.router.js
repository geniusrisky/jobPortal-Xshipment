import { Router } from "express";

import EmployerController from "./Employer.controller.js";
const router = Router();

router.get("/getEmployer",EmployerController.getEmployer)
router.put("/updateEmployer/:id", EmployerController.updateEmployer)
router.get("/getAllEmployer", EmployerController.getAllEmployers)
router.delete("/removeEmployer/:id", EmployerController.removeEmployer)


export default router;