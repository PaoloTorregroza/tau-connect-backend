import {Request} from "express";
import {sign} from 'jsonwebtoken';
import {getRepository} from 'typeorm';
import config from '../config/config';
import {decodeJwt} from '../utils/decodeJwt';
import {hashSync} from 'bcrypt';
import {User} from '../entity/User';

interface responseDefinition {
	status: number;
	data: {
		token?: string; 
		msg?: string;
		data?: User;
	}
}

class AuthServices {
	static async login(request: Request) {
		let response: responseDefinition = {
			status: 400,
			data: {}
		};
		// Check if email and password are set
        let {email, password} = request.body;
        if (!(email && password)) {
			response.data = {msg: "Email or password not provided"};
        	return response;
		}

        // Get user from database
        const userRepository = getRepository(User);
        let user: User | undefined = undefined;
        try {
            user = await userRepository.findOneOrFail({where: {email}});
        } catch (e) {
			response.status = 401;
			response.data = {msg: "User not found"};
			return response;
        }

        // Check if encrypted password match
        if (user != undefined && !user.checkUnencryptedPassword(password)) {
        	response.status = 401;
			response.data = {msg: "Passwords don't match"};
			return response
        }

        // Sing JWT, valid for 6 hours
        if (user != undefined) {
            const token = sign(
                {id: user.id, email: user.email},
                config.jwtSecret, 
                {expiresIn: "6h"}
            );

			delete user.password;
			response.status = 200;
			response.data = {
				token: token,
				data: user
			};

			return response;
        }		
	}

	static async register(request: Request) {
		let response: responseDefinition = {
			status: 400,
			data: {}
		};

		let {name, username, password, email} = request.body;
        if (!(name && username && password && email)) {
			response.data = {msg: "Data not provided"}
			return response;
		}

        const userRepository = getRepository(User);
        const newUser = new User();
        newUser.name = name;
		newUser.username = username;
        newUser.password = password;
        newUser.email = email;
        newUser.register_at = new Date();
        newUser.activated = true;  // [TODO] Make email acount verification
		
		let results: User;
		try {
        	const user = userRepository.create(newUser);
        	results = await userRepository.save(user);
		} catch (e) {
			response.data = {msg: "Error creating user, email already exists"};
			return response;
		}
		delete results.password;
		response.status = 200;
		response.data = {data: results};
		return response;
	}

	static async changePassword(request: Request) {
		let response: responseDefinition = {
			status: 400,
			data: {}
		}
        const token = decodeJwt(<string>request.headers.authorization);
        const id = token.id;

        const {oldPassword, newPassword} = request.body;
        if (!(oldPassword && newPassword)) {
			response.data = {msg: "Passwords not provided"};
			return response;
        }

        const userRepository = getRepository(User);
        let user: User | undefined = undefined;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch(e) {
			response.status = 404;
			response.data = {msg: "User not found"};
            return response;
        }

        if (!user.checkUnencryptedPassword(oldPassword)) {
			response.status = 401;
			response.data = {msg: "Password don't match"};
            return response;
        }

        user.password = hashSync(newPassword, config.saltRounds);
		await userRepository.save(user);
		
		response.status = 200;
		response.data = {msg: "Password changed"};
		return response
	}
}

export default AuthServices;
