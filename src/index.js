import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes.js";
import valuesRoutes from "./routes/values.routes.js"


const app = express();
app.use(express.json());
app.use(cors());
app.use(usersRoutes);
app.use(valuesRoutes);

app.listen(5000, () => console.log("Port 5000"));