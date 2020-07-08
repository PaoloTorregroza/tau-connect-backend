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
        response.send(results);
    }

    static one = async (request: Request, response: Response) => {
        try {
            const results = await UserController.userRepository.findOne(request.params.id); 
            response.send(results);        
        } catch (e) {
            response.send({msg: "Invalid ID"});
        }
    }

    static remove = async (request: Request, response: Response) => {
        try {
            let userToRemove = await UserController.userRepository.findOne(request.params.id);
            await UserController.userRepository.remove(userToRemove);
            response.send({msg: "User removed"});
        } catch (e) {
            response.status(400).end({msg: "Invalid ID"});
        }
    }

    static follow = async (request: Request, response: Response) => {
        const responseData = await UserServices.follow(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default UserController;
