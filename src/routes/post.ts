import {Router} from 'express';
import PostController from '../controller/PostController';
import {checkJwt} from '../middlewares/checkJwt';

const router = Router();

router.get("/", PostController.all);
router.delete("/:id", [checkJwt], PostController.remove);
router.post("/", PostController.save);
router.get("/:id", PostController.one);
router.post("/like/:id", [checkJwt], PostController.like);

export default router;
