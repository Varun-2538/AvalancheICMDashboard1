// Check ICM Message Status and History
const API_BASE = 'http://localhost:3001'
const TEST_WALLET_ADDRESS = '0x2129b880124f9f867dCc080f3272b6CaaBDD5850'
const TX_HASH = '0x7e9397c14f3f1daf6152470f839ad13bfe6e9ba2a1c9b57385b38055b3c058d3'

async function checkICMMessage() {
  console.log('🔍 Checking ICM Message Status and History...')
  console.log('📍 API Base:', API_BASE)
  console.log('👛 Wallet Address:', TEST_WALLET_ADDRESS)
  console.log('📝 Transaction Hash:', TX_HASH)
  console.log('')

  try {
    // 1. Check Message History
    console.log('📚 Checking Message History...')
    const historyResponse = await fetch(`${API_BASE}/api/icm/history?address=${TEST_WALLET_ADDRESS}`)
    
    if (historyResponse.ok) {
      const history = await historyResponse.json()
      console.log(`✅ Found ${history.length} messages in history`)
      
      history.forEach((msg, index) => {
        console.log(`\n📨 Message ${index + 1}:`)
        console.log(`   ID: ${msg.id}`)
        console.log(`   Content: ${msg.content || msg.message || 'N/A'}`)
        console.log(`   Recipient: ${msg.recipient}`)
        console.log(`   Destination: ${msg.destinationSubnet || msg.destinationChainId}`)
        console.log(`   Status: ${msg.status}`)
        console.log(`   Timestamp: ${msg.timestamp}`)
        if (msg.txHash) console.log(`   TX Hash: ${msg.txHash}`)
        if (msg.messageId) console.log(`   Message ID: ${msg.messageId}`)
      })
    } else {
      console.log('❌ Failed to get message history')
    }

    // 2. Check Message Stats
    console.log('\n📊 Checking Message Stats...')
    const statsResponse = await fetch(`${API_BASE}/api/icm/stats?address=${TEST_WALLET_ADDRESS}`)
    
    if (statsResponse.ok) {
      const stats = await statsResponse.json()
      console.log('✅ Message Statistics:')
      console.log(`   Total Sent: ${stats.totalSent}`)
      console.log(`   Total Received: ${stats.totalReceived}`)
      console.log(`   Pending: ${stats.pendingMessages}`)
      console.log(`   Success Rate: ${stats.successRate}%`)
    } else {
      console.log('❌ Failed to get message stats')
    }

    // 3. Check Analytics
    console.log('\n📈 Checking Message Analytics...')
    const analyticsResponse = await fetch(`${API_BASE}/api/icm/analytics?address=${TEST_WALLET_ADDRESS}`)
    
    if (analyticsResponse.ok) {
      const analytics = await analyticsResponse.json()
      console.log('✅ Message Analytics:')
      console.log(`   Messages by Subnet:`, analytics.messagesBySubnet)
      console.log(`   Average Delivery Time: ${analytics.averageDeliveryTime} seconds`)
      console.log(`   Total Volume: ${analytics.totalVolume} AVAX`)
    } else {
      console.log('❌ Failed to get message analytics')
    }

  } catch (error) {
    console.error('❌ Error checking ICM message:', error.message)
  }
}

// Run the check
checkICMMessage()
