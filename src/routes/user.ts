import {Router} from 'express';
import {checkJwt} from '../middlewares/checkJwt';
import UserController from '../controller/UserController';

const router = Router();

router.get("/", [checkJwt], UserController.all);
router.get("/:id", [checkJwt], UserController.one);
router.delete("/:id", [checkJwt], UserController.remove);
router.put("/follow", [checkJwt], UserController.follow);

export default router;
