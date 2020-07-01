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

    static all = async (request: Request, response: Response) => {
        const results = await PostController.postRepository.find();
        response.send(results);
    }

    static one = async (request: Request, response: Response) => {
        try {
            const results = await PostController.postRepository.findOne(request.params.id);
            response.send(results);
        } catch (e) {
            response.status(400).send("Invalid ID");
            return;
        }
    }

    static save = async (request: Request, response: Response) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const post = new Post();
        let user: User;
        try {
            if (!request.body.body || typeof request.body.body != "string" ) {
                throw new Error("Invalid data");
            }
            user = await PostController.userRepository.findOne(token.id);
        } catch (e) {
            response.status(400).send("Invalid body or user not exists");
        }

        post.body = request.body.body;
        post.comments = [];
        post.created_at = new Date();
        post.likes = [];
        post.user = user;

        const results = await PostController.postRepository.save(post);
        response.send(results);
    }

    static remove = async (request: Request, response: Response) => {
        let postToRemove: Post;
        let user: User;
        let token: any;

        try {
            postToRemove = await PostController.postRepository.findOne(request.params.id);
            token = decodeJwt(<string>request.headers["auth"]);
            user = await PostController.userRepository.findOne(token.id);
        } catch (e) {
            response.status(400).send("Invalid data");
        }

        if (user.id != postToRemove.user.id) {
            response.status(401).send("You can't remove other people posts");
        } else {
            await PostController.postRepository.remove(postToRemove);
            response.send("Post removed");
        }
    }

    static like = async (request: Request, response: Response) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const userId = token.id;

        let post: Post;
        let user: User;

        const like = new Like();
        try {
            post = await PostController.postRepository.findOne(request.params.id);
            user = await PostController.userRepository.findOne(userId);
        } catch (e) {
            response.status(400).send("Invalid data");
        }
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

    static comment = async (request: Request, response: Response) => {
        const token = decodeJwt(<string>request.headers["auth"]);
        const userId = token.id;

        const comment = new Comment();
        let post: Post;
        let user: User;
        try {
            post = await PostController.postRepository.findOne(request.params.id);
            user = await PostController.userRepository.findOne(userId);
            if (!request.body.body || typeof request.body.body != "string") {
                throw new Error("Invalid body");
            }
        } catch (e) {
            response.status(400).send("Invalid data");
        }

        comment.user = user;
        comment.body = request.body.body;
        comment.created_at = new Date()
        comment.post = post;

        const results = await PostController.commentRepository.save(comment);
        response.send(results);
    }

    static getComments = async (request: Request, response: Response) => {
        try {
            const post = await PostController.postRepository.findOne(request.params.id);
            const comments = await PostController.commentRepository.find({post: post}); 
            response.send(comments);
        } catch (e) {
            response.status(400).send("Invalid data");
        }
    }
}

export default PostController;
