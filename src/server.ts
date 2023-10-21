import express, { Express } from "express";
import router from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import removeUnusedDpiImages from "./tasks/removeUnusedDpiImages";
import { sequelize } from "./models/index";
import processMonthlyPayroll from "./tasks/processMonthlyPayroll";

dotenv.config({ path: __dirname + "/.env" });

const app: Express = express();

//Settings
const port: number = parseInt(<string>process.env.PORT, 10) || 4000;

//Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://tecnored.gt.dev.axelaguilar.com",
    ],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("combined"));
//Routes
app.use(router);

app.listen(port, () => {
  console.log(
    `[server]: ⚡️ TecnoRedMS API - API is running at http://localhost:${port}`
  );

  sequelize.authenticate().then(() => {
    console.log(`[server]: ⚡️ TecnoRedMS API - Database is connected!`);
    removeUnusedDpiImages();
    processMonthlyPayroll();
  });
});

console.log(`[server]: ⚡️ TecnoRedMS API - Starting tasks...`);

console.log(`[server]: ⚡️ TecnoRedMS API - Current date is: ${new Date()}`);
