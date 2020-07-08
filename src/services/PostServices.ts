import { Repository } from "typeorm";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { Like } from "../entity/Like";
import { Comment } from "../entity/Comment";
import { InjectRepo } from "../utils/InjectRepo";
import { Request } from "express";
import { decodeJwt } from "../utils/decodeJwt";

interface responseDefinition {
    status: number;
    data: {
        msg?: string;
        data?: Post | Like | Comment | Comment[];
    }
}

class PostServices {
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;
    @InjectRepo(User)
    private static userRepository: Repository<User>;
    @InjectRepo(Like)
    private static likeRepository: Repository<Like>;
    @InjectRepo(Comment)
    private static commentRepository: Repository<Comment>;

    static async save(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        const token = decodeJwt(<string>request.headers.authorization);
        const post = new Post();
        let user: User;
        try {
            if (!request.body.body || typeof request.body.body != "string" ) {
                throw new Error("Invalid data");
            }
            user = await PostServices.userRepository.findOne(token.id);
        } catch (e) {
            response.data = {msg: "Invalid body or user not exists"};
            return response;
        }

        post.body = request.body.body;
        post.comments = [];
        post.created_at = new Date();
        post.likes = [];
        post.user = user;

        const results = await PostServices.postRepository.save(post);
        response.data = {data: results};
        response.status = 200;
        return response;
    }

    static async remove(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        let postToRemove: Post;
        let user: User;
        let token: any;

        try {
            postToRemove = await PostServices.postRepository.findOne(request.params.id);
            token = decodeJwt(<string>request.headers.authorization);
            user = await PostServices.userRepository.findOne(token.id);
        } catch (e) {
            response.data = {msg: "Invalid data"};
            return response;
        }

        if (user.id != postToRemove.user.id) {
            response.status = 401;
            response.data = {msg: "You can't remove other people posts"};
            return response;
        } else {
            await PostServices.postRepository.remove(postToRemove);
            response.status = 200;
            response.data = {msg: "Post removed"};
            return response;
        }
    }

    static async like(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        const token = decodeJwt(<string>request.headers.authorization);
        const userId = token.id;

        let post: Post;
        let user: User;

        const like = new Like();
        try {
            post = await PostServices.postRepository.findOne(request.params.id);
            user = await PostServices.userRepository.findOne(userId);
        } catch (e) {
            response.data = {msg: "Invalid data"};
            return response;
        }
        like.user = user;
        like.post = post;

        // Check if it is already liked
        let results: Like;
        const oldLike = await PostServices.likeRepository.findOne({user: like.user, post: like.post});

        // Delete it if exists and create it if not.
        if (oldLike){
            await PostServices.likeRepository.remove(oldLike);
            response.status = 200;
            response.data = {msg: "Like removed"};
            return response;
        } else {
            results = await PostServices.likeRepository.save(like);
            response.status = 200;
            response.data = {data: results};
        }
    }

    static async comment(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        const token = decodeJwt(<string>request.headers.authorization);
        const userId = token.id;

        const comment = new Comment();
        let post: Post;
        let user: User;
        try {
            post = await PostServices.postRepository.findOne(request.params.id);
            user = await PostServices.userRepository.findOne(userId);
            if (!request.body.body || typeof request.body.body != "string") {
                throw new Error("Invalid body");
            }
        } catch (e) {
            response.data = {msg: "Invalid data"};
            return response;
        }

        comment.user = user;
        comment.body = request.body.body;
        comment.created_at = new Date()
        comment.post = post;

        const results = await PostServices.commentRepository.save(comment);
        response.status = 200;
        response.data = {data: results};
        return response;
    }

    static async getComments(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        try {
            const post = await PostServices.postRepository.findOne(request.params.id);
            const comments = await PostServices.commentRepository.find({post: post}); 
            response.status = 200;
            response.data = {data: comments};
            return response;
        } catch (e) {
            response.data = {msg: "Invalid data"}
            return response;
        }
    }
}

export default PostServices;