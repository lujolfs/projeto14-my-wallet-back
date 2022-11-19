import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dayjs from "dayjs";
import joi from "joi";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

const app = express();

//configs
app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
let db;

try {
    await mongoClient.connect();
    db = mongoClient.db("myWallet");
} catch (err) {
    console.log(err);
}

//sign-in
app.post("/", async (req, res) => {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    
    if (user && bcrypt.compareSync(password, user.password)) {
        res.send("Logou")
    } else {
        res.send("Não")
    }
})

//sign-up
app.post("/sign-up", async (req, res) => {
    const user = req.body;
    const passwordHash = bcrypt.hashSync(user.password, 10);
    await db.collection('users').insertOne({...user, password: passwordHash})
    res.sendStatus(201);
})


app.listen(5000, () => console.log("Port 5000"));