import {Repository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import {InjectRepo} from '../utils/InjectRepo';
import UserServices from "../services/UserServices";

class UserController {

    @InjectRepo(User)
    private static userRepository: Repository<User>;

    static all = async(request: Request, response: Response) => {
        const results = await UserController.userRepository.find();
        results.forEach(e => delete e.password);
        response.send({data: results});
    }

    static one = async (request: Request, response: Response) => {
        const responseData = await UserServices.one(request);
        response.status(responseData.status).send(responseData.data);
    }

	static followers = async (request: Request, response: Response) => {
		const responseData = await  UserServices.one(request, ["followers"]);
		response.status(responseData.status).send(responseData.data);
	}

    static remove = async (request: Request, response: Response) => {
		const responseData = await UserServices.delete(request);
		response.status(responseData.status).send(responseData.data);
    }

    static update = async (request: Request, response: Response) => {
        const responseData = await UserServices.update(request);
        response.status(responseData.status).send(responseData.data);
    }

    static follow = async (request: Request, response: Response) => {
        const responseData = await UserServices.follow(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default UserController;
