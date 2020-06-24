import {Repository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import {decodeJwt} from '../services/decodeJwt';
import {InjectRepo} from '../services/InjectRepo';

class UserController {

    @InjectRepo(User)
    private static userRepository: Repository<User>;

    static all = async(request: Request, response: Response, next: NextFunction) => {
        const results = await UserController.userRepository.find();
        response.send(results);
    }

    static one = async (request: Request, response: Response, next: NextFunction) => {
        const results = await UserController.userRepository.findOne(request.params.id); 
        response.send(results);
    }

    static save = async (request: Request, response: Response, next: NextFunction) => {
        const results = await UserController.userRepository.save(request.body);
        response.send(results);
    }

    static remove = async (request: Request, response: Response, next: NextFunction) => {
        let userToRemove = await UserController.userRepository.findOne(request.params.id);
        await UserController.userRepository.remove(userToRemove);
        response.send("User removed");
    }

    static follow = async (request: Request, response: Response, next: NextFunction) => {
        const followerId = decodeJwt(<string>request.headers["auth"]).id;

        const follower = await UserController.userRepository.findOne(followerId);
        const user = await UserController.userRepository.findOne(request.body.userId);

        if (!user.followers) user.followers = [];
        
        user.followers.push(follower);
        
        const results = await UserController.userRepository.save(user);
        response.send(results);
    }
}

export default UserController;
