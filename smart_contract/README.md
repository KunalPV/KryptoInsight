# Readme for KryptoInsight Smart Contract

This repository contains the smart contracts for KryptoInsight, a revolutionary blockchain survey management platform. Below are the details and instructions for working with these contracts.

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

## Contributing

If you'd like to contribute to this project, please follow the [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
