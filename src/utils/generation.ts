import { randomInt } from "crypto";
import { Model, ModelStatic } from "sequelize";

/**
 * Generates a unique number with the given length and checks for collisions in the provided Sequelize model.
 * @param {number} numberLength - The length of the random number to be generated and added to the count.
 * @param {Object} model - The Sequelize model to use for checking collisions.
 * @returns {Promise<string>} - A Promise that resolves to the generated number.
 */
async function generateUniqueNumber(
  numberLength: number,
  field: string,
  model: ModelStatic<Model>
) {
  let number;
  let collision = true;
  while (collision) {
    // Step 1: Retrieve the current count of records
    const recordCount = await model.count();

    // Step 2: Generate a random number
    const random = randomInt(
      Math.pow(10, numberLength - 1),
      Math.pow(10, numberLength) - 1
    );

    // Step 3: Combine the record count and the random number
    number = parseInt(
      recordCount.toString().padStart(numberLength, "0") + random
    ).toString();

    // Step 4: Check for collisions
    const existingRecord = await model.findOne({ where: { [field]: number } });
    collision = !!existingRecord;
  }

  // Step 5: Return the generated number
  if (number) {
    return number;
  }

  return null;
}

export { generateUniqueNumber };
