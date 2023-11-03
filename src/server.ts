import express, { Express } from "express";
import router from "./routes";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import removeUnusedDpiImages from "./tasks/removeUnusedDpiImages";
import { sequelize } from "./models/index";
import processMonthlyPayroll from "./tasks/processMonthlyPayroll";
import createMonthlyPayroll from "./tasks/createMonthlyPayroll";

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

const server = app.listen(port, () => {
  console.log(
    `[server]: ⚡️ TecnoRedMS API - API is running at http://localhost:${port}`
  );

  sequelize.authenticate().then(() => {
    console.log(`[server]: ⚡️ TecnoRedMS API - Database is connected!`);
    removeUnusedDpiImages();
    processMonthlyPayroll();
    createMonthlyPayroll();
  });
});

// Handle SIGINT and SIGTERM signals
process.on("SIGINT", () => {
  console.log(
    "[server]: ⚡️ TecnoRedMS API - Received SIGINT. Shutting down gracefully..."
  );

  // Perform any cleanup or additional shutdown tasks here
  // For example, you can close the database connection and release resources.

  server.close(() => {
    console.log("[server]: ⚡️ TecnoRedMS API - Server has been closed.");
    process.exit(0); // Exit the process
  });
});

process.on("SIGTERM", () => {
  console.log(
    "[server]: ⚡️ TecnoRedMS API - Received SIGTERM. Shutting down gracefully..."
  );

  // Perform any cleanup or additional shutdown tasks here
  // For example, you can close the database connection and release resources.

  server.close(() => {
    console.log("[server]: ⚡️ TecnoRedMS API - Server has been closed.");
    process.exit(0); // Exit the process
  });
});

console.log(`[server]: ⚡️ TecnoRedMS API - Starting tasks...`);

console.log(`[server]: ⚡️ TecnoRedMS API - Current date is: ${new Date()}`);

export { app, server };
