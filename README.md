# TecnoRed Management System backend

This is a NodeJS backend server for TecnoRed. It's built with TypeScript, Express, and Sequelize, and uses MySQL as the database.

## Getting Started

### Prerequisites

Before you can run the server, you need to have the following software installed:

- NodeJS v14.x or higher
- npm v6.x or higher
- MySQL v5.x or higher

### Installation

- Clone this repository to your local machine.
- Navigate to the project directory in your terminal.
- Run `npm install` to install the required dependencies.
- Create a .env file in the root directory with the following variables:

> DB_HOST=your_database_host
> DB_PORT=your_database_port
> DB_NAME=your_database_name
> DB_USER=your_database_user
> DB_PASSWORD=your_database_password
> JWT_SECRET=your_jwt_secret_key

- Run `npm run db` to migrate the database.
- Run `npm run seed` to seed the database.
- Run `npm start` to start the server.

### Usage

Once the server is running, you can access the API at http://localhost:3000.

### Scripts

This project includes several scripts in the package.json file to help with development and deployment:

- `npm run start` - starts the server in production mode.
- `npm run dev` - starts the server in development mode with nodemon.
- `npm run test` - runs the tests (no tests are currently included).
- `npm run build` - builds the project for production.
- `npm run db` - migrates the database and seeds some initial data.
- `npm run migrate` - runs database migrations.
- `npm run seed` - seeds the database with some initial data.

### Dependencies

This project uses the following dependencies:

- bcrypt - for password hashing.
- cors - for enabling CORS on the server.
- crypto - for generating secure random tokens.
- dotenv - for loading environment variables from a .env file. eslint - for linting the code.
- express - for building the API.
- jsonwebtoken - for creating and verifying JSON Web Tokens.
- morgan - for logging HTTP requests.
- multer - for handling file uploads.
- mysql2 - for connecting to the MySQL database.
- node-cron - for scheduling tasks.
- uuid - for generating unique IDs.

### Dev Dependencies

This project also uses the following dev dependencies:

- @typescript-eslint/eslint-plugin - for linting TypeScript code.
- @typescript-eslint/parser - for parsing TypeScript code for ESLint.
- @types/\* - type definitions for the dependencies.
- nodemon - for automatically restarting the server in development mode.
- rimraf - for deleting the build directory before rebuilding.
- sequelize - for ORM to connect with database
- sequelize-cli - for running database migrations and seeding.
- ts-node - for running TypeScript code directly.
- typescript - for compiling TypeScript code to JavaScript.

### License

This project is licensed under the ISC License - see the LICENSE file for details.
