const auth = {
  secret: process.env.AUTH_SECRET || "apptecnored",
  expires: process.env.AUTH_EXPIRES || "24h",
  rounds: process.env.AUTH_ROUNDS || 10,
};

export default auth;
