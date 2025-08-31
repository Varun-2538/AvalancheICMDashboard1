// Complete ICM Message Processing
const API_BASE = 'http://localhost:3001'
const TEST_WALLET_ADDRESS = '0x2129b880124f9f867dCc080f3272b6CaaBDD5850'
const TX_HASH = '0x7e9397c14f3f1daf6152470f839ad13bfe6e9ba2a1c9b57385b38055b3c058d3'

async function completeICMMessage() {
  console.log('🔧 Completing ICM Message Processing...')
  console.log('📍 API Base:', API_BASE)
  console.log('👛 Wallet Address:', TEST_WALLET_ADDRESS)
  console.log('📝 Transaction Hash:', TX_HASH)
  console.log('')

  try {
    // Complete the ICM message processing
    console.log('📝 Calling /complete endpoint...')
    const completeResponse = await fetch(`${API_BASE}/api/icm/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: TX_HASH,
        messageInput: {
          destinationBlockchainID: '0x0000000000000000000000000000000000000000000000000000000000000001',
          destinationAddress: TEST_WALLET_ADDRESS,
          feeTokenAddress: '0x0000000000000000000000000000000000000000',
          feeAmount: '10000000000000000',
          requiredGasLimit: 200000,
          allowedRelayerAddresses: [],
          message: 'Test message from frontend test script'
        },
        sourceChain: 'C',
        destinationChainId: '0x0000000000000000000000000000000000000000000000000000000000000001',
        recipient: TEST_WALLET_ADDRESS,
        message: 'Test message from frontend test script',
        amount: '0.02',
        walletAddress: TEST_WALLET_ADDRESS
      })
    })

    if (completeResponse.ok) {
      const result = await completeResponse.json()
      console.log('✅ Message completion successful:')
      console.log(`   Message ID: ${result.messageId}`)
      console.log(`   TX Hash: ${result.txHash}`)
      console.log(`   Status: ${result.message}`)
    } else {
      const error = await completeResponse.json()
      console.log('❌ Failed to complete message:')
      console.log(`   Error: ${error.error}`)
      if (error.details) console.log(`   Details: ${error.details}`)
    }

    // Now check the message history again
    console.log('\n📚 Checking Updated Message History...')
    const historyResponse = await fetch(`${API_BASE}/api/icm/history?address=${TEST_WALLET_ADDRESS}`)
    
    if (historyResponse.ok) {
      const history = await historyResponse.json()
      console.log(`✅ Found ${history.length} messages in history`)
      
      // Find our real message
      const realMessage = history.find(msg => msg.txHash === TX_HASH)
      if (realMessage) {
        console.log('\n🎯 Found Your Real Message:')
        console.log(`   ID: ${realMessage.id}`)
        console.log(`   Content: ${realMessage.content || realMessage.message || 'N/A'}`)
        console.log(`   Recipient: ${realMessage.recipient}`)
        console.log(`   Destination: ${realMessage.destinationSubnet || realMessage.destinationChainId}`)
        console.log(`   Status: ${realMessage.status}`)
        console.log(`   Timestamp: ${realMessage.timestamp}`)
        console.log(`   TX Hash: ${realMessage.txHash}`)
        if (realMessage.messageId) console.log(`   Message ID: ${realMessage.messageId}`)
      } else {
        console.log('\n❌ Your real message not found in history')
        console.log('Available messages:')
        history.forEach((msg, index) => {
          console.log(`   ${index + 1}. ${msg.content || msg.message || 'N/A'} - ${msg.txHash}`)
        })
      }
    } else {
      console.log('❌ Failed to get updated message history')
    }

  } catch (error) {
    console.error('❌ Error completing ICM message:', error.message)
  }
}

// Run the completion
completeICMMessage()
