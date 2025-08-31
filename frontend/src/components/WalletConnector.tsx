import { useState } from 'react'
import { useWallet } from '@/hooks/useWallet'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export function WalletConnector() {
  const { isConnected, address, connect, disconnect, switchToFuji } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
      await switchToFuji()
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected) {
    return (
      <div className="relative group">
        <button className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200 hover:bg-green-200 transition-colors">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="font-medium">{formatAddress(address!)}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-2">
            <button
              onClick={disconnect}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </button>
  )
}