import { Request } from "express";
import { InjectRepo } from "../utils/InjectRepo";
import { Like } from "../entity/Like";
import { Post } from "../entity/Post";
import { Comment } from "../entity/Comment";
import { Repository } from "typeorm";
import {User} from "../entity/User";

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
	@InjectRepo(User)
	private static userRepository: Repository<User>;

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

	// elementType can be "comment" or "post"
	static async isLiked(request: Request, elementType: String) {
		let response: responseDefinition = {
			status: 200,
			data: {data: false}
		}

		let userId = request.params.user;
		let elementId = request.params.element;
	
		try {
			if (elementType == "post") {
				const user = await LikeServices.userRepository.findOneOrFail(
						userId, 
						{relations: ["likes", "likes.post"]}
					);

				const post = await LikeServices.postRepository.findOneOrFail(elementId);
				for (let i = 0; i < user.likes.length; i++) {
					if (user.likes[i].comment != null && post.id == user.likes[i].post.id) {
						response.status = 200;
						response.data = {data: true};
					}
				}
			}

			if (elementType == "comment") {
				const user = await LikeServices.userRepository.findOneOrFail(
						userId, 
						{relations: ["likes", "likes.comment"]}
					);

				const comment = await LikeServices.commentRepository.findOneOrFail(elementId);
				for (let i = 0; i < user.likes.length; i++) {
					if (user.likes[i].comment != null && comment.id == user.likes[i].comment.id) {
						response.status = 200;
						response.data = {data: true};
					}
				}
			}
		} catch (e) {
			response.data = {data: false};
			console.log(e);
		}

		return response;
	}
}

export default LikeServices;
