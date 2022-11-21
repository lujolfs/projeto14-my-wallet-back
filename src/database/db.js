import dotenv from "dotenv";
import { MongoClient } from "mongodb";


dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);

try {
    await mongoClient.connect();
    console.log("MongoDB conectado.");
    
} catch (err) {
    console.log(err);
}

const db = mongoClient.db("myWallet");
export const usersCollection = db.collection('users');
export const sessionsCollection = db.collection('sessions');
export const valuesCollection = db.collection('values');