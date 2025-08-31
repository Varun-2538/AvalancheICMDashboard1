import { useState, useEffect } from 'react'
import { useICM } from '@/hooks/useICM'
import { ChevronRightIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'

export function ICMHistory() {
  const { messages, getMessageHistory } = useICM()
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true)
      try {
        await getMessageHistory()
      } catch (error) {
        console.error('Failed to load message history:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [getMessageHistory])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-500" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Delivered'
      case 'failed':
        return 'Failed'
      case 'pending':
        return 'Pending'
      default:
        return 'Processing'
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredMessages = messages.filter(message => {
    if (filter === 'all') return true
    return message.status === filter
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Message History</h2>
        
        <div className="flex space-x-2">
          {['all', 'completed', 'pending', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === status
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto max-w-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? 'You haven\'t sent any ICM messages yet.' 
                : `No ${filter} messages found.`}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div key={message.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(message.status)}
                    <span className="text-sm font-medium text-gray-900">
                      {getStatusText(message.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.timestamp)}
                    </span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                
                <div className="mb-3">
                  <p className="text-gray-900 mb-1 truncate">{message.content}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>To: {message.recipient.slice(0, 10)}...{message.recipient.slice(-8)}</span>
                    <span className="mx-2">•</span>
                    <span>{message.destinationSubnet}</span>
                  </div>
                </div>
                
                {message.txHash && (
                  <div className="flex items-center text-xs text-gray-500">
                    <span>TX: </span>
                    <a 
                      href={`https://testnet.snowtrace.io/tx/${message.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-600 hover:text-red-700 ml-1"
                    >
                      {message.txHash.slice(0, 10)}...{message.txHash.slice(-8)}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}