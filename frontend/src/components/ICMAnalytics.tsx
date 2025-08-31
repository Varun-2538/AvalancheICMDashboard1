import { useState, useEffect } from 'react'
import { useICM } from '@/hooks/useICM'

export function ICMAnalytics() {
  const { getAnalytics } = useICM()
  const [analytics, setAnalytics] = useState({
    messagesBySubnet: [],
    messagesByDay: [],
    averageDeliveryTime: 0,
    totalVolume: 0
  })

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalytics()
        setAnalytics(data)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      }
    }

    loadAnalytics()
  }, [getAnalytics])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
        <p className="text-gray-600">Detailed insights into your ICM messaging activity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages by Subnet */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Messages by Subnet</h3>
          <div className="space-y-3">
            {analytics.messagesBySubnet.map((subnet: any) => (
              <div key={subnet.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">{subnet.name}</span>
                </div>
                <div className="text-sm text-gray-600">{subnet.count} messages</div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg. Delivery Time</span>
              <span className="text-sm text-gray-900">{analytics.averageDeliveryTime}s</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Volume</span>
              <span className="text-sm text-gray-900">{analytics.totalVolume} AVAX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}