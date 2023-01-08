import { Router } from "express";
import userRoutes from "./UsersModule/User.route.js"
import employerRoutes from './EmployerModule/Employer.router.js'
import formiddable from "formidable"
import {userDocsUpload} from "./fileUpload.js"
import aws from "aws-sdk"
const router = Router();
router.use("/user", userRoutes);
router.use("/employer", employerRoutes)







import dotenv from "dotenv"
import process from "node:process"
import fs from "fs"

const upload = async (file, next)=> {
    const fi = Object.values(file)[0];
    //console.log(fi)
    let uploadParams = {
      ACL: "public-read",
      Bucket: "finploy1", //HERE
      Key: "abc/" + fi.originalFilename, //HERE
      Body: fs.readFileSync(fi?.filepath),
    };
    //console.log()
    const s3 = new aws.S3({
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
  
//   const  userDocsUpload = async (req, res )=> {
//     let files = req.files;
//     console.log(files)
//     res.send(req.JSON)
//     try {
//       let upl = await upload(files, (data) => {
       
//         return responses.sendSuccessResponse(
//           req,
//           res,
//           constant.STATUS_CODE.CREATED,
//           data.Location,
//           "image upload successful"
//         );
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }




router.post("/fileUpload", async (req, res )=> {
    
    
    try {
      const form = new formiddable.IncomingForm({keepExtensions:true})
      form.parse(req, async(err, fields, files)=>{
       
        
        let upl = await upload(files, (data) => {
            console.log(data)
            return res.send(
             {location:data.Location}
        );
        
    })
    
    });
} catch (err) {
    console.log(err);
}
})


export default router;

