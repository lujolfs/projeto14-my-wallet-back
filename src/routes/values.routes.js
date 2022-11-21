import { Router } from "express";
import {
  createValue,
  findValues
} from "../controllers/values.controller.js";
import { authValidation } from "../middlewares/authValidation.middleware.js";

const router = Router();

router.use(authValidation);

router.post("/", createValue);
router.get("/", findValues);

export default router;