# Thoughts Verse Platform Setup Guide

Welcome to the setup guide for **Thoughts Verse Platform**. You can quickly set up, deploy, and run the application locally by following this guide.

## Prerequisites

Make sure you have the following installed on your system:

1. **Node.js and npm**: Install Node.js from [Node.js Official Website](https://nodejs.org).
2. **Git**: Download from [Git's official website](https://git-scm.com).
3. **MetaMask**: Set up an Ethereum wallet like [MetaMask](https://metamask.io).
4. **Infura Account**: Register at [Infura](https://infura.io/) to obtain an Infura API key.

## Quick Setup with `setup.sh`

This repository includes a `setup.sh` file that automates the setup process. To get started, simply run:

```bash
./setup.sh
```

This script will handle cloning the repository, installing dependencies, configuring the environment, compiling and deploying smart contracts, and starting the application for you.

> **Note**: If you encounter any issues with the automated setup, you can manually complete each step by following the detailed instructions below.

## Step-by-Step Manual Setup

### 1. Clone the Repository

In your terminal, clone this repository and navigate to the project directory:

```bash
git clone https://github.com/SAURABHMISHRA55/ThoughtVerse-Content-Sharing-Platform.git
cd ThoughtVerse-Content-Sharing-Platform
```

### 2. Install Dependencies

Run the following command to install all the required dependencies for both the backend and frontend:

```bash
npm install
```

### 3. Environment Configuration

This project requires an `.env` file to store sensitive information securely. A sample `.env` file has been included with placeholders for your Infura API key and private key.

- Open `.env` and replace the placeholders with your actual values:

  - **INFURA_API_KEY**: Obtain from [Infura](https://infura.io/) by registering and creating a project.
  - **PRIVATE_KEY**: This is your wallet's private key. **Never share it publicly.**

Example `.env` file:

```env
PRIVATE_KEY=your_wallet_private_key
INFURA_API_KEY=your_infura_project_id
```

### 4. Compile the Smart Contracts

Navigate to the smart contracts directory and compile them using Hardhat:

```bash
npx hardhat compile
```

If successful, this will generate artifacts in the `artifacts` folder.

### 5. Deploy the Smart Contract

Run the following command to deploy the contract to the Sepolia test network. Ensure you have Sepolia ETH in your wallet. You can get test ETH from a [Sepolia faucet](https://sepoliafaucet.com/).

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

- After deployment, you’ll see the contract address printed in the terminal. **Copy this address for the next step.**

### 6. Update Contract Address in the Frontend

In the frontend configuration file `src/components/utils/contract.js`, replace the placeholder address with the newly deployed contract address:

```javascript
// src/components/utils/contract.js
export const contractAddress = "Deployed_Contract_Address";
```

### 7. Copy ABI to Frontend

After deployment, copy the generated ABI (Application Binary Interface) JSON file to the frontend directory so it can interact with the smart contract.

Run the following command:

```bash
cp content-platform/artifacts/contracts/ContentPlatform.sol/ContentPlatform.json content-platform-frontend/src/abis/ContentPlatform.json
```

### 8. Start the Application

Navigate to the frontend directory and start the React development server:

```bash
npm start
```

- Open your browser and go to `http://localhost:3000` to view the application.

---

## Summary of Commands

1. Clone the repository:

   ```bash
   git clone git clone https://github.com/SAURABHMISHRA55/ThoughtVerse-Content-Sharing-Platform.git
   cd ThoughtVerse-Content-Sharing-Platform
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Compile the contracts:

   ```bash
   npx hardhat compile
   ```

4. Deploy the contract:

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. Update `contract.js` with the deployed contract address.

6. Copy the ABI:

   ```bash
   mkdir src/abis/
   cp artifacts/contracts/ContentPlatform.sol/ContentPlatform.json src/abis/
   ```

7. Start the application:
   ```bash
   npm start
   ```
