import { Router } from "express";


//import employerRoutes from '../../public/v1/EmployerModule/Employer.router.js'
import employerRoutes from './EmployerModule/Employer.router.js'
import jobApplyRoutes from './JobsApplyModule/JobsApply.router.js'
import jobRoutes from './JobsModule/Jobs.router.js'
const router = Router();

router.use('/employer', employerRoutes)
router.use('/job', jobRoutes)
router.use('./jobsApply', jobApplyRoutes)









export default router;

