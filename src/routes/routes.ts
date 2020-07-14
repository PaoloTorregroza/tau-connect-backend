import {Router} from 'express';
import user from './user';
import auth from './auth';
import post from './post';
import comment from './comment';
import like from './like';

const routes = Router();

routes.use("/auth", auth);
routes.use("/users", user);
routes.use("/posts", post);
routes.use("/comments", comment);
routes.use("/likes", like);

export default routes;
