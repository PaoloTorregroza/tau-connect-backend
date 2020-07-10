import {Router} from "express";
import AuthController from "../controller/AuthController";
import {checkJwt} from "../middlewares/checkJwt";

const router = Router();

// Login route 
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.put("/change-password", checkJwt, AuthController.changePassword);

export default router;
