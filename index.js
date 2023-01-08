import dotenv from "dotenv";
import process from "node:process"
import App from "./app.js";

dotenv.config({ silent: process.env });
process.stdout.write("\n*******************************************************************************************************************************\n");
process.stdout.write(
    `\n Starting Service:: ${process.env.name} at ${new Date()} \n` 
);

process.stdout.write("\n*******************************************************************************************************************************\n");

const app = new App(process.env.port);

app.listen();