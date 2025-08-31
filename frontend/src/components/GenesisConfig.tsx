import { useState, useEffect } from 'react'
import { useL1Deployment } from '@/hooks/useL1Deployment'

export function GenesisConfig() {
  const { deployments, generateGenesis, exportGenesis } = useL1Deployment()
  const [selectedConfig, setSelectedConfig] = useState<any>(null)
  const [genesisData, setGenesisData] = useState<any>(null)
  const [allocations, setAllocations] = useState([{
    address: '',
    balance: '1000000000000000000000' // 1000 ETH in wei
  }])

  const handleGenerateGenesis = async () => {
    if (!selectedConfig) return

    try {
      const genesis = await generateGenesis({
        config: selectedConfig,
        allocations: allocations.filter(a => a.address && a.balance)
      })
      setGenesisData(genesis)
    } catch (error) {
      console.error('Failed to generate genesis:', error)
    }
  }

  const addAllocation = () => {
    setAllocations([...allocations, {
      address: '',
      balance: '1000000000000000000000'
    }])
  }

  const removeAllocation = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Genesis Configuration</h2>
        <p className="text-gray-600">Configure genesis block and initial token allocation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Selection */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Configuration</h3>
            
            <div className="space-y-3 mb-6">
              {deployments.map((deployment) => (
                <div 
                  key={deployment.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedConfig?.id === deployment.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedConfig(deployment)}
                >
                  <h4 className="font-medium text-gray-900">{deployment.subnetName}</h4>
                  <p className="text-sm text-gray-600">Chain ID: {deployment.chainId}</p>
                </div>
              ))}
            </div>

            {selectedConfig && (
              <>
                <h4 className="font-semibold text-gray-900 mb-3">Token Allocations</h4>
                <div className="space-y-3 mb-4">
                  {allocations.map((allocation, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="0x..."
                        value={allocation.address}
                        onChange={(e) => {
                          const newAllocations = [...allocations]
                          newAllocations[index].address = e.target.value
                          setAllocations(newAllocations)
                        }}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Balance (wei)"
                        value={allocation.balance}
                        onChange={(e) => {
                          const newAllocations = [...allocations]
                          newAllocations[index].balance = e.target.value
                          setAllocations(newAllocations)
                        }}
                        className="w-32 p-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        onClick={() => removeAllocation(index)}
                        className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={addAllocation}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-sm hover:bg-purple-200"
                  >
                    Add Allocation
                  </button>
                  <button
                    onClick={handleGenerateGenesis}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-1 rounded text-sm hover:from-purple-600 hover:to-indigo-600"
                  >
                    Generate Genesis
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Genesis Preview */}
        <div>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Genesis JSON</h3>
              {genesisData && (
                <button
                  onClick={() => exportGenesis(genesisData)}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm hover:bg-green-200"
                >
                  Download
                </button>
              )}
            </div>

            {genesisData ? (
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                <pre>{JSON.stringify(genesisData, null, 2)}</pre>
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl">📄</span>
                </div>
                <p className="text-gray-600">Select a configuration and generate genesis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}