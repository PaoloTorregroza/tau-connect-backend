import { InjectRepo } from "../utils/InjectRepo";
import { Comment } from "../entity/Comment";
import { Repository } from "typeorm";
import { Request } from "express";
import { decodeJwt } from "../utils/decodeJwt";
import { User } from "../entity/User";
import { Post } from "../entity/Post";
import { Like } from "../entity/Like";

class CommentServices {
    @InjectRepo(Comment)
    private static commentRepository: Repository<Comment>;
    @InjectRepo(User)
    private static userRepository: Repository<User>;
    @InjectRepo(Post)
    private static postRepository: Repository<Post>;
    @InjectRepo(Like)
    private static likeRepository: Repository<Like>;

    static async save(request: Request) {
        let response: responseDefinition = {
            status: 500,
            data: {}
        }

        const token = decodeJwt(<string>request.headers.authorization);
        const userId = token.id;
        const postId = request.params.id;

        try {
            const comment = new Comment();
            comment.body = request.body.body;
            comment.post = await CommentServices.postRepository.findOneOrFail(postId);
            comment.user = await CommentServices.userRepository.findOneOrFail(userId);
            
            const results = await CommentServices.commentRepository.save(comment);

            delete comment.user.password;
            response.data = {data: results};
            response.status = 200;
        } catch (e) {
            response.data = {msg: "Error commenting"};
            console.log(e);
        }
        return response;
    }

    static async remove(request: Request) {
        let response: responseDefinition = {
            status: 500,
            data: {}
        }
        try {
            const token = decodeJwt(<string>request.headers.authorization);
            const userId = token.id;
            const comment = await CommentServices
                .commentRepository.findOne(
                        request.params.id,
                        {relations: ["user"]}
                    );

            if (userId != comment.user.id) {
                response.status = 401;
                response.data = {msg: "You can't remove other people comments"}
            } else {
                await CommentServices.commentRepository.remove(comment);
                response.status = 200;
                response.data = {msg: "Comment removed"};
            }
        } catch (e) {
            response.data = {msg: "Error deleting comment"};
            console.log(e);
        }
        return response;
    }

    static async like(request: Request) {
        let response: responseDefinition = {
            status: 500,
            data: {}
        }

        const token = decodeJwt(<string>request.headers.authorization);
        const userId = token.id;
        const commentId = request.params.id;
        const like = new Like();

        try {
            like.user = await CommentServices.userRepository.findOneOrFail(userId);
            like.comment = await CommentServices.commentRepository.findOneOrFail(commentId);
            let oldLike = await CommentServices.likeRepository.findOne({user: like.user, comment: like.comment})

            if (!oldLike) {
                const results = await CommentServices.likeRepository.save(like);
                delete results.user.password;
                response.status = 200;
                response.data = {data: results};
            } else {
                await CommentServices.likeRepository.remove(oldLike);
                response.status = 200;
                response.data = {msg: "Like removed"};
            }
        } catch (e) {
            response.data = {msg: "Error whit the like"};
        }
        return response;
    }
}

export default CommentServices;
