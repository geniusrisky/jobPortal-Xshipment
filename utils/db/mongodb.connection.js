import mongoose from "mongoose";
import logger from "../../logger/logger.js";

export default class MongoDBConnection {
     mongoUrl;

    constructor(mongoUrl) {
        this.mongoUrl = mongoUrl;
        this.connectToMongoDB();
    }

     async connectToMongoDB() {
        try {
            mongoose.set('strictQuery', false)
            await mongoose.connect(this.mongoUrl)
            .then(() => {
                logger.info("\n*************MONGODB connected**************\n");
            }
              ).catch(err => {
                logger.error("ERROR Connecting the database", JSON.stringify(err, null, 2));
            })
        } 
        catch(err) {
            logger.error("ERROR Connecting the database", JSON.stringify(err, null, 2));

        }
    }
}