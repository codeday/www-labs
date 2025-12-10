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
www-labs supports node 22.X - other versions may work but are not officially supported.

We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage your node version.

After [installing nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) simply run `nvm install` from the www-labs directory to install and switch to the correct node version.

>[!TIP]
> You only need to run `nvm install` the first time you set up the project. Subsequent times you start your environment you only need to run `nvm use`  

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
