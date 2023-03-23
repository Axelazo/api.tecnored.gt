import cron from "node-cron";
import fs from "fs";
import path from "path";
import Person from "../models/Person";
import Dpi from "../models/Dpi";

const directory = path.join(__dirname, "../public/");

/**
 *
 * Removes unused Dpi image files from the public directory .
 * TODO: Get URL prefix from db
 * TODO: Move DPI image files to a subfolder in the public route
 *
 **/
export default function removeUnusedDpiImages() {
  const urlPrefix = `http://localhost:4000/public/`;
  cron.schedule("0 0 28-31 * *", async () => {
    const today = new Date();
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );

    if (today.getTime() === lastDayOfMonth.getTime()) {
      console.log(`[server]: ⚡️ TecnoRedMS API - Removing unused images...`);

      const persons = await Person.findAll({
        include: [{ model: Dpi, as: "dpi" }],
      });

      const personsDpis: string[] = [];

      for (const person of persons) {
        const dpi = await person.getDpi();
        personsDpis.push(dpi.dpiFrontUrl.replace(urlPrefix, ""));
        personsDpis.push(dpi.dpiBackUrl.replace(urlPrefix, ""));
      }

      const files = fs.readdirSync(directory);

      files.forEach((file) => {
        if (!personsDpis.includes(file)) {
          fs.unlinkSync(path.join(directory, file));
        }
      });
    }
  });
}
