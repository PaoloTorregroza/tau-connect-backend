import { Router } from "express";
import LikeController from '../controller/LikeController';

const router = Router();

router.get("/comment/:id", LikeController.getCommentLikes);
router.get("/post/:id", LikeController.getPostLikes);
router.get("/post/:element/:user", LikeController.isPostLiked);
router.get("/comment/:element/:user", LikeController.isCommentLiked);

export default router;
