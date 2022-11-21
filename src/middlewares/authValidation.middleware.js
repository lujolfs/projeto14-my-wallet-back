import { sessionsCollection, usersCollection } from "../database/db.js";

export async function authValidation (req, res, next) {
    const { authorization } = req.headers;
    const token = authorization?.replace("Bearer ", "");

    if (!token) {
        return res.sendStatus(401);
    }

    try {
        const session = await sessionsCollection.findOne({ token });
        const user = await usersCollection.findOne({ _id: session?.userId });

        if (!user) {
            return res.sendStatus(401);
        }

        req.user = user;

    } catch (err) {
        console.log(err);
        return res.sendStatus(500)
    }
    next();
}


/* const uemail = { email: req.body.email }
const validation = userSchema.validate(user, { abortEarly: false })

if (validation.error) {
    const error = validation.error.details.map(detail => detail.message)
    res.status(422).send(error);
    return
}

try {
    const check = await users.findOne(uemail);
    if (check) {
        res.sendStatus(409);
        return;
    } else {

    }
} */