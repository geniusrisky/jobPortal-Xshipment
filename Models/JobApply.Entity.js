import mongoose from "mongoose";
import { Password } from "../utils/index.js";

const JobApplySchema = new mongoose.Schema({
    userId:{ type: mongoose.Types.ObjectId, ref: "User", required: true },
    jobId:{ type: mongoose.Types.ObjectId, ref: "Job", required: true },
    isJobApplied:{type:Boolean, default:false},
    resume:{type:String, required:true},
    currentCtc:{type:Number},
    expectedCtc:{type:Number},
    additionalInfo:{type:Object},
    isDeleted:{type:Boolean, default:false},
    coverLetter:{type:String, default:""}

    
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

JobApplySchema.set("timestamps", true);

JobApplySchema.statics.build = (attrs) => {
    return new JobApply(attrs);
};

const JobApply = mongoose.model(
    "JobApply",
    JobApplySchema
);

export { JobApply, JobApplySchema};
