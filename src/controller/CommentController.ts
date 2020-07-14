import { Request, Response } from "express";
import { Repository } from "typeorm";
import CommentServices from '../services/CommentServices';
import { InjectRepo } from "../utils/InjectRepo";
import { Comment } from "../entity/Comment";


class CommentController {
    @InjectRepo(Comment)
    private static commentRepository: Repository<Comment>;

    static one = async (request: Request, response: Response) => {
        try {
            const result = await CommentController.commentRepository.findOne(request.params.id, {relations: ["user"]});
            delete result.user.password;
            response.status(200).send({data: result});
        } catch (e) {
            response.status(404).send({msg: "Not found"});
        }
    }

    static save = async (request: Request, response: Response) => {
        const responseData = await CommentServices.save(request);
        response.status(responseData.status).send(responseData.data);
    }

    static delete = async (request: Request, response: Response) => {
        const responseData = await CommentServices.remove(request);
        response.status(responseData.status).send(responseData.data);
    }

    static like = async (request: Request, response: Response) => {
        const responseData = await CommentServices.like(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default CommentController;