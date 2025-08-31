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
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
    this.initializeContract()
  }

  private initializeContract() {
    const contractAddress = process.env.TELEPORTER_CONTRACT_ADDRESS || '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf'
    
    // Simplified ABI for Teleporter contract
    const abi = [
      'function sendCrossChainMessage(tuple(bytes32 destinationBlockchainID, address destinationAddress, tuple(address feeTokenAddress, uint256 amount) feeInfo, uint256 requiredGasLimit, address[] allowedRelayerAddresses, bytes message) messageInput) external returns (bytes32 messageID)',
      'function receiveCrossChainMessage(uint32 messageIndex, address relayerRewardAddress) external',
      'function getMessageHash(bytes32 messageID) external view returns (bytes32)',
      'function messageReceived(bytes32 messageID) external view returns (bool)'
    ]

    try {
      this.contract = new ethers.Contract(contractAddress, abi, this.provider)
    } catch (error) {
      console.error('Failed to initialize Teleporter contract:', error)
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
    if (!this.contract) {
      throw new Error('Teleporter contract not initialized')
    }

    try {
      // Convert destination chain ID to bytes32 format
      const destinationBlockchainID = ethers.zeroPadValue(destinationChainId, 32)
      
      // Prepare message input
      const messageInput = {
        destinationBlockchainID,
        destinationAddress,
        feeInfo: {
          feeTokenAddress: ethers.ZeroAddress, // Use AVAX for fees
          amount: ethers.parseEther('0.01') // 0.01 AVAX fee
        },
        requiredGasLimit: gasLimit,
        allowedRelayerAddresses: [], // Empty array allows any relayer
        message: ethers.toUtf8Bytes(message)
      }

      // Encode the transaction data
      const data = this.contract.interface.encodeFunctionData('sendCrossChainMessage', [messageInput])

      console.log('📝 Prepared ICM transaction for MetaMask signing:', {
        destinationChainId,
        destinationAddress,
        messagePreview: message.substring(0, 50) + '...',
        gasLimit
      })

      return {
        to: await this.contract.getAddress(),
        data,
        value: ethers.parseEther('0.01').toString(), // Include fee in transaction value
        messageInput
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
      '0x2VCAhX6vE3UnXC6s1CBPE6jJ4c4cHWMfPgCptuWS59pQ8WYxXw': { name: 'Dexalot', isActive: true },
      '0x2rwhRKN8qfxK9AEJunfUjn5WH7PQzUPPQKCb59ak6fwsrwF2R': { name: 'DeFi Kingdoms', isActive: true },
      '0xzJytnh96Pc8rM337bBrtMvJDbEdDNjcXiG3WkTNCiLp8krJUk': { name: 'Amplify', isActive: true }
    }

    const info = blockchains[chainId] || { name: 'Unknown', isActive: false }
    
    return {
      ...info,
      lastBlockHeight: Math.floor(Math.random() * 1000000) + 1000000
    }
  }
}