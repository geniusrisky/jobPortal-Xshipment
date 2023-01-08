import { JwtVerify } from "../../index.js";
import dotenv from "dotenv";
import process from "node:process"
dotenv.config({ silent: process.env });

export default new JwtVerify(process.env.jwtKey);