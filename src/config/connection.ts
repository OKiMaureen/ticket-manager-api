import dotenv from "dotenv";
import {createConnection} from "typeorm";
import User from "../entity/User";
import Story from "../entity/Story";

dotenv.config();
export const connection = createConnection({
    type: "postgres", 
    host: "localhost",
    port:  5432,
    database: process.env.DATABASE, 
    username: process.env.USERNAME, 
    entities: [
        User, // User entity class
        Story      // Story entity class
    ],
    synchronize: true,
    logging: false
});