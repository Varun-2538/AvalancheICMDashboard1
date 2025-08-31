import express from 'express'
import { L1DeployerService } from '../services/l1-deployer'

const router = express.Router()
const l1Deployer = new L1DeployerService()

// Deploy L1 subnet
router.post('/deploy', async (req, res) => {
  try {
    const { config, walletAddress } = req.body

    if (!config || !walletAddress) {
      return res.status(400).json({
        error: 'Missing required fields: config and walletAddress'
      })
    }

    // Simulate deployment process
    console.log('🚀 Starting L1 subnet deployment:', config.subnetName)

    const result = await l1Deployer.deploySubnet(config, walletAddress)

    res.json({
      success: true,
      deploymentId: result.deploymentId,
      subnetId: result.subnetId,
      rpcUrl: result.rpcUrl,
      explorerUrl: result.explorerUrl,
      status: 'completed'
    })
  } catch (error: any) {
    console.error('Failed to deploy L1 subnet:', error)
    res.status(500).json({
      error: 'Failed to deploy subnet',
      details: error.message
    })
  }
})

// Generate genesis file
router.post('/genesis', async (req, res) => {
  try {
    const { config, allocations } = req.body

    if (!config) {
      return res.status(400).json({
        error: 'Configuration is required'
      })
    }

    const genesis = await l1Deployer.generateGenesis(config, allocations || [])

    res.json(genesis)
  } catch (error: any) {
    console.error('Failed to generate genesis:', error)
    res.status(500).json({
      error: 'Failed to generate genesis',
      details: error.message
    })
  }
})

// Get deployment status
router.get('/status/:deploymentId', async (req, res) => {
  try {
    const { deploymentId } = req.params
    
    const status = await l1Deployer.getDeploymentStatus(deploymentId)
    
    res.json(status)
  } catch (error: any) {
    console.error('Failed to get deployment status:', error)
    res.status(500).json({
      error: 'Failed to get status',
      details: error.message
    })
  }
})

// List all deployments
router.get('/deployments', async (req, res) => {
  try {
    const { walletAddress } = req.query
    
    if (!walletAddress) {
      return res.status(400).json({
        error: 'Wallet address is required'
      })
    }

    const deployments = await l1Deployer.getDeployments(walletAddress as string)
    
    res.json(deployments)
  } catch (error: any) {
    console.error('Failed to get deployments:', error)
    res.status(500).json({
      error: 'Failed to get deployments',
      details: error.message
    })
  }
})

export default router