import { useState, useEffect } from 'react'
import { useL1Deployment } from '@/hooks/useL1Deployment'
import { CheckCircleIcon, ClockIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/outline'

export function SubnetDeployment() {
  const { deployments, deploySubnet, getDeploymentStatus } = useL1Deployment()
  const [selectedDeployment, setSelectedDeployment] = useState<any>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const handleDeploy = async (config: any) => {
    setIsDeploying(true)
    try {
      await deploySubnet(config)
    } catch (error) {
      console.error('Deployment failed:', error)
    } finally {
      setIsDeploying(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-6 h-6 text-red-500" />
      case 'deploying':
        return <ClockIcon className="w-6 h-6 text-yellow-500 animate-spin" />
      default:
        return <ClockIcon className="w-6 h-6 text-gray-400" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subnet Deployment</h2>
        <p className="text-gray-600">Deploy and manage your custom Avalanche L1 subnets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deployment List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurations</h3>
            
            {deployments.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">🏗️</span>
                </div>
                <p className="text-gray-600">No configurations yet</p>
                <p className="text-sm text-gray-500">Create one in the Configure tab</p>
              </div>
            ) : (
              <div className="space-y-3">
                {deployments.map((deployment) => (
                  <div 
                    key={deployment.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedDeployment?.id === deployment.id
                        ? 'border-purple-300 bg-purple-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedDeployment(deployment)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{deployment.subnetName}</h4>
                      {getStatusIcon(deployment.status)}
                    </div>
                    <p className="text-xs text-gray-600">Chain ID: {deployment.chainId}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(deployment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Deployment Details */}
        <div className="lg:col-span-2">
          {selectedDeployment ? (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedDeployment.subnetName}</h3>
                  <p className="text-gray-600">VM: {selectedDeployment.vmType}</p>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedDeployment.status)}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {selectedDeployment.status}
                  </span>
                </div>
              </div>

              {/* Configuration Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Chain ID</p>
                  <p className="font-semibold">{selectedDeployment.chainId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Gas Limit</p>
                  <p className="font-semibold">{selectedDeployment.gasLimit?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Block Rate</p>
                  <p className="font-semibold">{selectedDeployment.targetBlockRate}s</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Min Base Fee</p>
                  <p className="font-semibold">{selectedDeployment.minBaseFee} wei</p>
                </div>
              </div>

              {/* Validators */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Validators</h4>
                <div className="space-y-2">
                  {selectedDeployment.validators?.map((validator: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm text-gray-600">
                        {validator.nodeId || `Validator ${index + 1}`}
                      </span>
                      <span className="text-sm font-medium">Weight: {validator.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deployment Actions */}
              <div className="flex space-x-3">
                {selectedDeployment.status === 'configured' && (
                  <button
                    onClick={() => handleDeploy(selectedDeployment)}
                    disabled={isDeploying}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlayIcon className="w-4 h-4" />
                    <span>{isDeploying ? 'Deploying...' : 'Deploy Subnet'}</span>
                  </button>
                )}
                
                {selectedDeployment.status === 'completed' && (
                  <div className="flex space-x-2">
                    <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm hover:bg-green-200">
                      View Explorer
                    </button>
                    <button className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm hover:bg-blue-200">
                      Export Config
                    </button>
                  </div>
                )}
              </div>

              {/* Deployment Progress */}
              {selectedDeployment.status === 'deploying' && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <h5 className="font-medium text-yellow-800 mb-2">Deployment in Progress</h5>
                  <div className="space-y-2 text-sm text-yellow-700">
                    <div>✅ Configuration validated</div>
                    <div>✅ Genesis file created</div>
                    <div>🔄 Subnet deployment initiated...</div>
                    <div>⏳ Waiting for validator confirmation</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Configuration</h3>
              <p className="text-gray-600">Choose a subnet configuration from the list to view details and deploy</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}