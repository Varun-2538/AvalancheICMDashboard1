import { useState, useEffect } from 'react'
import { useICM } from '@/hooks/useICM'
import { CalendarDaysIcon, ClockIcon, CurrencyDollarIcon, ChartBarIcon, TrendingUpIcon, TrendingDownIcon } from '@heroicons/react/24/outline'

interface AnalyticsData {
  messagesBySubnet: Array<{ name: string; count: number; color: string }>
  messagesByDay: Array<{ date: string; count: number }>
  averageDeliveryTime: number
  totalVolume: number
  totalMessages: number
  successRate: number
  messagesByStatus: Array<{ status: string; count: number; color: string }>
}

export function ICMAnalytics() {
  const { getAnalytics } = useICM()
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    messagesBySubnet: [],
    messagesByDay: [],
    averageDeliveryTime: 0,
    totalVolume: 0,
    totalMessages: 0,
    successRate: 0,
    messagesByStatus: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true)
      try {
        // Mock data for demonstration - replace with actual API call
        const mockData: AnalyticsData = {
          messagesBySubnet: [
            { name: 'Dexalot', count: 245, color: '#3b82f6' },
            { name: 'DeFi Kingdoms', count: 189, color: '#10b981' },
            { name: 'Amplify', count: 156, color: '#f59e0b' },
            { name: 'Custom Subnet', count: 67, color: '#ef4444' }
          ],
          messagesByDay: Array.from({ length: 30 }, (_, i) => ({
            date: format(subDays(new Date(), 29 - i), 'yyyy-MM-dd'),
            count: Math.floor(Math.random() * 20) + 5
          })),
          averageDeliveryTime: 2.3,
          totalVolume: 1250.75,
          totalMessages: 657,
          successRate: 98.7,
          messagesByStatus: [
            { status: 'Delivered', count: 647, color: '#10b981' },
            { status: 'Pending', count: 8, color: '#f59e0b' },
            { status: 'Failed', count: 2, color: '#ef4444' }
          ]
        }

        // Uncomment when backend API is ready
        // const data = await getAnalytics()
        setAnalytics(mockData)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [getAnalytics, timeRange])

  const getFilteredDays = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
    return analytics.messagesByDay.slice(-days)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Comprehensive insights into your cross-chain messaging activity</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalMessages.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+12.5%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-6 h-6 text-success-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+0.8%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Delivery Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.averageDeliveryTime}s</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-warning-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">-0.2s</span>
            <span className="text-sm text-gray-500 ml-2">improvement</span>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVolume.toFixed(2)}</p>
              <p className="text-xs text-gray-500">AVAX transferred</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <CurrencyDollarIcon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-green-600 font-medium">+8.3%</span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Messages Over Time */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Messages Over Time</h3>
              <p className="text-sm text-gray-600">Daily message volume ({timeRange})</p>
            </div>
            <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-primary-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive chart will be displayed here</p>
              <p className="text-sm text-gray-500">Showing {getFilteredDays().length} days of data</p>
            </div>
          </div>
        </div>

        {/* Messages by Subnet */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Messages by Subnet</h3>
              <p className="text-sm text-gray-600">Distribution across different subnets</p>
            </div>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-r from-success-50 to-success-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-success-400 mx-auto mb-2" />
              <p className="text-gray-600">Subnet distribution chart</p>
              <p className="text-sm text-gray-500">{analytics.messagesBySubnet.length} subnets tracked</p>
            </div>
          </div>
        </div>

        {/* Message Status Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Message Status</h3>
              <p className="text-sm text-gray-600">Success rate and delivery status</p>
            </div>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-64 bg-gradient-to-r from-warning-50 to-warning-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-warning-400 mx-auto mb-2" />
              <p className="text-gray-600">Status distribution chart</p>
              <p className="text-sm text-gray-500">{analytics.successRate}% success rate</p>
            </div>
          </div>
        </div>

        {/* Top Subnets */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Subnets</h3>
              <p className="text-sm text-gray-600">Most active subnets by message volume</p>
            </div>
            <ChartBarIcon className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {analytics.messagesBySubnet
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((subnet, index) => (
                <div key={subnet.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium">
                      {index + 1}
                    </div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: subnet.color }}></div>
                    <span className="text-sm font-medium text-gray-900">{subnet.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{subnet.count}</div>
                    <div className="text-xs text-gray-500">messages</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-success-50 rounded-lg border border-success-200">
            <div className="text-2xl font-bold text-success-600 mb-2">98.7%</div>
            <div className="text-sm text-success-700 font-medium">Success Rate</div>
            <div className="text-xs text-success-600 mt-1">Excellent performance</div>
          </div>

          <div className="text-center p-4 bg-warning-50 rounded-lg border border-warning-200">
            <div className="text-2xl font-bold text-warning-600 mb-2">2.3s</div>
            <div className="text-sm text-warning-700 font-medium">Avg. Delivery Time</div>
            <div className="text-xs text-warning-600 mt-1">Fast cross-chain messaging</div>
          </div>

          <div className="text-center p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="text-2xl font-bold text-primary-600 mb-2">4</div>
            <div className="text-sm text-primary-700 font-medium">Active Subnets</div>
            <div className="text-xs text-primary-600 mt-1">Growing network</div>
          </div>
        </div>
      </div>
    </div>
  )
}