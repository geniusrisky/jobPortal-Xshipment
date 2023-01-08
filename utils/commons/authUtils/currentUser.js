
import { HttpException } from "./../../index.js";
import jwtVerify from "./jwtVerify.js";

export const verifyTokenClient = (
    req,
    res,
    next
) => {
    
    if (!req.headers.authorization) {
        next(new HttpException(401, "No User Logged In!"));
    } else {
        try {
            jwtVerify.verfyJwtClient(req.headers.authorization, (err, payload) => {
                if (payload) {
                    req.currentUser = payload;
                    next();
                } else {
                    next(new HttpException(401, "Not Authorized!"));
                }
            });
        }
        catch (err) {
            next(new HttpException(401, "Not Authorized!"));
        }
    }
};


export const verifyTokenEmployer = (
    req,
    res,
    next
) => {
   
    if (!req.headers.authorization) {
        next(new HttpException(401, "No User Logged In!"));
    } else {
        try {
            
            jwtVerify.verfyJwtEmployer(req.headers.authorization, (err, payload) => {
               console.log(payload)
                if (payload) {

                    req.currentUser = payload;
                    
                    next();
                } else {
                    next(new HttpException(401, "Not Authorized!"));
                }
            });
        }
        catch (err) {
            next(new HttpException(401, "Not Authorized!"));
        }
    }

};