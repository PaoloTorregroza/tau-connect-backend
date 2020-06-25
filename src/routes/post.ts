import {Router} from 'express';
import PostController from '../controller/PostController';
import {checkJwt} from '../middlewares/checkJwt';

const router = Router();

router.get("/", PostController.all);
router.delete("/:id", [checkJwt], PostController.remove);
router.post("/", [checkJwt], PostController.save);
router.get("/:id", PostController.one);
router.put("/like/:id", [checkJwt], PostController.like);
router.put("/comment/:id", [checkJwt], PostController.comment);
router.get("/comments/:id", PostController.getComments);

export default router;
