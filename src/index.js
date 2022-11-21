import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dayjs from "dayjs";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

const userSchema=joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().required(),
  repeat_password: joi.string().required().valid(joi.ref('password')),
})

const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient("mongodb://localhost:27017");
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("myWallet");
} catch (err) {
    console.log(err);
}

const users = db.collection('users');
const sessions = db.collection('sessions');
const values = db.collection('values');

//sign-in
app.post("/sign-in", async (req, res) => {
    const { email, password } = req.body;
    const user = await users.findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = uuid();
        await sessions.insertOne({
            userId: user._id,
            token
        })
        res.send(token)
    } else {
        res.send("Não")
    }
})

//sign-up
app.post("/sign-up", async (req, res) => {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);
    const uemail = {email: req.body.email}
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
        await users.insertOne({
          "name": req.body.name,
          "email": req.body.email,
          "password": passwordHash
        });
        res.sendStatus(201);
      };
    } catch (err) {
      res.status(500).send(err);
    }
})

//tela principal
app.get("/", async (req, res) => {
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');

    if (!token) return res.sendStatus(401);

    const session = await sessions.findOne({ token });

    if (!session) {
        return res.sendStatus(401);
    }

    const user = await users.findOne({
        _id: session.userId
    })

    if (user) {
        if (values.find()) {
            try {
                const userValues = await values
                    .find()
                    .toArray();
                res.send(userValues);
            } catch (err) {
                console.log(err)
                res.sendStatus(500);
            }
        } else {
            res.send([]);
        }
    } else {
        res.sendStatus(401);
    }
})

app.post("/", async (req, res) => {
    const { amount, description, type } = req.body;
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    if (!token) return res.sendStatus(401);

    const session = await sessions.findOne({ token });
    if (!session) {
        return res.sendStatus(401);
    }

    const user = await users.findOne({
        _id: session.userId
    })


    if (user) {
        try {
            await values.insertOne({
                'amount': amount,
                'description': description,
                'type': type
            });
            res.sendStatus(201)
        } catch (err) {
            res.sendStatus(500)
        }
    };
})

app.listen(5000, () => console.log("Port 5000"));