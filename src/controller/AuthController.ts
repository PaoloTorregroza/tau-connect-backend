import {getRepository, QueryFailedError} from 'typeorm';
import {NextFunction, Request, Response, response} from 'express';
import {User} from '../entity/User';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import {decodeJwt} from '../services/decodeJwt';
import * as bcrypt from 'bcrypt';

class AuthController {
    static login = async (request: Request, response: Response) => {
        // Check if email and password are set
        let {email, password} = request.body;
        if (!(email && password)) {
            response.status(400).send();
        }

        // Get user from database
        const userRepository = getRepository(User);
        let user: User | undefined = undefined;
        try {
            user = await userRepository.findOneOrFail({where: {email}});
        } catch (e) {
            response.status(401).send();
        }

        // Check if encrypted password match
        if (user != undefined && !user.checkUnencryptedPassword(password)) {
            response.status(401).send();
            return;
        }

        // Sing JWT, valid for 6 hours
        if (user != undefined) {
            const token = jwt.sign(
                {id: user.id, email: user.email},
                config.jwtSecret, 
                {expiresIn: "6h"}
            );

            response.send(token);
        }
    }

    static register = async (request: Request, response: Response) => {
        let {name, password, email} = request.body;
        if (!(name && password && email)) {
            response.status(401).send();
        }

        const userRepository = getRepository(User);
        const newUser = new User();
        newUser.name = name;
        newUser.password = password;
        newUser.email = email;
        newUser.register_at = new Date();
        newUser.activated = true;  // [TODO] Make email acount verification
		
		let results: User;
		try {
        	const user = userRepository.create(newUser);
        	results = await userRepository.save(user);
		} catch (e) {
			response.status(400).send("Error creating user, email already exists")
		}
        response.send(results);
    }

    static changePassword = async (request: Request, response: Response) => {
        // Get ID from JWT 
        const token = decodeJwt(<string>request.headers["auth"]);
        const id = token.id;

        // Get parameters from the body
        const {oldPassword, newPassword} = request.body;
        if (!(oldPassword && newPassword)) {
            response.status(400).send();
        }

        // Get user from the database  
        const userRepository = getRepository(User);
        let user: User | undefined = undefined;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch(e) {
            response.status(401).send();
            return;
        }

        // Chech if the old passwords matchs
        if (!user.checkUnencryptedPassword(oldPassword)) {
            response.status(401).send();
            return;
        }

        user.password = bcrypt.hashSync(newPassword, config.saltRounds);
        await userRepository.save(user);

        response.status(204).send();
    }
}

export default AuthController;
