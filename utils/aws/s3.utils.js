import aws from "aws-sdk";
import fs from "fs";
import logger from "../../logger/logger.js";
import { UuidUtil } from "../index.js";

export class S3Util {
     s3;
    bucket;

    constructor(awsRegion, awsAccessKeyId,
        awsSecretAccessKey, awsApiVersion, awsBucket
    ) {
        this.bucket = awsBucket;
        aws.config.update({
            apiVersion: awsApiVersion,
            accessKeyId: awsAccessKeyId,
            secretAccessKey: awsSecretAccessKey,
            region: awsRegion,
        });
        this.s3 = new aws.S3();
    }

    generateAWSParams = (file, key, bucketName) => {

        const s3Params = {
            ACL: "public-read",
            Body: fs.readFileSync(file?.filepath),
            Bucket: bucketName ?? this.bucket,
            Key: `${key}/${UuidUtil.generateUudiV1()}`,
            ContentType: file.mimetype,
        };
        return s3Params;
    };

    uploadToS3 = (file, key) => {
        logger.info(file.filepath)
        if (file.size > 3000000) {
            return "Strings.file_size_too_big";
        } else {
            this.s3.upload(this.generateAWSParams(file, key), (err, data) => {
                if (err) {
                    return err;
                } else {
                    return data;
                }
            });
        }
    };

    singleFileUpload = (file, key, next, bucketName) => {
        logger.info(file)
        if (file.size > 30000000) {
            next("Strings.file_size_too_big");
        } else {
            this.s3.upload(this.generateAWSParams(file, key, bucketName), (err, data) => {
                if (err) {
                    logger.info(err,data)

                    next(err);
                } else {
                    next(null, data);
                }
            });
        }
    };

    singleVideoUpload = (file, key, next, bucketName) => {
        if(file){
            if (file.size > 30000000) {
                next("Strings.file_size_too_big");
            } else {
                this.s3.upload(this.generateAWSParams(file, key, bucketName), (err, data) => {
                    if (err) {
                        next(err);
                    } else {
                        next(null, data);
                    }
                });
            }
        }else{
            next("File Does Not Found");
        }
    };

    multipleFilesUploadAndSaveLink = (modelObject, location, files, key, next) => {
        const tempList= [];
        Object.keys(files).forEach((file) => {
            if (files[file].size > 3000000) {
                next("Strings.file_size_too_big");
            } else {
                this.s3.upload(this.generateAWSParams(files[file], key),
                    async (error, data) => {
                        if (data) {
                            await tempList.push(data.Location);
                            if (tempList.length === Object.keys(files).length) {
                                modelObject[location] = tempList;
                                next(null, modelObject);
                            }
                        } else {
                            next(error);
                        }
                    }
                );
            }
        });
    };

    // public uploadToS3(file: any, key: any, next: CallableFunction) {
    //     const params = {
    //         ACL: "public-read-write",
    //         Body: file.path,
    //         Bucket: this.bucket,
    //         Key: key,
    //         ContentType: file.type,
    //     };
    //     this.s3.upload(params, (err: any, data: any) => {
    //         if (err) {
    //             next(err);
    //         } else {
    //             next(null, data);
    //         }
    //     });
    // }
}
