import { useState, useEffect } from 'react'
import { useAvalanche } from '@/hooks/useAvalanche'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const DEFAULT_SUBNETS = [
  { id: 'fuji', name: 'Avalanche Fuji', chainId: '43113' },
  { id: 'dexalot', name: 'Dexalot', chainId: '0x2VCAhX6vE3UnXC6s1CBPE6jJ4c4cHWMfPgCptuWS59pQ8WYxXw' },
  { id: 'dfk', name: 'DeFi Kingdoms', chainId: '0x2rwhRKN8qfxK9AEJunfUjn5WH7PQzUPPQKCb59ak6fwsrwF2R' }
]

export function SubnetSelector() {
  const { getAvailableSubnets } = useAvalanche()
  const [selectedSubnet, setSelectedSubnet] = useState(DEFAULT_SUBNETS[0])
  const [availableSubnets, setAvailableSubnets] = useState(DEFAULT_SUBNETS)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadSubnets = async () => {
      try {
        const subnets = await getAvailableSubnets()
        setAvailableSubnets([...DEFAULT_SUBNETS, ...subnets])
      } catch (error) {
        console.error('Failed to load subnets:', error)
        // Use default subnets on error
        setAvailableSubnets(DEFAULT_SUBNETS)
      }
    }

    loadSubnets()
  }, [getAvailableSubnets])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors"
      >
        <span>{selectedSubnet.name}</span>
        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-1">
              {availableSubnets.map((subnet) => (
                <button
                  key={subnet.id}
                  onClick={() => {
                    setSelectedSubnet(subnet)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                >
                  {subnet.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}