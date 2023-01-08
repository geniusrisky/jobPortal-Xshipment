

import { HttpException, HttpResponse } from "../../../../utils/index.js";
import JobServices from "../../../../services/Job.service.js";
import logger from "../../../../logger/logger.js";

export class JobController {
    createJob(request, response, next) {
        try {
            const Job = request.body;

            JobServices.createJob(Job, (err, result, savedJob) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse(" Job Created", savedJob, result, null, null, null));
                }
            });

        } catch (error) {
            next(new HttpException(400, "Something went wrong"));
        }
    }



    async getJob(request, response, next) {
        try {
            const id = request.params.id;
            JobServices.getJob(id, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                }
                else {
                    response.status(200).send(new HttpResponse("getJobById", result, null, null, null, null))
                }
            })
        }
        catch (error) {
            next(new HttpException(400, "Something went Wrong"))
        }
    }

    async updateJob(request, response, next) {
        try {
            const id = request.currentUser.id;
            const jobId = request.params.jobId

            const JobData = request.body;

            JobServices.updateJob(id, jobId, JobData, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse("update profile", result, "Profile Updated", null, null, null));
                }
            });
        } catch (err) {
            next(new HttpException(400, "Something went wrong in Update Profile"));
        }
    }



    getAllJobs(request, response, next) {
        try {
            const query = request.query;

            const sort = {};
            let projections = {};
            let options = {
                limit: 0,
                pageNo: 0
            };

            // eslint-disable-next-line prefer-const
            let { limit, pageNo, sortBy, orderBy, ...clauses } = query;
            if (query.limit, query.pageNo) {
                options = { limit: parseInt(limit), pageNo: parseInt(pageNo) };
                delete clauses.limit; delete clauses.pageNo;
            }
            if (sortBy && orderBy) {
                sort[sortBy] = orderBy === "desc" ? -1 : 1;
            }
            if (clauses.searchTerm && clauses.searchValue) {
                const searchTerm = {};
                searchTerm[clauses.searchTerm] = new RegExp(`^${clauses.searchValue}`, "i");
                clauses = { ...clauses, ...searchTerm };
                delete clauses.searchTerm, delete clauses.searchValue;
            }
            projections = {
                password: 0,
                __v: 0
            };
            JobServices.getAllJobs(clauses, projections, options, sort, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse(null, result.result, null, null, result.totalResult, query.pageNo));
                }
            });
        } catch (error) {
            next(new HttpException(400, "Something went wrong"));
        }
    }

    removeJob(request, response, next) {
        try {
            const id = request.params.id;
            JobServices.removeJob(id, (err, result) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse(null, result, null, null, null, null));
                }
            });

        } catch (error) {
            next(new HttpException(400, "Something went wrong"));
        }
    }


}

export default new JobController();