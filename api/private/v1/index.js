import { Router } from "express";


import userRoutes from "./UsersModule/User.router.js";
import jobRoutes from "./JobsModule/Jobs.router.js"
import jobsApplyRoutes from "./JobsApplyModule/JobsApply.router.js"
const router = Router();

router.use("/user", userRoutes)

router.use("/job", jobRoutes)

router.use('/jobsApply', jobsApplyRoutes)






export default router;