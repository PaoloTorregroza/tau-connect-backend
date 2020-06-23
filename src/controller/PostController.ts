import {Request, Response, NextFunction} from "express";
import {getRepository, Repository} from "typeorm";
import {Post} from "../entity/Post";
import {decodeJwt} from "../services/decodeJwt";
import {User} from "../entity/User";
import {Like} from "../entity/Like";
import {InjectRepo} from '../services/InjectRepo';

class PostController {
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;
    @InjectRepo(User)
    private static userRepository: Repository<User>;
    @InjectRepo(Like)
    private static likeRepository: Repository<Like>;

    static all = async (request: Request, response: Response, next: NextFunction) => {
        const results = await PostController.postRepository.find();
        response.send(results);
    }

    static one = async (request: Request, response: Response, next: NextFunction) => {
        const results = await PostController.postRepository.findOne(request.params.id);
        response.send(results);
    }

    static save = async (request: Request, response: Response, next: NextFunction) => {
        const results = await PostController.postRepository.save(request.body);
        response.send(results);
    }

    static remove = async (request: Request, response: Response, next: NextFunction) => {
        const postToRemove = await PostController.postRepository.findOne(request.params.id);
        const token = decodeJwt(<string>request.headers["auth"]);
        const user = await PostController.userRepository.findOne(token.id);

        if (user.id != postToRemove.user.id) {
            response.status(401).send();
        } else {
            await PostController.postRepository.remove(postToRemove);
            response.send("Post removed");
        }
    }

    static like = async (request: Request, response: Response, next: NextFunction) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const userId = token.id;

        let like = new Like();
        const post = await PostController.postRepository.findOne(request.params.id);
        const user = await PostController.userRepository.findOne(userId);

        like.user = user;
        like.post = post;
        
        const results = await PostController.likeRepository.save(like);
        response.send(results)
    }
}

export default PostController;
