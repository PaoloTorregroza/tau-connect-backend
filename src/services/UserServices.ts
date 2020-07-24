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

	static async delete(request: Request) {
		let response: responseDefinition = {
			status: 401,
			data: {}
		}

		const userId = request.params.id;
		const requestId = decodeJwt(<string>request.headers.authorization).id;
		if (userId != requestId) {
			response.data = {msg: "You can't delete other users"}
		} else {
			await UserServices.userRepository.delete(userId);
			response.status = 200;
			response.data = {msg: "User deleted"}
		}
		return response;
	}

	static async update(request: Request) {
        let response: responseDefinition = {
            status: 401,
            data: {}
        }

        const userId = decodeJwt(<string>request.headers.authorization).id
        if (userId != request.params.id) {
            response.data = {msg: "You can't change other users data"};
            return response;
        }
        try {
            await UserServices.userRepository.update(request.params.id, request.body);
            const results = await UserServices.userRepository.findOneOrFail(request.params.id);
            delete results.password;
            response.status = 200;
            response.data = {msg: "User updated", data: results};
        } catch(e) {
            response.status = 500;
            response.data = {msg: "Error updating user, maybe username or email is already in use"};
        }
        return response;
    }

    static async follow(request: Request) {
		let response: responseDefinition = {
            status: 400,
            data: {}
        }
        const followerId = decodeJwt(<string>request.headers.authorization).id;

        let user: User;
        let follower: User;
        try {
            follower = await UserServices.userRepository.findOne(followerId, {relations: ["followers"]});
            user = await UserServices.userRepository.findOne(request.body.userId, {relations: ["followers"]});
        } catch (e) {
            response.data = {msg: "Invalid ID"};
            return response;
        }
        if (!user.followers) user.followers = [];
        
        const alreadyFollowed = user.followers.some(user => user.id === follower.id);
        if (!alreadyFollowed) {
            user.followers.push(follower);
   
            const results = await UserServices.userRepository.save(user);
            delete results.password
            results.followers.forEach(e => delete e.password);
            response.status = 200;
            response.data = {data: results, msg: "User followed"};
            return response;
        } else {
            const followerIndex = user.followers.findIndex(user => user.id === follower.id);
            user.followers.splice(followerIndex, 1);

            const results = await UserServices.userRepository.save(user);
            delete results.password
            results.followers.forEach(e => delete e.password);
            response.status = 200;
            response.data = {data: results, msg: "Follower removed"}
            return response;
        }
    }
}

export default UserServices;
