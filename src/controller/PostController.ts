import {Request, Response} from "express";
import {Repository} from "typeorm";
import {Post} from "../entity/Post";
import {InjectRepo} from '../utils/InjectRepo';
import PostServices from "../services/PostServices";

class PostController {
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;

    static all = async (request: Request, response: Response) => {
        const responseData = await PostServices.all(request);
        response.status(responseData.status).send(responseData.data);
    }

    static one = async (request: Request, response: Response) => {
        const responseData = await PostServices.one(request);
        response.status(responseData.status).send(responseData.data);
    }

    static save = async (request: Request, response: Response) => {
        const responseData = await PostServices.save(request);
        response.status(responseData.status).send(responseData.data);
    }

    static remove = async (request: Request, response: Response) => {
        const responseData = await PostServices.remove(request);
        response.status(responseData.status).send(responseData.data);
    }

    static like = async (request: Request, response: Response) => {
        const responseData = await PostServices.like(request);
        response.status(responseData.status).send(responseData.data);
    }

    static getComments = async (request: Request, response: Response) => {
        const responseData = await PostServices.getComments(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default PostController;
