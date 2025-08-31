# 🏔️ AvalancheL1SubnetCreator

A complete, production-ready Inter-Chain Messaging dashboard for Avalanche subnets. Send cross-chain messages between Avalanche L1 subnets with real-time monitoring and analytics.

## ✨ Features

- 🚀 **Cross-Chain Messaging**: Send messages between Avalanche subnets using Teleporter
- 📊 **Real-time Analytics**: Live transaction monitoring and subnet usage statistics
- 🔗 **Multi-Subnet Support**: Dexalot, DeFi Kingdoms, Amplify, and custom subnets
- 💼 **Wallet Integration**: MetaMask with automatic Fuji testnet switching
- 📋 **Transaction History**: Complete message history with export functionality
- 🎯 **Production Ready**: Docker deployment, API documentation, testing

## 🌐 Supported Networks

- **Avalanche Fuji Testnet**: Development and testing
- **Avalanche Mainnet**: Production deployment
- **L1 Subnets**: All Avalanche subnets with ICM support

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- MetaMask wallet
- Avalanche testnet AVAX (faucet: https://faucet.avax-test.network/)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/avalanchel1subnetcreator.git
cd avalanchel1subnetcreator

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Environment Setup

```env
# Avalanche Configuration
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
TELEPORTER_CONTRACT_ADDRESS=0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf

# ✅ No private key required - MetaMask handles transaction signing!

# Subnet Blockchain IDs
AVAX_BLOCKCHAIN_ID_DEXALOT=0x2VCAhX6vE3UnXC6s1CBPE6jJ4c4cHWMfPgCptuWS59pQ8WYxXw
AVAX_BLOCKCHAIN_ID_DFK=0x2rwhRKN8qfxK9AEJunfUjn5WH7PQzUPPQKCb59ak6fwsrwF2R
AVAX_BLOCKCHAIN_ID_AMPLIFY=0xzJytnh96Pc8rM337bBrtMvJDbEdDNjcXiG3WkTNCiLp8krJUk
```

## 📖 Usage

### 1. Connect Wallet

Click the **"Connect Wallet"** button to connect your MetaMask wallet. The dashboard will automatically switch to Avalanche Fuji testnet.

### 2. Send ICM Message

1. Select a **destination subnet** from the dropdown (Dexalot, DeFi Kingdoms, Amplify, or Custom)
2. Enter the **recipient address**
3. Write your **message content**
4. Click **"Send ICM Message"**
5. Approve the transaction in MetaMask

### 3. Monitor Transactions

- View **transaction history** in the History tab
- Track **real-time status** updates
- Export transaction data as CSV
- View **analytics and statistics**

## 🚀 Deployment

### Docker Deployment (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up --build

# Access at http://localhost:3000
```

### Manual Deployment

```bash
# Frontend
cd frontend && npm run build && npm start

# Backend
cd backend && npm run build && npm start
```

### Cloud Deployment

#### Vercel (Frontend)
```bash
npm i -g vercel
vercel --prod
```

#### Railway (Backend)
```bash
git push railway main
```

## 🔧 Development

### Local Development

```bash
# Install dependencies
npm install

# Start development servers
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Avalanche](https://avalancheavax.com/) for the ICM protocol
- [Teleporter](https://docs.avax.network/build/cross-chain/teleporter) for cross-chain messaging
- [MetaMask](https://metamask.io/) for wallet integration

---

**Built with ❤️ by Unite DeFi**