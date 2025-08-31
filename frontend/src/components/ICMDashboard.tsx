import { useState, useEffect } from 'react'
import { useICM } from '@/hooks/useICM'
import { ChartBarIcon, PaperAirplaneIcon, InboxIcon, ClockIcon } from '@heroicons/react/24/outline'

export function ICMDashboard() {
  const { messages, getStats } = useICM()
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0, 
    pendingMessages: 0,
    successRate: 0
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStats()
        setStats(data)
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }

    loadStats()
  }, [getStats, messages])

  const statCards = [
    {
      title: 'Messages Sent',
      value: stats.totalSent,
      icon: PaperAirplaneIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Messages Received', 
      value: stats.totalReceived,
      icon: InboxIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Pending',
      value: stats.pendingMessages,
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      title: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: ChartBarIcon,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  const recentMessages = messages.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <div key={stat.title} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
        
        {recentMessages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">📬</span>
            </div>
            <p className="text-gray-600">No recent messages</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMessages.map((message) => (
              <div key={message.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    To {message.destinationSubnet} • {new Date(message.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  message.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : message.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {message.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Network Status */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['C-Chain', 'Dexalot', 'DeFi Kingdoms'].map((network) => (
            <div key={network} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-900">{network}</span>
              </div>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}