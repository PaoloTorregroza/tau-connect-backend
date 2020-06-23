import {Router} from 'express';
import user from './user';
import auth from './auth';
import post from './post';

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/posts", post);

export default routes;
