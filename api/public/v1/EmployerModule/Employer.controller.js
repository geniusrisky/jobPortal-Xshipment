import { HttpException, HttpResponse } from "../../../../utils/index.js";
import EmployerServices from "../../../../services/Employer.service.js";
import dotenv from "dotenv";
import process from "node:process" 

dotenv.config({ silent: process.env });
export class EmployerController {
  
    createEmployer(request, response, next) {
        try {
            const Employer = request.body;
            
            EmployerServices.createEmployer(Employer,  (err, result,savedEmployer) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse(" Employer Created", savedEmployer, result, null, null, null));
                }
            });
    
        } catch (error) {
            next(new HttpException(400, "Something went wrong"));
        }
    }
    
         signIn(request, response, next) {
            try {
                const { email, password } = request.body;
                //console.log(request.body)
                EmployerServices.signIn(email, password, (err, result) => {
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
    
       
     

    async  getEmployer(request,response,next){
        try{
            const id = request.params.id;
            EmployerServices.getEmployer(id, (err, result)=>{
                if(err){
                    next(new HttpException(400, err));
                }
                else {
                    response.status(200).send(new HttpResponse("getEmployerById", result, null, null, null, null))
                }
            })
        }
        catch(error){
            next(new HttpException(400, "Something went Wrong"))
        }
     }

     async updateEmployer(request, response, next) {
        try {
          const id= request.params.id;
          const EmployerData = request.body;
         
          EmployerServices.updateEmployer(id, EmployerData, (err, result) => {
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



      async   getAllEmployers(request, response, next) {
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
            EmployerServices.getAllEmployers(clauses, projections, options, sort, (err, result) => {
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
    
    async removeEmployer(request, response, next) {
        try {
            const id  = request.params.id;
            EmployerServices.removeEmployer(id, (err, result,Employer) => {
                if (err) {
                    next(new HttpException(400, err));
                } else {
                    response.status(200).send(new HttpResponse( result, Employer, null,null, null, null));
                }
            });
      
        } catch (error) {
            next(new HttpException(400, "Something went wrong"));
        }
      }



     
}

export default new EmployerController();