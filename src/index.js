import express from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import dayjs from "dayjs";
import joi from "joi";
import dotenv from "dotenv";

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

app.listen(5000);