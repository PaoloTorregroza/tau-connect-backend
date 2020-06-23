import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import routes from "./routes/routes";
import {User} from "./entity/User";
import * as cors from 'cors';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors());

    // register express routes from defined application routes
    app.use("/", routes);

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");

    // Test data
    //const user = await connection.manager.save(connection.manager.create(User, {
    //    name: "Timber",
    //    email: "i@admin.com",
    //    activated: true,
    //    password: "123456",
    //    register_at: new Date()
    //}));

    // The user Paolo is followed by Timber
    //                userId_1               |               userId_2               
    //--------------------------------------+--------------------------------------
    //d112db84-511d-49b2-a826-61d7ec245949 | dab848d7-55af-4b8e-a239-3af7ec65d4a1
    // 
    // userId_1 is the followed and 2 is the follower
    //await connection.manager.save(connection.manager.create(User, {
    //   name: "Paolo",
    //    email: "ii@admin.com",
    //    activated: true,
    //    password: "123456",
    //    register_at: new Date(),
    //    followers: [user] // Array of followers
    //}));


}).catch(error => console.log(error));
