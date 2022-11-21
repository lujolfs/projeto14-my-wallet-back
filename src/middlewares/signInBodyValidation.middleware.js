import { usersCollection } from "../database/db.js";
import bcrypt from "bcrypt";

export async function signInBodyValidation (req, res, next) {
    const { email, password } = req.body;

    const userCheck = await usersCollection.findOne({ email });
    if (!userCheck) {
        return res.sendStatus(401);
    }

    const passwordCheck = bcrypt.compareSync(password, userCheck.password);
    if (!passwordCheck) {
        return res.sendStatus(401);
    }

    req.userSignin = userCheck;
    next();
}