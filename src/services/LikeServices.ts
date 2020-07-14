import { Request } from "express";
import { InjectRepo } from "../utils/InjectRepo";
import { Like } from "../entity/Like";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";
import { Repository } from "typeorm";

interface responseDefinition {
    status: number,
    data: {
        msg?: string,
        data? 
    }
}

class LikeServices {
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;
    @InjectRepo(Comment)
    private static commentRepository: Repository<Comment>;

    static async getCommentLikes (request: Request) {
        let response: responseDefinition = {
            status: 500,
            data: {}
        }
        const commentId = request.params.id;

        try {
            const results = await LikeServices.commentRepository.findOneOrFail(
                commentId, 
                {relations: ["likes"]
            });
            response.status = 200;
            response.data = {data: results.likes};
        } catch (e) {
            response.data = {msg: "Error getting likes"};
        }

        return response;
    }

    static async getPostLikes (request: Request) {
        let response: responseDefinition = {
            status: 500,
            data: {}
        }
        const postId = request.params.id;

        try {
            const results = await LikeServices.postRepository.findOneOrFail(
                postId, 
                {relations: ["likes"]
            });
            response.status = 200;
            response.data = {data: results.likes};
        } catch (e) {
            console.log(e);
            response.data = {msg: "Error getting likes"};
        }

        return response;
    }
}

export default LikeServices;