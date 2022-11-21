import { Router } from "express";
import { signUpBodyValidation } from "../middlewares/signUpBodyValidation.middleware.js";
import { signInBodyValidation } from "../middlewares/signInBodyValidation.middleware.js";
import { signUp } from "../controllers/users.controllers.js";
import { signIn } from "../controllers/users.controllers.js";

const router = Router();

router.post("/sign-up", signUpBodyValidation, signUp);
router.post("/sign-in", signInBodyValidation, signIn);

export default router;