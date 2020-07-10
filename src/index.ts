import "reflect-metadata";
import {createConnection, Server} from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes/routes";
import cors from 'cors';

const init = () => createConnection().then( async () => {
    const app = express();
    // create express app
    app.use(bodyParser.json());
    app.use(cors());

    // register express routes from defined application routes
    app.use("/", routes);
    app.listen(3000);

    console.log("Express server has started on port 3000.");

    return app;

}).catch(error => console.log(error));

init();

export default init;


