import {Repository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {decodeJwt} from '../services/decodeJwt';
import {InjectRepo} from '../services/InjectRepo';

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
            response.send("Invalid ID");
        }
    }

    static save = async (request: Request, response: Response) => {
        try {
            const results = await UserController.userRepository.save(request.body);
            response.send(results);
        } catch (e) {
            response.send("Invalid data");
        }
    }

    static remove = async (request: Request, response: Response) => {
        try {
            let userToRemove = await UserController.userRepository.findOne(request.params.id);
            await UserController.userRepository.remove(userToRemove);
            response.send("User removed");
        } catch (e) {
            response.status(401).end("Invalid ID");
        }
    }

    static follow = async (request: Request, response: Response) => {
        const followerId = decodeJwt(<string>request.headers["auth"]).id;

        let user: User;
        let follower: User;
        try {
            follower = await UserController.userRepository.findOne(followerId);
            user = await UserController.userRepository.findOne(request.body.userId);
        } catch (e) {
            response.status(401).send("Invalid ID");
        }

        if (!user.followers) user.followers = [];
        
        user.followers.push(follower);
        
        const results = await UserController.userRepository.save(user);
        response.send(results);
    }
}

export default UserController;
