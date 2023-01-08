import mongoose from "mongoose";
import { Password } from "../utils/index.js";

const JobSchema = new mongoose.Schema({
    employerId:{ type: mongoose.Types.ObjectId, ref: "Employer", required: true },
    companyName:{type:String, required:false},
    title:{type:String, required:false},
    description:{type:String, default:''},
    requiredSkills:{type:[Object], required:false},
    experience:{type:Number},
    isDeleted:{type:Boolean, default:false},
    companyLogo:{type:String, required:false}
    
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            
            delete ret.__v;
        }
    }
}
);



JobSchema.set("timestamps", true);

JobSchema.statics.build = (attrs) => {
    return new Job(attrs);
};

const Job = mongoose.model(
    "Job",
    JobSchema
);

export { Job, JobSchema};
