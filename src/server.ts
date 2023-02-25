import express, { Express } from "express";
import router from "./routes/routes";
import dotenv from "dotenv";
import { sequelize } from "./models/index";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

//Settings
const port: number = parseInt(<string>process.env.PORT, 10) || 3000;

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
