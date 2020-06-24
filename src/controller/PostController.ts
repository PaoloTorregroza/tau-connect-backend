import {Request, Response, NextFunction} from "express";
import {Repository} from "typeorm";
import {Post} from "../entity/Post";
import {decodeJwt} from "../services/decodeJwt";
import {User} from "../entity/User";
import {Like} from "../entity/Like";
import {Comment} from '../entity/Comment';
import {InjectRepo} from '../services/InjectRepo';

class PostController {
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;
    @InjectRepo(User)
    private static userRepository: Repository<User>;
    @InjectRepo(Like)
    private static likeRepository: Repository<Like>;
    @InjectRepo(Comment)
    private static commentRepository: Repository<Comment>;

    static all = async (request: Request, response: Response, next: NextFunction) => {
        const results = await PostController.postRepository.find();
        response.send(results);
    }

    static one = async (request: Request, response: Response, next: NextFunction) => {
        const results = await PostController.postRepository.findOne(request.params.id);
        response.send(results);
    }

    static save = async (request: Request, response: Response, next: NextFunction) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const post = new Post();
        const user = await PostController.userRepository.findOne(token.id);

        post.body = request.body.body;
        post.comments = [];
        post.created_at = new Date();
        post.likes = [];
        post.user = user;

        const results = await PostController.postRepository.save(post);
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

        const like = new Like();
        const post = await PostController.postRepository.findOne(request.params.id);
        const user = await PostController.userRepository.findOne(userId);

        like.user = user;
        like.post = post;

        // Check if it is already liked
        let results: Like;
        const oldLike = await PostController.likeRepository.findOne({user: like.user, post: like.post});

        // Delete it if exists and create it if not.
        if (oldLike){
            results = await PostController.likeRepository.remove(oldLike);
            response.status(200).send("Like removed");
        } else {
            results = await PostController.likeRepository.save(like);
            response.send(results);
        }
    }

    static comment = async (request: Request, response: Response, next: NextFunction) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const userId = token.id;

        const comment = new Comment();
        const post = await PostController.postRepository.findOne(request.params.id);
        const user = await PostController.userRepository.findOne(userId);

        comment.user = user;
        comment.body = request.body.body;
        comment.created_at = new Date()
        comment.post = post;

        const results = await PostController.commentRepository.save(comment);
        response.send(results);
    }

    static getComments = async (request: Request, response: Response, next: NextFunction) => {
        const post = await PostController.postRepository.findOne(request.params.id);
        const comments = await PostController.commentRepository.find({post: post});

        response.send(comments);
    }
}

export default PostController;
