#!/bin/bash

# Thoughts Verse Platform Setup Script

# Exit on any error
set -e


# Function to check if a command exists
check_command() {
    command -v "$1" >/dev/null 2>&1 || { echo >&2 "$1 is required but not installed. Please install it and try again."; exit 1; }
}

# Check for prerequisites
echo "Checking prerequisites..."
check_command "node"
check_command "npm"
check_command "git"

echo "All prerequisites are satisfied."

# Prompt for Environment Variables
echo "Please enter your Infura API Key:"
read -r INFURA_API_KEY
echo "Please enter your wallet's private key (this will not be echoed for security):"
read -s PRIVATE_KEY

# 1. Clone the Repository
echo "Cloning the repository..."
git clone https://github.com/SAURABHMISHRA55/ThoughtVerse-Content-Sharing-Platform.git
cd thoughtVerse

# 2. Install Dependencies
echo "Installing dependencies..."
npm install

# 3. Set up Environment Configuration
echo "Setting up environment configuration..."

# Create .env file with user-provided INFURA_API_KEY and PRIVATE_KEY
echo "PRIVATE_KEY=${PRIVATE_KEY}" > .env
echo "INFURA_API_KEY=${INFURA_API_KEY}" >> .env

echo ".env file configured."

# 4. Compile the Smart Contracts
echo "Compiling smart contracts..."
npx hardhat compile

# 5. Deploy the Smart Contract
echo "Deploying smart contract to Sepolia network..."
DEPLOY_OUTPUT=$(npx hardhat run scripts/deploy.js --network sepolia)
CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oE '0x[a-fA-F0-9]{40}')

if [ -z "$CONTRACT_ADDRESS" ]; then
    echo "Error: Could not find contract address in deployment output."
    exit 1
fi

echo "Smart contract deployed at address: $CONTRACT_ADDRESS"

# 6. Update Contract Address in the Frontend
echo "Updating contract address in frontend configuration..."
sed -i "s/Deployed_Contract_Address/$CONTRACT_ADDRESS/" src/components/utils/contract.js

# 7. Copy ABI to Frontend
echo "Copying ABI to frontend..."
mkdir -p src/abis/
cp artifacts/contracts/ContentPlatform.sol/ContentPlatform.json src/abis/ContentPlatform.json

# 8. Start the Application
echo "Starting the application..."
npm start &

# Notify the user that the setup is complete
echo "Thoughts Verse Platform is up and running at http://localhost:3000"

