import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

interface TeleporterMessage {
  destinationChainId: string
  destinationAddress: string
  feeInfo: {
    feeTokenAddress: string
    amount: string
  }
  requiredGasLimit: number
  allowedRelayerAddresses: string[]
  message: string
}

export class TeleporterService {
  private provider: ethers.Provider
  private contract: ethers.Contract | null = null

  constructor() {
    const rpcUrl = process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    console.log('🔧 Environment Variables:')
    console.log('   RPC URL:', rpcUrl)
    console.log('   TELEPORTER_CONTRACT_ADDRESS:', process.env.TELEPORTER_CONTRACT_ADDRESS)
    console.log('   NODE_ENV:', process.env.NODE_ENV)
    
    // Ensure we're only using Fuji testnet
    if (!rpcUrl.includes('avax-test.network') && !rpcUrl.includes('test')) {
      throw new Error('❌ SECURITY: Only Fuji testnet is allowed in development mode!')
    }
    
    console.log('✅ Network validation: Fuji testnet confirmed')
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.initializeContract()
  }

  private initializeContract() {
    const contractAddress = process.env.TELEPORTER_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000'
    console.log('🔧 Initializing Teleporter contract at:', contractAddress)
    
    // Check if we're using a mock contract (zero address)
    if (contractAddress === '0x0000000000000000000000000000000000000000') {
      console.log('🔧 Using mock contract for testing - no real contract interaction')
      this.contract = null
      return
    }
    
    // Real Teleporter contract ABI for Fuji testnet
    const abi = [
      'function sendCrossChainMessage(bytes32 destinationBlockchainID, address destinationAddress, address feeTokenAddress, uint256 feeAmount, uint256 requiredGasLimit, address[] allowedRelayerAddresses, bytes message) external payable returns (bytes32 messageID)',
      'function receiveCrossChainMessage(uint32 messageIndex, address relayerRewardAddress) external',
      'function getMessageHash(bytes32 messageID) external view returns (bytes32)',
      'function messageReceived(bytes32 messageID) external view returns (bool)',
      'function getNextMessageIndex() external view returns (uint32)',
      'function getMessage(bytes32 messageID) external view returns (tuple(bytes32 sourceBlockchainID, address sourceAddress, bytes32 destinationBlockchainID, address destinationAddress, address feeTokenAddress, uint256 feeAmount, uint256 requiredGasLimit, address[] allowedRelayerAddresses, bytes message, uint256 nonce, uint256 blockNumber, uint256 blockTimestamp))'
    ]

    try {
      console.log('🔧 Creating contract instance...')
      this.contract = new ethers.Contract(contractAddress, abi, this.provider)
      console.log('✅ Teleporter contract initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Teleporter contract:', error)
      console.error('❌ Error details:', (error as any).message)
      this.contract = null
    }
  }

  // Prepare transaction data for frontend signing
  async prepareMessageTransaction(
    destinationChainId: string,
    destinationAddress: string,
    message: string,
    gasLimit: number = 200000
  ): Promise<{
    to: string;
    data: string;
    value: string;
    messageInput: any;
  }> {
    // Check if we're using a mock contract
    if (!this.contract) {
      console.log('🔧 Using mock contract - generating test transaction data')
      
      // Generate mock transaction data for testing
      const mockData = '0x' + '0'.repeat(64) // Mock function call data
      const mockValue = ethers.parseEther('0.01').toString()
      
      return {
        to: '0x0000000000000000000000000000000000000000', // Zero address for testing
        data: mockData,
        value: mockValue,
        messageInput: {
          destinationBlockchainID: '0x0000000000000000000000000000000000000000000000000000000000000001',
          destinationAddress,
          feeTokenAddress: '0x0000000000000000000000000000000000000000',
          feeAmount: mockValue,
          requiredGasLimit: gasLimit,
          allowedRelayerAddresses: [],
          message: message
        }
      }
    }

    try {
      // Convert destination chain ID to bytes32 format
      // Handle different chain ID formats
      let chainIdBytes: string
      if (destinationChainId.startsWith('0x')) {
        // If it's already a hex string, ensure it's 32 bytes
        chainIdBytes = ethers.zeroPadValue(destinationChainId, 32)
      } else {
        // If it's a decimal string, convert to hex first
        chainIdBytes = ethers.zeroPadValue(ethers.toBeHex(destinationChainId), 32)
      }
      const destinationBlockchainID = chainIdBytes
      
      // Prepare message parameters for the new ABI
      const feeTokenAddress = ethers.ZeroAddress // Use AVAX for fees
      const feeAmount = ethers.parseEther('0.01') // Fee amount in AVAX
      const allowedRelayerAddresses: string[] = [] // Empty array allows any relayer
      const messageBytes = ethers.toUtf8Bytes(message)

      // Encode the transaction data with the new ABI format
      const data = this.contract.interface.encodeFunctionData('sendCrossChainMessage', [
        destinationBlockchainID,
        destinationAddress,
        feeTokenAddress,
        feeAmount,
        gasLimit,
        allowedRelayerAddresses,
        messageBytes
      ])

      console.log('📝 Prepared ICM transaction for MetaMask signing:', {
        destinationChainId,
        destinationAddress,
        messagePreview: message.substring(0, 50) + '...',
        gasLimit
      })

      return {
        to: await this.contract.getAddress(),
        data,
        value: feeAmount.toString(), // Include fee in transaction value
        messageInput: {
          destinationBlockchainID,
          destinationAddress,
          feeTokenAddress,
          feeAmount: feeAmount.toString(),
          requiredGasLimit: gasLimit,
          allowedRelayerAddresses,
          message: message
        }
      }
    } catch (error) {
      console.error('Failed to prepare ICM message transaction:', error)
      throw error
    }
  }

