# Readme for KryptoInsight Server

This is the backend server for KryptoInsight, a cutting-edge blockchain survey management platform. Below are the details and instructions for running and maintaining this server.

## Installation

To get started, ensure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the server directory using the terminal:

   ```bash
   cd server
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Scripts

### `npm start`

This command starts the server using Nodemon, which automatically restarts the server upon file changes.

## Dependencies

- **Express**: A fast, unopinionated, minimalist web framework for Node.js.

- **Mongoose**: Elegant MongoDB object modeling for Node.js.

- **Bcrypt**: A library for hashing and salting passwords.

- **Body-parser**: Middleware for parsing incoming request bodies.

- **Cookie-parser**: Middleware for parsing cookies.

- **Cookie-session**: Middleware for handling sessions using cookies.

- **Cors**: Middleware for enabling Cross-Origin Resource Sharing.

- **Dotenv**: Loads environment variables from a `.env` file.

- **Jsonwebtoken**: Implements JSON Web Tokens for authentication.

- **Nodemailer**: Library for sending emails.

- **Nodemon**: Utility that monitors for changes and restarts the server.

## Usage

For specific instructions on using this server with the KryptoInsight client, refer to the main project documentation.

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
