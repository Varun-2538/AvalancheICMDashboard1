import { useState, useEffect, useCallback } from 'react'

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<string | null>(null)

  const FUJI_CHAIN_ID = '0xa869' // 43113 in hex

  const checkConnection = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) return

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts.length > 0) {
        setIsConnected(true)
        setAddress(accounts[0])
        
        const currentChainId = await window.ethereum.request({ method: 'eth_chainId' })
        setChainId(currentChainId)
      }
    } catch (error) {
      console.error('Failed to check wallet connection:', error)
    }
  }, [])

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
        } else {
          setAddress(null)
          setIsConnected(false)
        }
      })

      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(newChainId)
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged')
        window.ethereum.removeAllListeners('chainChanged')
      }
    }
  }, [checkConnection])

  const connect = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  const disconnect = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
  }

  const switchToFuji = async () => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: FUJI_CHAIN_ID }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: FUJI_CHAIN_ID,
                chainName: 'Avalanche Fuji Testnet',
                nativeCurrency: {
                  name: 'AVAX',
                  symbol: 'AVAX',
                  decimals: 18,
                },
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/'],
              },
            ],
          })
        } catch (addError) {
          console.error('Failed to add Fuji network:', addError)
          throw addError
        }
      } else {
        console.error('Failed to switch to Fuji network:', switchError)
        throw switchError
      }
    }
  }

  return {
    isConnected,
    address,
    chainId,
    connect,
    disconnect,
    switchToFuji,
    isOnFuji: chainId === FUJI_CHAIN_ID
  }
}