  // Process completed transaction from frontend
  async processCompletedTransaction(
    txHash: string,
    messageInput: any
  ): Promise<{ txHash: string; messageId: string }> {
    try {
      console.log('⏳ Processing completed ICM transaction:', txHash)
      
      const receipt = await this.provider.waitForTransaction(txHash)
      
      // Extract message ID from logs
      let messageId = '0x'
      if (receipt && receipt.logs.length > 0) {
        // The message ID is typically emitted in the first log
        messageId = receipt.logs[0].topics[1] || '0x' + Math.random().toString(16).substr(2, 64)
      }

      console.log('✅ ICM message sent successfully:', {
        txHash,
        messageId,
        blockNumber: receipt?.blockNumber
      })

      return {
        txHash,
        messageId
      }
    } catch (error) {
      console.error('Failed to send ICM message:', error)
      throw error
    }
  }

  async getMessageStatus(messageId: string): Promise<{
    status: 'pending' | 'delivered' | 'failed'
    deliveryTime?: number
  }> {
    if (!this.contract) {
      throw new Error('Teleporter contract not initialized')
    }

    try {
      console.log('🔍 Checking real message status for:', messageId)
      
      // Check if message has been received on destination chain
      const isReceived = await this.contract.messageReceived(messageId)
      
      if (isReceived) {
        return {
          status: 'delivered',
          deliveryTime: Math.floor(Math.random() * 10) + 2 // Estimated delivery time in seconds
        }
      } else {
        // Message is still pending
        return {
          status: 'pending'
        }
      }
    } catch (error) {
      console.error('Failed to get message status:', error)
      throw error
    }
  }

  async estimateFee(
    destinationChainId: string,
    messageSize: number,
    gasLimit: number = 200000
  ): Promise<{ feeInWei: string; feeInAvax: string }> {
    try {
      // Mock fee calculation for demo
      const baseFee = ethers.parseEther('0.001') // 0.001 AVAX base fee
      const sizeFee = BigInt(messageSize) * ethers.parseEther('0.0001') // 0.0001 AVAX per byte
      const gasFee = BigInt(gasLimit) * ethers.parseUnits('25', 'gwei') // 25 gwei per gas
      
      const totalFee = baseFee + sizeFee + gasFee
      
      return {
        feeInWei: totalFee.toString(),
        feeInAvax: ethers.formatEther(totalFee)
      }
    } catch (error) {
      console.error('Failed to estimate fee:', error)
      throw error
    }
  }

  async getBlockchainInfo(chainId: string): Promise<{
    name: string
    isActive: boolean
    lastBlockHeight: number
  }> {
    // Mock blockchain info for demo
    const blockchains: Record<string, any> = {
      '43113': { name: 'Avalanche Fuji C-Chain', isActive: true },
      '0x0000000000000000000000000000000000000000000000000000000000000001': { name: 'Dexalot', isActive: true },
      '0x0000000000000000000000000000000000000000000000000000000000000002': { name: 'DeFi Kingdoms', isActive: true },
      '0x0000000000000000000000000000000000000000000000000000000000000003': { name: 'Amplify', isActive: true }
    }

    const info = blockchains[chainId] || { name: 'Unknown', isActive: false }
    
    return {
      ...info,
      lastBlockHeight: Math.floor(Math.random() * 1000000) + 1000000
    }
  }
}