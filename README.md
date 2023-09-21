# KryptoInsight Project

## Overview

KryptoInsight is a revolutionary blockchain survey management platform designed to streamline the process of creating, distributing, and participating in surveys. This repository contains three main components: the client-side application, the server-side backend, and the smart contracts for the Ethereum blockchain.

## Client

The client-side application is built using React, providing a seamless and responsive user experience. It interfaces with local storage, maintains user authentication tokens, and enables direct interaction with Metamask. The application's core functionality lies in three pivotal layers: the Client, Logic, and Blockchain tiers. Each component plays a crucial role in ensuring seamless operation.

## Installation

To get started, ensure you have Node.js and npm installed on your machine. Then, follow these steps:

1. Clone the repository to your local machine.

2. Navigate to the client directory using the terminal:

   ```bash
   cd client
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Scripts

### `npm run dev`

This command starts the development server. It uses ViteJS to provide a fast and efficient development experience.

### `npm run build`

Builds the app for production. The build artifacts will be stored in the `dist/` directory.

### `npm run lint`

Lints the source code using ESLint, ensuring code consistency and best practices.

### `npm run preview`

This script serves the built application locally, allowing you to preview it before deployment.

## Dependencies

- **React**: A powerful JavaScript library for building user interfaces.

- **Axios**: A promise-based HTTP client for making API requests.

- **Formik and Yup**: Tools for managing forms and validation.

- **React Router**: Provides routing functionality for a React application.

- **Wagmi**: Custom utility library for various functionalities.

- **JWT Decode**: Library for decoding JWT tokens.

- **Universal Cookie**: Simplifies cookie management in both the client and server.

- **UUID**: Generates unique IDs.

- **CryptoJS**: Library for various cryptographic functions.

- **dotenv**: Loads environment variables from a `.env` file.

## Dev Dependencies

- **ViteJS**: Fast, modern frontend build tool that significantly improves the frontend development experience.

- **ESLint**: JavaScript linter for maintaining code quality.

- **Tailwind CSS and DaisyUI**: Utility-first CSS framework for building modern designs.

- **PostCSS and Autoprefixer**: Tools for processing CSS.

## Server

The server-side backend is powered by Node and Express, serving as the core of the application. It handles CRUD operations and efficiently manages a large dataset. The backend utilizes various middleware such as `bcrypt`, `cookie-parser`, `cors`, and `jsonwebtoken` to ensure secure and reliable transactions.

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

## Smart Contracts

The smart contracts for KryptoInsight are designed to operate on the Ethereum blockchain. We leverage the battle-tested implementations provided by the OpenZeppelin library. These contracts provide a solid foundation for secure and reliable operations.

## Installation

1. Clone the repository to your local machine.

2. Navigate to the `smart_contract` directory using the terminal:

   ```bash
   cd smart_contract
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

## Smart Contract Details

### OpenZeppelin Contracts

We use the [OpenZeppelin](https://openzeppelin.com/contracts) library for battle-tested smart contract implementations. These contracts provide a solid foundation for secure and reliable operations.

### Hardhat

[Hardhat](https://hardhat.org/) is a development environment to compile, deploy, test, and debug your Ethereum software. It integrates with popular testing frameworks like Mocha and Waffle.

## Scripts

### `npx hardhat compile`

This command compiles the smart contracts located in the `contracts` directory.

### `npx hardhat test`

This command runs the test suite for the smart contracts. Ensure you have a running Ethereum node or Hardhat Network.

### `npx hardhat run scripts/deploy.js`

This command deploys the smart contracts to the Ethereum network. Make sure to set up your [`.env`](./.env.example) file with the necessary environment variables.

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
# Your private key for deploying contracts
PRIVATE_KEY=

# Infura API key for connecting to an Ethereum node
INFURA_API_KEY=

# Etherscan API key for verifying contracts on Etherscan
ETHERSCAN_API_KEY=
```

## Getting Started

1. Clone the repository to your local machine.

2. Install dependencies for the client, server, and smart contracts by following the instructions in their respective readme files.

3. Set up your environment variables as specified in the `.env.example` files in the client, server, and smart contract directories.

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
