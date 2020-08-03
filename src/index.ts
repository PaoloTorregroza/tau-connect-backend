import "reflect-metadata";
import {createConnection} from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes/routes";
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import helmet from 'helmet';

const init = createConnection().then( async () => {
    try {
        const app = express();
        // create express app
        app.use(bodyParser.json());
        app.use(cors());
        app.use(helmet());
        
        if (process.env.NODE_ENV == "production") {
            const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs/access.log"));
            app.use(morgan("common", {stream: accessLogStream}))
        } else {
            app.use(morgan("common"));
        }

        // register express routes from defined application routes
        app.use("/", routes);
        const server = app.listen(3000);

        console.log("Express server has started on port 3000.");

        return {app, server};
    } catch (e) {
        console.log(e);
    }
});

// For testing
export default init;
