import {Request, Response} from 'express';
import AuthServices from '../services/AuthServices';

class AuthController {
    static login = async (request: Request, response: Response) => {
    	const responseData = await AuthServices.login(request);
		response.status(responseData.status).send(responseData.data);
    }

    static register = async (request: Request, response: Response) => {
        const responseData = await AuthServices.register(request);
        response.status(responseData.status).send(responseData.data);
    }

    static changePassword = async (request: Request, response: Response) => {
        const responseData = await AuthServices.changePassword(request);
        response.status(responseData.status).send(responseData.data);
    }
}

export default AuthController;
