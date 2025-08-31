import { useState } from 'react'
import { useL1Deployment } from '@/hooks/useL1Deployment'
import toast from 'react-hot-toast'

export function L1ConfigForm() {
  const { createConfiguration } = useL1Deployment()
  const [config, setConfig] = useState({
    subnetName: 'MyCustomSubnet',
    vmType: 'SubnetEVM',
    chainId: Math.floor(Math.random() * 1000000) + 1000000,
    gasLimit: 8000000,
    targetBlockRate: 2,
    minBaseFee: 1000000000,
    targetGas: 100000000,
    baseFeeChangeDenominator: 12,
    minBlockGasCost: 0,
    maxBlockGasCost: 10000000,
    blockGasCostStep: 200000
  })

  const [validators, setValidators] = useState([{
    nodeId: '',
    weight: 1000,
    startTime: '',
    endTime: ''
  }])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createConfiguration({
        ...config,
        validators
      })
      toast.success('L1 configuration created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create configuration')
    }
  }

  const addValidator = () => {
    setValidators([...validators, {
      nodeId: '',
      weight: 1000,
      startTime: '',
      endTime: ''
    }])
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">L1 Subnet Configuration</h2>
          <p className="text-gray-600">Configure your custom Avalanche L1 subnet parameters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subnet Name
              </label>
              <input
                type="text"
                value={config.subnetName}
                onChange={(e) => setConfig({ ...config, subnetName: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                VM Type
              </label>
              <select
                value={config.vmType}
                onChange={(e) => setConfig({ ...config, vmType: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="SubnetEVM">Subnet EVM</option>
                <option value="Custom">Custom VM</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chain ID
              </label>
              <input
                type="number"
                value={config.chainId}
                onChange={(e) => setConfig({ ...config, chainId: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gas Limit
              </label>
              <input
                type="number"
                value={config.gasLimit}
                onChange={(e) => setConfig({ ...config, gasLimit: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Block Rate (seconds)
              </label>
              <input
                type="number"
                value={config.targetBlockRate}
                onChange={(e) => setConfig({ ...config, targetBlockRate: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Base Fee (wei)
              </label>
              <input
                type="number"
                value={config.minBaseFee}
                onChange={(e) => setConfig({ ...config, minBaseFee: parseInt(e.target.value) })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
          </div>

          {/* Validators Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Validators</h3>
              <button
                type="button"
                onClick={addValidator}
                className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200"
              >
                Add Validator
              </button>
            </div>

            {validators.map((validator, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Node ID
                    </label>
                    <input
                      type="text"
                      value={validator.nodeId}
                      onChange={(e) => {
                        const newValidators = [...validators]
                        newValidators[index].nodeId = e.target.value
                        setValidators(newValidators)
                      }}
                      placeholder="NodeID-..."
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Weight
                    </label>
                    <input
                      type="number"
                      value={validator.weight}
                      onChange={(e) => {
                        const newValidators = [...validators]
                        newValidators[index].weight = parseInt(e.target.value)
                        setValidators(newValidators)
                      }}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all"
          >
            Create L1 Configuration
          </button>
        </form>
      </div>
    </div>
  )
}