import { Router } from "express";
import CommentController from '../controller/CommentController';
import {checkJwt} from '../middlewares/checkJwt';

const router = Router();

router.get("/:id", CommentController.one);
// Add a comment to a post identified whit :id
router.post("/:id", [checkJwt], CommentController.save);
router.delete("/:id", [checkJwt], CommentController.delete);
router.put("/like/:id", [checkJwt], CommentController.like);

export default router;