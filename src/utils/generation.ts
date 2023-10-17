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

    /*     // Step 2: Generate a random number
    const random = randomInt(
      Math.pow(10, numberLength - 1),
      Math.pow(10, numberLength) - 1
    );

    // Step 3: Combine the record count and the random number
    number = parseInt(
      recordCount.toString().padStart(numberLength, "0") + random
    ).toString(); */

    // Step 2: Generate a random number with 8 digits
    const random = randomInt(10000000, 99999999); // Range for 8-digit numbers

    // Step 3: Combine the record count and the random number
    number = random.toString().slice(0, 8);

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

/**
 * Generates the corporate email with the first name and first last name
 * @param {string} firstNames - The names of the given employee.
 * @param {string} lastNames - The last names of the given employee.
 * @returns {string} - The generated corporate email mailbox string.
 */
function generateCorporateEmail(firstNames: string, lastNames: string) {
  const firstName = firstNames.split(" ")[0].toLowerCase();
  const lastName = lastNames.split(" ")[0].toLowerCase();
  return `${firstName}.${lastName}`;
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export { generateUniqueNumber, generateCorporateEmail, capitalizeFirstLetter };
