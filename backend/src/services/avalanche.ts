import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

export class AvalancheService {
  private provider: ethers.Provider

  constructor() {
    const rpcUrl = process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
  }

  async getNetworkInfo(): Promise<{
    chainId: number
    blockNumber: number
    gasPrice: string
    isHealthy: boolean
  }> {
    try {
      const network = await this.provider.getNetwork()
      const blockNumber = await this.provider.getBlockNumber()
      const feeData = await this.provider.getFeeData()
      
      return {
        chainId: Number(network.chainId),
        blockNumber,
        gasPrice: feeData.gasPrice?.toString() || '0',
        isHealthy: true
      }
    } catch (error) {
      console.error('Failed to get network info:', error)
      return {
        chainId: 43113,
        blockNumber: 0,
        gasPrice: '0',
        isHealthy: false
      }
    }
  }

  async getBalance(address: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Failed to get balance:', error)
      return '0'
    }
  }

  async getTransaction(txHash: string): Promise<any> {
    try {
      const tx = await this.provider.getTransaction(txHash)
      const receipt = await this.provider.getTransactionReceipt(txHash)
      
      return {
        transaction: tx,
        receipt
      }
    } catch (error) {
      console.error('Failed to get transaction:', error)
      throw error
    }
  }

  async validateAddress(address: string): boolean {
    try {
      return ethers.isAddress(address)
    } catch {
      return false
    }
  }

  getExplorerUrl(txHash: string): string {
    return `https://testnet.snowtrace.io/tx/${txHash}`
  }

  getAddressExplorerUrl(address: string): string {
    return `https://testnet.snowtrace.io/address/${address}`
  }
}