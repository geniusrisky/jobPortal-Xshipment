
import dotenv from "dotenv"
import process from "node:process"

const upload = async (file, next)=> {
    
    let uploadParams = {
      ACL: "public-read",
      Bucket: "finploy1", //HERE
      Key: "abc/" + file.originalname, //HERE
      Body: file.buffer,
    };
 
    const s3 = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
  
    // Uploading files to the bucket
    let location;
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        throw err;
      }
      //console.log(data)
      location = data;
      next(data);
    });
  };
  
  const  userDocsUpload = async (req, res )=> {
    let files = req.files;
    console.log(files)
    res.send(req.JSON)
    try {
      let upl = await upload(files, (data) => {
       
        return responses.sendSuccessResponse(
          req,
          res,
          constant.STATUS_CODE.CREATED,
          data.Location,
          "image upload successful"
        );
      });
    } catch (err) {
      console.log(err);
    }
  }
export {userDocsUpload}