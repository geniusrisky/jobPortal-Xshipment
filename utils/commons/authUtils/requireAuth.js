import { HttpException } from "../../index.js";

export const requireAuth = (
    req,
    res,
    next
) => {
    console.log(req.currentUser)
    if (!req.currentUser) {
        next(new HttpException(401, "Not Authorized"));
    }
    next();
};