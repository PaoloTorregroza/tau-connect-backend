import "reflect-metadata";
import config from '../ormconfig';
import {createConnection, ConnectionOptions} from "typeorm";
import express from "express";
import * as bodyParser from "body-parser";
import routes from "./routes/routes";
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';

const getOptions = () => {
    let connectionOptions: ConnectionOptions;
    connectionOptions = {
        type: 'postgres',
        synchronize: true,
        logging: false,
        extra: {
          ssl: true,
        },
        entities: [
          path.join(__dirname, "src/entity/**/*.{ts,js}")
       ],
    };
    if (process.env.DATABASE_URL) {
        Object.assign(connectionOptions, { url: process.env.DATABASE_URL });
    } else {
        // gets your default configuration
        // you could get a specific config by name getConnectionOptions('production')
        // or getConnectionOptions(process.env.NODE_ENV)
        connectionOptions = <ConnectionOptions>config;
    }
    return connectionOptions;
}

let ormconfig = getOptions();
const init = createConnection(ormconfig).then( async () => {
    try {
        const app = express();
        // create express app
        app.use(bodyParser.json());
        app.use(cors());
        app.use(helmet());
        app.use(morgan("common"));

        // register express routes from defined application routes
        app.use("/", routes);
        const server = app.listen(process.env.PORT || 3000);

        console.log("Express server has started on port 3000.");

        return {app, server};
    } catch (e) {
        console.log(e);
    }
});


// For testing
export default init;
