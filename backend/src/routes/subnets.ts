import express from 'express'
import { TeleporterService } from '../services/teleporter'

const router = express.Router()
const teleporter = new TeleporterService()

// Available subnets
const AVAILABLE_SUBNETS = [
  {
    id: 'dexalot',
    name: 'Dexalot',
    chainId: '0x2VCAhX6vE3UnXC6s1CBPE6jJ4c4cHWMfPgCptuWS59pQ8WYxXw',
    rpcUrl: 'https://subnets.avax.network/dexalot/testnet/rpc',
    explorerUrl: 'https://subnets-test.avax.network/dexalot',
    description: 'Decentralized exchange on Avalanche',
    isActive: true,
    logoUrl: '/images/dexalot-logo.png'
  },
  {
    id: 'dfk',
    name: 'DeFi Kingdoms',
    chainId: '0x2rwhRKN8qfxK9AEJunfUjn5WH7PQzUPPQKCb59ak6fwsrwF2R',
    rpcUrl: 'https://subnets.avax.network/defikingdoms/dfk-chain/rpc',
    explorerUrl: 'https://subnets.avax.network/defikingdoms',
    description: 'GameFi platform with DeFi elements',
    isActive: true,
    logoUrl: '/images/dfk-logo.png'
  },
  {
    id: 'amplify',
    name: 'Amplify',
    chainId: '0xzJytnh96Pc8rM337bBrtMvJDbEdDNjcXiG3WkTNCiLp8krJUk',
    rpcUrl: 'https://subnets.avax.network/amplify/testnet/rpc',
    explorerUrl: 'https://subnets-test.avax.network/amplify',
    description: 'DeFi protocol for yield amplification',
    isActive: true,
    logoUrl: '/images/amplify-logo.png'
  }
]

// Get available subnets
router.get('/available', async (req, res) => {
  try {
    res.json(AVAILABLE_SUBNETS)
  } catch (error: any) {
    console.error('Failed to get available subnets:', error)
    res.status(500).json({
      error: 'Failed to get subnets',
      details: error.message
    })
  }
})

// Get subnet info
router.get('/info', async (req, res) => {
  try {
    const { chainId } = req.query
    
    if (!chainId) {
      return res.status(400).json({
        error: 'chainId parameter required'
      })
    }

    // Find subnet in available list
    const subnet = AVAILABLE_SUBNETS.find(s => s.chainId === chainId)
    
    if (!subnet) {
      return res.status(404).json({
        error: 'Subnet not found'
      })
    }

    // Get blockchain info from teleporter service
    const blockchainInfo = await teleporter.getBlockchainInfo(chainId as string)
    
    res.json({
      ...subnet,
      ...blockchainInfo
    })
  } catch (error: any) {
    console.error('Failed to get subnet info:', error)
    res.status(500).json({
      error: 'Failed to get subnet info',
      details: error.message
    })
  }
})

// Get subnet status
router.get('/status/:subnetId', async (req, res) => {
  try {
    const { subnetId } = req.params
    
    const subnet = AVAILABLE_SUBNETS.find(s => s.id === subnetId)
    
    if (!subnet) {
      return res.status(404).json({
        error: 'Subnet not found'
      })
    }

    // Mock status check
    const status = {
      id: subnet.id,
      name: subnet.name,
      isOnline: true,
      lastBlockTime: new Date().toISOString(),
      blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
      avgBlockTime: Math.random() * 2 + 1, // 1-3 seconds
      activeValidators: Math.floor(Math.random() * 50) + 10
    }

    res.json(status)
  } catch (error: any) {
    console.error('Failed to get subnet status:', error)
    res.status(500).json({
      error: 'Failed to get subnet status',
      details: error.message
    })
  }
})

// Get all subnet statuses
router.get('/status', async (req, res) => {
  try {
    const statuses = await Promise.all(
      AVAILABLE_SUBNETS.map(async (subnet) => {
        return {
          id: subnet.id,
          name: subnet.name,
          chainId: subnet.chainId,
          isOnline: true,
          blockHeight: Math.floor(Math.random() * 1000000) + 1000000,
          avgBlockTime: Math.random() * 2 + 1,
          lastUpdated: new Date().toISOString()
        }
      })
    )

    res.json(statuses)
  } catch (error: any) {
    console.error('Failed to get subnet statuses:', error)
    res.status(500).json({
      error: 'Failed to get subnet statuses',
      details: error.message
    })
  }
})

export default router