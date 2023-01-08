import logger from "../logger/logger.js";
import { Employer } from "../Models/Employer.Entity.js";
import CrudOperations from "../utils/db/mongo.crud.js";
import { Password, JwtGenerator } from "../utils/index.js"
import dotenv from "dotenv";
import process from "node:process"
import _ from "lodash";

import mongoose from "mongoose";
dotenv.config({ silent: process.env });





class EmployerService {

    jwtKey;
    jwtGenerator;
    //redisCrudOperations
    constructor(jwtKey) {
        this.jwtKey = jwtKey;
        this.jwtGenerator = new JwtGenerator(this.jwtKey);
    }
    async createEmployer(employer, next) {

        try {
            console.log(employer)
            const existingEmployer = await new CrudOperations(Employer).getDocument({ email: employer.email }, {});
            console.log(existingEmployer)
            if (existingEmployer && existingEmployer.isDeleted == false) {
                next("There is already a Employer with this email");
            } else if (existingEmployer && existingEmployer.isDeleted == true) {
                await new CrudOperations(Employer).deleteDocument({ email: existingEmployer.email });
            }
            employer.isDeleted = false;
            const newEmployer = new Employer(employer);
            
            const savedEmployer = await new CrudOperations(Employer).save(newEmployer);
            
            next(null, "Employer Created", savedEmployer);
        } catch (error) {
            logger.error("Error creating admin Employer", error);
            next("Something went wrong");
        }
    }

    async signIn( email, password, next) {
        try {
            
            let employer = await new CrudOperations(Employer).getDocument({ email: email, isDeleted: false }, {});
             
            if (!employer) {
                return next("No Employer Found");
            }
            const passwordMatch = await Password.compare(employer.password, password);
            if (passwordMatch == false) {
                return next("Invalid Credentials");
            }


            employer.save()
            const EmployerJwt = this.jwtGenerator.generateJwtEmployer(employer._id, employer.email);
            const EmployerData = { accessToken: EmployerJwt, employer: employer, refreshToken: "" };
            next(null, EmployerData);
        } catch (error) {
            logger.error("Error signing in", error);
            next("Something went wrong");
        }
    }

   


    async getEmployer(id, next) {
        try {
            const employer = await new CrudOperations(Employer).getDocument({ _id: id, isDeleted: false }, {});

            if (!Employer) {
                return next('No Employer Found');
            }
            next(null, employer);
        }
        catch (error) {
            logger.error("Error ", error);
            next("Something went wrong");
        }
    }


    async updateEmployer(id, EmployerDoc, next) {
        try {
            const oldEmployer = await new CrudOperations(Employer).getDocument({ _id: id }, {});
            const updatedEmployer = _.extend(oldEmployer, EmployerDoc);
            await new CrudOperations(Employer).updateDocument({ _id: id }, updatedEmployer).then((result) => {
                next(null, result);
            }).catch((error) => { next(error); });
        }
        catch (err) {
            logger.error("UpdateEmployer->", err);
            next("Something went wrong");
        }
    }


    async getAllEmployers(clauses, projections, options, sort, next) {
        try {
            logger.info(clauses)
            const count = await new CrudOperations(Employer).countAllDocuments({ ...clauses, isDeleted: false });
            const results = await new CrudOperations(Employer).getAllDocuments({ ...clauses, isDeleted: false }, projections, options, sort);
            const response = {
                result: results,
                totalResult: count
            };
            next(null, response);
        } catch (error) {
            next("Something went wrong");
        }
    }


    async removeEmployer(id, next) {
        
        try {
            const employerExist = await new CrudOperations(Employer).getDocument({ _id: id }, {});
            if (employerExist) {
                const employer = await new CrudOperations(Employer).updateDocument({ _id: id }, { isDeleted: true });
                return next(null, "Employer Removed", employer);
            } else {
                next("No Employer Found To Remove!");
            }
        } catch (error) {
            logger.error("Error removing admin Employer", error);
            next("Something went wrong");
        }
    }

}






export default new EmployerService(process.env.jwtKey);