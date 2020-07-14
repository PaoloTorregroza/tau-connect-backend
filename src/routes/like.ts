import { Router } from "express";
import LikeController from '../controller/LikeController';

const router = Router();

router.get("/comment/:id", LikeController.getCommentLikes);
router.get("/post/:id", LikeController.getPostLikes);

export default router;