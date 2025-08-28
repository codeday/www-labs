# www-labs – Development Setup Guide

This guide explains how to set up and run the **[codeday/www-labs](https://github.com/codeday/www-labs)** project locally.

---

## Getting Started

### 1. Clone the Repository
```bash
# Clone the project from GitHub
git clone https://github.com/codeday/www-labs.git

# Move into the project directory
cd www-labs
```

### 2. Install a compatible Node.js version

##### Note: This project only works with Node.js versions 14.x-16.x.
- Below 14: dependencies won't install.
- 17+: Causes known issue with other dependencies when running environment.

Recommended: use nvm to install.

If nvm not installed:
```bash
# Update package list
sudo apt update

# Install curl
sudo apt install curl

# Download and run the NVM Installation Script
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# After the script finishes either close and reopen your terminal or manually source shell profile
source ~/.bashrc

# Confirm installation
nvm --version
```

Node.js install:
```bash
# Find a stable and compatible version
nvm ls-remote

# Install Node.js version (LTS recommended)
nvm install xx.xx.x

# Use Node.js version for this project
nvm use xx.xx.x

# Verify version is correct
node -v
```

### 3. Install Dependencies
```bash
# If yarn not installed
npm install -g yarn

# Install dependencies
yarn install
```

### 4. Set Up Environment Variables
- Create a .env file in the project root
- Get the API keys and other contents to copy into file from your manager.

### 5. Run the Development Server
```bash
# Unix/Linux/macOS/WSL
yarn dev

# Windows
yarn next dev
```

### 6. Open in Browser
Once the server starts, you should see something like this in your terminal:
```
Local: http://localhost:3000
```
