/**
 * Validates if a given string is a valid IPv4 address.
 * @param {string} ip - The IPv4 address to validate.
 * @returns {boolean} True if the address is valid, false otherwise.
 */
function isValidIPv4(ip: string) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  return ipv4Regex.test(ip);
}

/**
 * Checks if a given IPv4 address is within the allowed range based on a default gateway.
 * @param {string} ip - The IPv4 address to check.
 * @param {string} defaultGateway - The default gateway address within the range.
 * @returns {boolean} True if the address is within the range, false otherwise.
 */
function isIPinRange(ip: string, defaultGateway: string) {
  if (!isValidIPv4(ip) || !isValidIPv4(defaultGateway)) {
    return false; // Incorrect IPv4 address syntax
  }

  const ipParts = ip.split(".").map(Number);
  const gatewayParts = defaultGateway.split(".").map(Number);

  if (
    ipParts[0] !== gatewayParts[0] ||
    ipParts[1] !== gatewayParts[1] ||
    ipParts[2] !== gatewayParts[2]
  ) {
    return false; // Not in the same subnet range
  }

  const ipLastOctet = ipParts[3];
  const gatewayLastOctet = gatewayParts[3];

  if (
    ipLastOctet === gatewayLastOctet ||
    ipLastOctet < gatewayLastOctet + 1 ||
    ipLastOctet > gatewayLastOctet + 255
  ) {
    return false; // Not within the specified range
  }

  return true; // The IPv4 address is within the range and has correct syntax
}

export { isValidIPv4, isIPinRange };
