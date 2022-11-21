import {
  sessionsCollection,
  usersCollection,
  valuesCollection,
} from "../database/db.js";
import { valuesSchema } from "../models/values.model.js";

export async function createValue(req, res) {
  const { amount, description } = req.body;
  const user = req.user;

  try {
    const newValue = {
      amount,
      description,
      user: user._id
    };

    const { error } = valuesSchema.validate(newValue, { abortEarly: false });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }

    await valuesCollection.insertOne(newValue);

    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}

export async function findValues(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: session?.userId });

    if (!user) {
      return res.sendStatus(401);
    }

    const posts = await valuesCollection.find().sort({ _id: -1 }).toArray();
    res.send(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
}
