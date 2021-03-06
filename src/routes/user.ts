import {Router} from 'express';
import {checkJwt} from '../middlewares/checkJwt';
import UserController from '../controller/UserController';

const router = Router();

router.get("/", UserController.all);
router.get("/:id", [checkJwt], UserController.one);
router.get("/followers/:id", UserController.followers);
router.delete("/:id", [checkJwt], UserController.remove);
router.put("/follow", [checkJwt], UserController.follow);
router.put("/:id", [checkJwt], UserController.update);

export default router;
