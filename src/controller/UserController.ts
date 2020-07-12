import {Repository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {InjectRepo} from '../utils/InjectRepo';
import UserServices from "../services/UserServices";

class UserController {

    @InjectRepo(User)
    private static userRepository: Repository<User>;

    static all = async(request: Request, response: Response) => {
        const results = await UserController.userRepository.find();
        results.forEach(e => delete e.password);
        response.send(results);
    }

    static one = async (request: Request, response: Response) => {
        try {
            const results = await UserController.userRepository.findOne(request.params.id);
            if (results == undefined) throw new Error("NoResults");
            delete results.password;
            response.send(results);        
        } catch (e) {
            if (e.message == "NoResults") {
                response.status(404).send({msg: "User don't exists"});
            } else {
                response.status(400).send({msg: "Invalid ID"});
            }
        }
    }

    static remove = async (request: Request, response: Response) => {
        try {
            let userToRemove = await UserController.userRepository.findOne(request.params.id);
            await UserController.userRepository.remove(userToRemove);
            response.send({msg: "User removed"});
        } catch (e) {
            console.log(e);
            response.status(400).send({msg: "Invalid ID"});
        }
    }

    static update = async (request: Request, response: Response) => {
        const responseData = await UserServices.update(request);
        response.status(responseData.status).send(responseData.data);
    }

    static follow = async (request: Request, response: Response) => {
        const responseData = await UserServices.follow(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default UserController;
