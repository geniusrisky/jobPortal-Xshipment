import mongoose from "mongoose";
import { Password } from "../utils/index.js";

const UserSchema = new mongoose.Schema({
    email: { type: String, required: false, index: true, unique: true },
   
    phone:{type:Number, required:false},
    name:{type:String, required:false},
    isDeleted:{type:Boolean, default:false},
    address:{type:Object, required:false},
    password: { type: String, required: false },
       

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

UserSchema.pre("save", async function (done) {
    if (this.isModified("password")) {
        const hashed = await Password.toHash(this.get("password"));
        this.set("password", hashed);
    }
    done();
});

UserSchema.set("timestamps", true);

UserSchema.statics.build = (attrs) => {
    return new User(attrs);
};

const User = mongoose.model(
    "User",
    UserSchema
);

export { User, UserSchema};
