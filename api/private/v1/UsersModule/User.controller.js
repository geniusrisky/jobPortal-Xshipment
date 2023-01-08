

import { HttpException, HttpResponse } from "../../../../utils/index.js";
import userServices from "../../../../services/User.service.js";
import  logger  from "../../../../logger/logger.js";

export class UserController {
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
            //console.log(request.body)
            userServices.signIn(email, password, (err, result) => {
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
            const {id} = request.body;
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

     async updateUser(request, response, next) {
        try {
          const id= request.currentUser?.id;
          logger.log(request.currentUser)
          const userData = request.body;
         
          userServices.updateUser(id, userData, (err, result) => {
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



      getAllUsers(request, response, next) {
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
            userServices.getAllUsers(clauses, projections, options, sort, (err, result) => {
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
    
    removeUser(request, response, next) {
        try {
            const id  = request.params.id;
            userServices.removeUser(id, (err, result) => {
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



     async changePasswordThroughLink(request, response, next) {
        try {
          const { token, newPassword } = request.body;
         
          userServices.resetPasswordThroughLink(token, newPassword, (err, result) => {
            if (err) {
              next(new HttpException(400, err));
            } else {
              response.status(200).send(new HttpResponse("Change Password Through Link", result, "Password Changed", null, null, null));
            }
          });
        } catch (err) {
          next(new HttpException(400, "Something went wrong"));
        }
      }

      
async addToFavourites(request, response, next){
    try{
        const userId=request.currentUser.id
       const venueId= request.params.id
       userServices.addToFavourites(userId, venueId, (err, result)=>{
        logger.log(result)
        if (err) {
            next(new HttpException(400, err));
          } else {
            response.status(200).send(new HttpResponse("Added To Favourites", result, "you added venue as your favourite one", null, null, null));
          } 
       })

}catch (err) {
    next(new HttpException(400, "Something went wrong"));
}

}

async removeFromFavourites(request, response, next){
    try{
        logger.info(request.params, request.body)
        const userId = request.currentUser.id
        logger.log(request.currentUser)
       const venueId= request.params.venueId
       
       userServices.removeFromFavourites(userId, venueId, (err, result)=>{
        logger.log(result)
        if (err) {
            next(new HttpException(400, err));
          } else {
            response.status(200).send(new HttpResponse("removed From Favourites", result, "you removed this venue from your Favorites", null, null, null));
          } 
       })

}catch (err) {
    next(new HttpException(400, "Something went wrong"));
}

}

async getAllFavourites(request, response, next){
    try{
        
        const userId = request.currentUser.id
       
       userServices.getAllFavourites(userId, (err, result)=>{
        logger.log(result)
        if (err) {
            next(new HttpException(400, err));
          } else {
            response.status(200).send(new HttpResponse("get all favourites", result, "showing all favourites", null, null, null));
          } 
       })

}catch (err) {
    next(new HttpException(400, "Something went wrong"));
}

}

}

export default new UserController();