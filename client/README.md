# Readme for KryptoInsight Client

This is the client-side application for KryptoInsight, a cutting-edge blockchain survey management platform. Below are the details and instructions for running and maintaining this client.

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

## Usage

For specific instructions on using this client with the KryptoInsight server, refer to the main project documentation.

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
