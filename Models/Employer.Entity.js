import mongoose from "mongoose";
import { Password } from "../utils/index.js";

const EmployerSchema = new mongoose.Schema({
    email: { type: String, required: false, index: true, unique: true },
    phone:{type:Number, required:false},
    name:{type:String, required:false},
    isDeleted:{type:Boolean, default:false},
    password: { type: String, required: false },
    profilePicture: { type: Object, required: false },
   
    
    
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
}
);

EmployerSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

EmployerSchema.set("timestamps", true);

EmployerSchema.statics.build = (attrs) => {
    return new Employer(attrs);
};

const Employer = mongoose.model(
    "Employer",
    EmployerSchema
);

export { Employer, EmployerSchema};
