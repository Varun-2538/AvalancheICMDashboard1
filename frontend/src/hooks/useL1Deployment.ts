import { useState, useCallback } from 'react'
import { useWallet } from './useWallet'

interface L1Configuration {
  id: string
  subnetName: string
  vmType: string
  chainId: number
  gasLimit: number
  targetBlockRate: number
  minBaseFee: number
  validators: Array<{
    nodeId: string
    weight: number
    startTime: string
    endTime: string
  }>
  status: 'configured' | 'deploying' | 'completed' | 'failed'
  createdAt: string
  deployedAt?: string
}

export function useL1Deployment() {
  const { address } = useWallet()
  const [deployments, setDeployments] = useState<L1Configuration[]>([])
  const [isDeploying, setIsDeploying] = useState(false)

  const createConfiguration = useCallback(async (config: any) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    const newConfig: L1Configuration = {
      id: Date.now().toString(),
      ...config,
      status: 'configured',
      createdAt: new Date().toISOString()
    }

    setDeployments(prev => [...prev, newConfig])
    return newConfig
  }, [address])

  const deploySubnet = useCallback(async (config: L1Configuration) => {
    if (!address) {
      throw new Error('Wallet not connected')
    }

    setIsDeploying(true)
    
    try {
      // Update status to deploying
      setDeployments(prev => prev.map(d => 
        d.id === config.id ? { ...d, status: 'deploying' as const } : d
      ))

      const response = await fetch('/api/l1-deployment/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config,
          walletAddress: address
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to deploy subnet')
      }

      const result = await response.json()
      
      // Update status to completed
      setDeployments(prev => prev.map(d => 
        d.id === config.id ? { 
          ...d, 
          status: 'completed' as const,
          deployedAt: new Date().toISOString(),
          ...result 
        } : d
      ))

      return result
    } catch (error) {
      // Update status to failed
      setDeployments(prev => prev.map(d => 
        d.id === config.id ? { ...d, status: 'failed' as const } : d
      ))
      throw error
    } finally {
      setIsDeploying(false)
    }
  }, [address])

  const generateGenesis = useCallback(async (params: {
    config: L1Configuration
    allocations: Array<{ address: string; balance: string }>
  }) => {
    const response = await fetch('/api/l1-deployment/genesis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error('Failed to generate genesis')
    }

    return await response.json()
  }, [])

  const exportGenesis = useCallback((genesisData: any) => {
    const blob = new Blob([JSON.stringify(genesisData, null, 2)], { 
      type: 'application/json' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'genesis.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])

  const getDeploymentStatus = useCallback(async (deploymentId: string) => {
    try {
      const response = await fetch(`/api/l1-deployment/status/${deploymentId}`)
      if (!response.ok) {
        throw new Error('Failed to get deployment status')
      }
      
      const status = await response.json()
      
      // Update local state
      setDeployments(prev => prev.map(d => 
        d.id === deploymentId ? { ...d, ...status } : d
      ))
      
      return status
    } catch (error) {
      console.error('Failed to get deployment status:', error)
    }
  }, [])

  return {
    deployments,
    isDeploying,
    createConfiguration,
    deploySubnet,
    generateGenesis,
    exportGenesis,
    getDeploymentStatus
  }
}