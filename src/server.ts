import express, { Express } from "express";
import router from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import removeUnusedDpiImages from "./tasks/removeUnusedDpiImages";
import { sequelize } from "./models/index";
import * as path from "path";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

//Settings
const port: number = parseInt(<string>process.env.PORT, 10) || 4000;

//Middlewares
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
//Routes
app.use(router);
app.use("/public", express.static(path.join(__dirname, "/public/")));

app.listen(port, () => {
  console.log(
    `[server]: ⚡️ TecnoRedMS API - API is running at http://localhost:${port}`
  );

  sequelize.authenticate().then(() => {
    console.log(`[server]: ⚡️ TecnoRedMS API - Database is connected!`);
    removeUnusedDpiImages();
  });
});

console.log(`[server]: ⚡️ TecnoRedMS API - Starting tasks...`);
