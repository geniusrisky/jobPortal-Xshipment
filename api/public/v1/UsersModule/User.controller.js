

import { HttpException, HttpResponse } from "../../../../utils/index.js";
import userServices from "../../../../services/User.service.js";
import  logger  from "../../../../logger/logger.js";
import { User} from "../../../../Models/User.Entity.js";
import CrudOperations  from "../../../../utils/db/mongo.crud.js";
import {JwtGenerator} from "../../../../utils/index.js";
import dotenv from "dotenv";
import process from "node:process" 
dotenv.config({ silent: process.env });

 class UserController {
   createUser(request, response, next) {
    try {
        const user = request.body;
        
        userServices.createUser(user, (err, result,savedUser) => {
            if (err) {
                next(new HttpException(400, err));
            } else {
                response.status(200).send(new HttpResponse(" user Created", savedUser, result, null, null, null));
            }
        });

    } catch (error) {
        next(new HttpException(400, "Something went wrong"));
    }
}

     signIn(request, response, next) {
        try {
            const { email, password } = request.body;
            
            
            userServices.signIn(request, email, password, (err, result) => {
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

    async  getUser(request,response,next){
        try{
          
             const id = request.currentUser.id
            //const id = request.params.id
            userServices.getUser(id, (err, result)=>{
                if(err){
                    next(new HttpException(400, err));
                }
                else {
                    response.status(200).send(new HttpResponse("getUserById", result, null, null, null, null))
                }
            })
        }
        catch(error){
            next(new HttpException(400, "Something went Wrong"))
        }
     }







    


}

export default new UserController();