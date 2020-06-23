import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {decodeJwt} from '../services/decodeJwt';

class UserController {

    static all = async(request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        const results = await userRepository.find();
        response.send(results);
    }

    static one = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        const results = await userRepository.findOne(request.params.id); 
        response.send(results);
    }

    static save = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        const results = await userRepository.save(request.body);
        response.send(results);
    }

    static remove = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        let userToRemove = await userRepository.findOne(request.params.id);
        await userRepository.remove(userToRemove);
        response.send("User removed");
    }

    static follow = async (request: Request, response: Response, next: NextFunction) => {
        const userRepository = getRepository(User);
        const followerId = decodeJwt(<string>request.headers["auth"]).id;

        const follower = await userRepository.findOne(followerId);
        const user = await userRepository.findOne(request.body.userId);

        if (!user.followers) user.followers = [];
        
        user.followers.push(follower);
        
        const results = await userRepository.save(user);
        response.send(results);
    }
}

export default UserController;
