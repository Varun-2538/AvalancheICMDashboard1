import { useCallback } from 'react'
import { useWallet } from './useWallet'

export function useAvalanche() {
  const { address } = useWallet()

  const getSubnetInfo = useCallback(async (chainId: string) => {
    try {
      const response = await fetch(`/api/subnets/info?chainId=${chainId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch subnet info')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch subnet info:', error)
      throw error
    }
  }, [])

  const getAvailableSubnets = useCallback(async () => {
    try {
      const response = await fetch('/api/subnets/available')
      if (!response.ok) {
        throw new Error('Failed to fetch available subnets')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to fetch available subnets:', error)
      throw error
    }
  }, [])

  const estimateICMFee = useCallback(async (destinationChainId: string, messageSize: number) => {
    try {
      const response = await fetch('/api/icm/estimate-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          destinationChainId,
          messageSize,
          senderAddress: address
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to estimate ICM fee')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Failed to estimate ICM fee:', error)
      throw error
    }
  }, [address])

  return {
    getSubnetInfo,
    getAvailableSubnets,
    estimateICMFee
  }
}