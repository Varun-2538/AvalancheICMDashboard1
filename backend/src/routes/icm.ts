import express from 'express'
import { TeleporterService } from '../services/teleporter'
import { AvalancheService } from '../services/avalanche'

const router = express.Router()
const teleporter = new TeleporterService()
const avalanche = new AvalancheService()

// In-memory storage for message history (replace with database in production)
const messageHistory: any[] = []
const messageStats: Record<string, any> = {}

// Send ICM message
router.post('/send', async (req, res) => {
  try {
    const {
      sourceChain,
      destinationChainId,
      recipient,
      message,
      amount,
      walletAddress
    } = req.body

    // Validate inputs
    if (!destinationChainId || !recipient || !message || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields'
      })
    }

    // Validate recipient address
    const isValidAddress = await avalanche.validateAddress(recipient)
    if (!isValidAddress) {
      return res.status(400).json({
        error: 'Invalid recipient address'
      })
    }

    // Prepare transaction for MetaMask signing
    console.log('📝 Preparing ICM transaction for MetaMask signing...')
    const transactionData = await teleporter.prepareMessageTransaction(
      destinationChainId,
      recipient,
      message,
      200000
    )

    // Return transaction data for frontend to sign with MetaMask
    res.json({
      success: true,
      message: 'Transaction prepared for MetaMask signing',
      transactionData: {
        to: transactionData.to,
        data: transactionData.data,
        value: transactionData.value
      },
      messageInput: transactionData.messageInput,
      fee: '0.01 AVAX',
      estimatedDeliveryTime: '2-5 seconds'
    })
  } catch (error: any) {
    console.error('Failed to send ICM message:', error)
    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    })
  }
})

// Process completed transaction from MetaMask
router.post('/complete', async (req, res) => {
  try {
    const {
      txHash,
      messageInput,
      sourceChain,
      destinationChainId,
      recipient,
      message,
      amount,
      walletAddress
    } = req.body

    if (!txHash || !messageInput || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields: txHash, messageInput, walletAddress'
      })
    }

    // Process the completed transaction
    console.log('⏳ Processing completed ICM transaction:', txHash)
    const result = await teleporter.processCompletedTransaction(txHash, messageInput)

    // Store message in history
    const messageRecord = {
      id: result.messageId,
      sourceChain,
      destinationChainId,
      recipient,
      message,
      amount,
      walletAddress,
      txHash: result.txHash,
      messageId: result.messageId,
      status: 'pending',
      timestamp: new Date().toISOString()
    }

    messageHistory.push(messageRecord)

    // Update stats
    if (!messageStats[walletAddress]) {
      messageStats[walletAddress] = { sent: 0, received: 0, pending: 0 }
    }
    messageStats[walletAddress].sent++
    messageStats[walletAddress].pending++

    res.json({
      success: true,
      message: 'ICM message processed successfully',
      messageId: result.messageId,
      txHash: result.txHash
    })
  } catch (error: any) {
    console.error('Failed to process completed ICM message:', error)
    res.status(500).json({
      error: 'Failed to process completed message',
      details: error.message
    })
  }
})

// Get message status
router.get('/status/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params
    
    const status = await teleporter.getMessageStatus(messageId)
    
    // Update message in mock database
    const messageIndex = messageHistory.findIndex(m => m.messageId === messageId)
    if (messageIndex !== -1) {
      messageHistory[messageIndex].status = status.status
      messageHistory[messageIndex].deliveryTime = status.deliveryTime
    }
    
    res.json(status)
  } catch (error: any) {
    console.error('Failed to get message status:', error)
    res.status(500).json({
      error: 'Failed to get status',
      details: error.message
    })
  }
})

// Get message history for address
router.get('/history', async (req, res) => {
  try {
    const { address } = req.query
    
    if (!address) {
      return res.status(400).json({
        error: 'Address parameter required'
      })
    }

    const userMessages = messageHistory.filter(m => 
      m.walletAddress.toLowerCase() === (address as string).toLowerCase()
    )

    // Mock some additional historical data
    const mockMessages = [
      {
        id: 'mock-1',
        content: 'Hello from C-Chain to Dexalot!',
        recipient: '0x742d35Cc6634C0532925a3b8D427b2C0ef46c',
        destinationSubnet: 'Dexalot',
        status: 'completed',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        txHash: '0xabcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234'
      },
      {
        id: 'mock-2',
        content: 'Cross-chain message test',
        recipient: '0x123456789abcdef123456789abcdef123456789ab',
        destinationSubnet: 'DeFi Kingdoms',
        status: 'completed',
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        txHash: '0xefgh5678901234efgh5678901234efgh5678901234efgh5678901234efgh5678'
      }
    ]

    const allMessages = [...userMessages, ...mockMessages]
    
    res.json(allMessages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ))
  } catch (error: any) {
    console.error('Failed to get message history:', error)
    res.status(500).json({
      error: 'Failed to get history',
      details: error.message
    })
  }
})

// Get stats for address
router.get('/stats', async (req, res) => {
  try {
    const { address } = req.query
    
    if (!address) {
      return res.status(400).json({
        error: 'Address parameter required'
      })
    }

    const userMessages = messageHistory.filter(m => 
      m.walletAddress.toLowerCase() === (address as string).toLowerCase()
    )

    const totalSent = userMessages.length + 2 // Include mock messages
    const completedMessages = userMessages.filter(m => m.status === 'completed').length + 2
    const pendingMessages = userMessages.filter(m => m.status === 'pending').length
    const successRate = totalSent > 0 ? Math.round((completedMessages / totalSent) * 100) : 0

    res.json({
      totalSent,
      totalReceived: Math.floor(totalSent * 0.8), // Mock received messages
      pendingMessages,
      successRate
    })
  } catch (error: any) {
    console.error('Failed to get stats:', error)
    res.status(500).json({
      error: 'Failed to get stats',
      details: error.message
    })
  }
})

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const { address } = req.query
    
    if (!address) {
      return res.status(400).json({
        error: 'Address parameter required'
      })
    }

    // Mock analytics data
    const analytics = {
      messagesBySubnet: [
        { name: 'Dexalot', count: 5 },
        { name: 'DeFi Kingdoms', count: 3 },
        { name: 'Amplify', count: 2 }
      ],
      messagesByDay: [
        { date: '2024-01-01', count: 2 },
        { date: '2024-01-02', count: 4 },
        { date: '2024-01-03', count: 3 }
      ],
      averageDeliveryTime: 2.5, // seconds
      totalVolume: 1.25 // AVAX
    }

    res.json(analytics)
  } catch (error: any) {
    console.error('Failed to get analytics:', error)
    res.status(500).json({
      error: 'Failed to get analytics',
      details: error.message
    })
  }
})

// Estimate ICM fee
router.post('/estimate-fee', async (req, res) => {
  try {
    const { destinationChainId, messageSize } = req.body
    
    if (!destinationChainId || typeof messageSize !== 'number') {
      return res.status(400).json({
        error: 'destinationChainId and messageSize are required'
      })
    }

    const feeEstimate = await teleporter.estimateFee(
      destinationChainId,
      messageSize,
      200000 // Default gas limit
    )

    res.json(feeEstimate)
  } catch (error: any) {
    console.error('Failed to estimate fee:', error)
    res.status(500).json({
      error: 'Failed to estimate fee',
      details: error.message
    })
  }
})

export default router