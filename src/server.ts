import express, { Express } from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import { sequelize } from "./models/index";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

//Settings
const port: number = parseInt(<string>process.env.PORT, 10) || 4000;

//Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(morgan("combined"));

//Routes
app.use(router);

app.listen(port, () => {
  console.log(
    `[server]: ⚡️ AdmonTecnoRed API is running at http://localhost:${port}`
  );

  sequelize.authenticate().then(() => {
    console.log(`[server]: ⚡️ Database of AdmonTecnoRed is connected!`);
  });
});
