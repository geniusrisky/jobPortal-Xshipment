import logger from "../logger/logger.js";
import { Job } from "../Models/Job.Entity.js";
import CrudOperations from "../utils/db/mongo.crud.js";
import { Password, JwtGenerator } from "../utils/index.js"
import dotenv from "dotenv";
import process from "node:process"
import _ from "lodash";

import mongoose from "mongoose";
dotenv.config({ silent: process.env });





class JobService {

    jwtKey;
    jwtGenerator;
    //redisCrudOperations
    constructor(jwtKey) {
        this.jwtKey = jwtKey;
        this.jwtGenerator = new JwtGenerator(this.jwtKey);
    }
    async createJob(job, next) {

        try {
            const existingJob = await new CrudOperations(Job).getDocument({ title: job.title }, {});
            if (existingJob && existingJob.isDeleted == false) {
                next("There is already a Job with this email");
            } else if (existingJob && existingJob.isDeleted == true) {
                await new CrudOperations(Job).deleteDocument({ title: existingJob.title });
            }
            job.isDeleted = false;
            const newJob = new Job(job);
            const savedJob = await new CrudOperations(Job).save(newJob);
            console.log(savedJob)
            next(null, "Job Created", savedJob);
        } catch (error) {
            logger.error("Error creating admin Job", error);
            next("Something went wrong");
        }
    }

    
   


    async getJob(id, next) {
        try {
            const job = await new CrudOperations(Job).getDocument({ _id: id, isDeleted: false }, {});

            if (!job) {
                return next('No Job Found');
            }
            next(null, job);
        }
        catch (error) {
            logger.error("Error ", error);
            next("Something went wrong");
        }
    }


    async updateJob(id,jobId, JobDoc, next) {
        try {
            const oldJob = await new CrudOperations(Job).getDocument({ _id: jobId, employerId:mongoose.Types.ObjectId(id)  }, {});
            const updatedJob = _.extend(oldJob, JobDoc);
            await new CrudOperations(Job).updateDocument({ _id: jobId,  employerId:mongoose.Types.ObjectId(id) }, updatedJob).then((result) => {
                next(null, result);
            }).catch((error) => { next(error); });
        }
        catch (err) {
            logger.error("UpdateJob->", err);
            next("Something went wrong");
        }
    }


    async getAllJobs(clauses, projections, options, sort, next) {
        try {
            logger.info(clauses)
            const count = await new CrudOperations(Job).countAllDocuments({ ...clauses, isDeleted: false });
            const results = await new CrudOperations(Job).getAllDocuments({ ...clauses, isDeleted: false }, projections, options, sort);
            const response = {
                result: results,
                totalResult: count
            };
            next(null, response);
        } catch (error) {
            next("Something went wrong");
        }
    }


    async removeJob(id, next) {
        
        try {
            const jobExist = await new CrudOperations(Job).getDocument({ _id: id }, {});
            if (jobExist) {
                const job = await new CrudOperations(Job).updateDocument({ _id: id }, { isDeleted: true });
                return next(null, "Job Removed", job);
            } else {
                next("No Job Found To Remove!");
            }
        } catch (error) {
            logger.error("Error removing admin Job", error);
            next("Something went wrong");
        }
    }

}






export default new JobService(process.env.jwtKey);