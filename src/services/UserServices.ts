import {User} from '../entity/User';
import {Request} from 'express';
import {decodeJwt} from '../utils/decodeJwt';
import { InjectRepo } from '../utils/InjectRepo';
import { Repository } from 'typeorm';

interface responseDefinition {
	status: number;
	data: {
		msg?: string;
		data?: User;
	}
}

class UserServices {
    @InjectRepo(User)
    private static userRepository: Repository<User>;

    static async follow(request: Request) {
        let response: responseDefinition = {
            status: 400,
            data: {}
        }
        const followerId = decodeJwt(<string>request.headers.authorization).id;

        let user: User;
        let follower: User;
        try {
            follower = await UserServices.userRepository.findOne(followerId);
            user = await UserServices.userRepository.findOne(request.body.userId);
        } catch (e) {
            response.data = {msg: "Invalid ID"};
            return response;
        }

        if (!user.followers) user.followers = [];
        
        user.followers.push(follower);
        
        const results = await UserServices.userRepository.save(user);
        response.status = 200;
        response.data = {data: results};
        return response;
    }
}

export default UserServices;