/**
 * Calculate the real value by subtracting a specified amount for every given step in the input value.
 * For example, if the value is 10 and the step is 5, and the amount is 0.5,
 * the real value will be 9 (10 - 0.5 - 0.5).
 * If the value is 17 and the step is 5, and the amount is 0.5,
 * the real value will be 14.5 (17 - 0.5 - 0.5 - 0.5).
 *
 * @param {number} value - The input value from which to calculate the real value.
 * @param {number} step - The step for which the specified amount should be subtracted.
 * @param {number} amount - The amount to be subtracted for every given step.
 * @returns {number} The calculated real value.
 */
export function calculateRealValue(
  value: number,
  step: number,
  amount: number
): number {
  return value - Math.floor(value / step) * amount;
}
