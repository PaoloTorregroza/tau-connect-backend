import { Request, Response } from "express";
import LikeServices from '../services/LikeServices';

class LikeController {
    static getCommentLikes = async (request: Request, response: Response) => {
        const responseData = await LikeServices.getCommentLikes(request);
        response.status(responseData.status).send(responseData.data);
    }

    static getPostLikes = async (request: Request, response: Response) => {
        const responseData = await LikeServices.getPostLikes(request);
        response.status(responseData.status).send(responseData.data);
    }

	static isPostLiked = async (request: Request, response: Response) => {
		const responseData = await LikeServices.isLiked(request, "post");
		response.status(responseData.status).send(responseData.data);
	}

	static isCommentLiked = async (request: Request, response: Response) => {
		const responseData = await LikeServices.isLiked(request, "comment")
		response.status(responseData.status).send(responseData.data);
	}
}

export default LikeController;
