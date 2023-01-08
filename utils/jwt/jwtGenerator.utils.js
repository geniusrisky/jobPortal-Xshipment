import jwt from "jsonwebtoken";

class JwtGenerator {
     jwtKey;

    constructor(jwtKey) {
        this.jwtKey = jwtKey;
    }

    generateJwtClient(userid, username, roleName) {
        const payload = {
            id: userid,
            username: username,
            role: roleName,
        };

        const signoptions = {
            issuer: "Job-Portal",
            subject: userid.toString(),
            algorithm: "HS256",
        };

        const token = jwt.sign(
            payload,
            this.jwtKey,
            signoptions
        );

        return token;
    }

     generateJwtEmployer(userid, email) {
        const payload = {
            id: userid,
            email: email,
        };

        const signoptions = {
            issuer: "Job-Portal",
            subject: userid.toString(),
            algorithm: "HS256",
        };

        const token = jwt.sign(
            payload,
            this.jwtKey,
            signoptions
        );

        return token;
    }
}

export default JwtGenerator;
