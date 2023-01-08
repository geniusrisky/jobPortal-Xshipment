

import { HttpException, HttpResponse } from "../../../../utils/index.js";
import JobApplyServices from "../../../../services/JobsApply.service.js";
import  logger  from "../../../../logger/logger.js";

export class JobApplyController {
   createJobApply(request, response, next) {
    try {
        const jobApply = request.body;
        jobApply.userId = request.currentUser.id
        JobApplyServices.createJobApply(jobApply, (err, result,savedJobApply) => {
            if (err) {
                next(new HttpException(400, err));
            } else {
                response.status(200).send(new HttpResponse(" JobApply Created", savedJobApply, result, null, null, null));
            }
        });

    } catch (error) {
        next(new HttpException(400, "Something went wrong"));
    }
}

   

    async  getJobApply(request,response,next){
        try{
            const id = request.params.id;
            JobApplyServices.getJobApply(id, (err, result)=>{
                if(err){
                    next(new HttpException(400, err));
                }
                else {
                    response.status(200).send(new HttpResponse("getJobApplyById", result, null, null, null, null))
                }
            })
        }
        catch(error){
            next(new HttpException(400, "Something went Wrong"))
        }
     }

     async updateJobApply(request, response, next) {
        try {
          const id= request.currentUser.id;
          
          const JobApplyData = request.body;
          const jobApplyId = request.params.jobApplyId
         
          JobApplyServices.updateJobApply(id, jobApplyId, JobApplyData, (err, result) => {
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



      getAllJobApplys(request, response, next) {
        try {
            const query = request.query;

            const sort = {};
            let projections = {};
            let options= {
                limit: 0,
                pageNo: 0
            };
            
            // eslint-disable-next-line prefer-const
            let { limit, pageNo, sortBy, orderBy, ...clauses } = query;
            if (query.limit, query.pageNo) {
                options = { limit: parseInt(limit), pageNo: parseInt(pageNo ) };
                delete clauses.limit; delete clauses.pageNo;
            }
            if (sortBy && orderBy) {
                sort[sortBy ] = orderBy === "desc" ? -1 : 1;
            }
            if (clauses.searchTerm && clauses.searchValue) {
                const searchTerm = {};
                searchTerm[clauses.searchTerm ] = new RegExp(`^${clauses.searchValue}`, "i");
                clauses = { ...clauses, ...searchTerm };
                delete clauses.searchTerm, delete clauses.searchValue;
            }
            projections = {
                password: 0,
                __v:0
            };
            JobApplyServices.getAllJobApplys(clauses, projections, options, sort, (err, result) => {
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
    
    removeJobApply(request, response, next) {
        try {
            const id  = request.params.id;
            JobApplyServices.removeJobApply(id, (err, result) => {
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

export default new JobApplyController();