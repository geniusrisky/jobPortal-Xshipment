import logger from "../logger/logger.js";
import { JobApply } from "../Models/JobApply.Entity.js";
import CrudOperations from "../utils/db/mongo.crud.js";
import { Password, JwtGenerator } from "../utils/index.js"
import dotenv from "dotenv";
import process from "node:process"
import _ from "lodash";

import mongoose from "mongoose";
dotenv.config({ silent: process.env });





class JobApplyService {

    jwtKey;
    jwtGenerator;
    //redisCrudOperations
    constructor(jwtKey) {
        this.jwtKey = jwtKey;
        this.jwtGenerator = new JwtGenerator(this.jwtKey);
    }
    async createJobApply(jobApply, next) {

        try {
            const existingJobApply = await new CrudOperations(JobApply).getDocument({ jobId: jobApply.jobId, userId:jobApply.userId }, {});
            if (existingJobApply && existingJobApply.isDeleted == false) {
                next("Application already submitted");
            } else if (existingJobApply && existingJobApply.isDeleted == true) {
                await new CrudOperations(JobApply).deleteDocument({ jobId: existingJobApply.jobId });
            }
            jobApply.isDeleted = false;
            jobApply.isJobApplied =true
            
            const newJobApply = new JobApply(jobApply);
            const savedJobApply = await new CrudOperations(JobApply).save(newJobApply);
            console.log(savedJobApply)
            next(null, "JobApply Created", savedJobApply);
        } catch (error) {
            logger.error("Error creating admin JobApply", error);
            next("Something went wrong");
        }
    }

    
   


    async getJobApply(id, next) {
        try {
            const jobApply = await new CrudOperations(JobApply).getDocument({ _id: id, isDeleted: false }, {});

            if (!jobApply) {
                return next('No JobApply Found');
            }
            next(null, jobApply);
        }
        catch (error) {
            logger.error("Error ", error);
            next("Something went wrong");
        }
    }


    async updateJobApply(id,jobApplyId, JobApplyDoc, next) {
        try {
            const oldJobApply = await new CrudOperations(JobApply).getDocument({ _id: jobApplyId, userId: mongoose.Types.ObjectId(id)  }, {});
            const updatedJobApply = _.extend(oldJobApply, JobApplyDoc);
            await new CrudOperations(JobApply).updateDocument({ _id: jobApplyId ,userId: mongoose.Types.ObjectId(id)}, updatedJobApply).then((result) => {
                next(null, result);
            }).catch((error) => { next(error); });
        }
        catch (err) {
            logger.error("UpdateJobApply->", err);
            next("Something went wrong");
        }
    }


    async getAllJobApplys(clauses, projections, options, sort, next) {
        try {
            logger.info(clauses)
            const count = await new CrudOperations(JobApply).countAllDocuments({ ...clauses, isDeleted: false });
            const results = await new CrudOperations(JobApply).getAllDocuments({ ...clauses, isDeleted: false }, projections, options, sort);
            const response = {
                result: results,
                totalResult: count
            };
            next(null, response);
        } catch (error) {
            next("Something went wrong");
        }
    }


    async removeJobApply(id, next) {
        
        try {
            const jobApplyExist = await new CrudOperations(JobApply).getDocument({ _id: id }, {});
            if (jobApplyExist) {
                const jobApply = await new CrudOperations(JobApply).updateDocument({ _id: id }, { isDeleted: true });
                return next(null, "JobApply Removed", jobApply);
            } else {
                next("No JobApply Found To Remove!");
            }
        } catch (error) {
            logger.error("Error removing admin JobApply", error);
            next("Something went wrong");
        }
    }

}






export default new JobApplyService(process.env.jwtKey);