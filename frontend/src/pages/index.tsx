import { useState } from 'react'
import Head from 'next/head'
import { useWallet } from '@/hooks/useWallet'
import { useL1Deployment } from '@/hooks/useL1Deployment'
import { useICM } from '@/hooks/useICM'
import { WalletConnector } from '@/components/WalletConnector'
import { L1ConfigForm } from '@/components/L1ConfigForm'
import { SubnetDeployment } from '@/components/SubnetDeployment'
import { GenesisConfig } from '@/components/GenesisConfig'
import { ICMSendForm } from '@/components/ICMSendForm'
import { ICMHistory } from '@/components/ICMHistory'
import { ICMAnalytics } from '@/components/ICMAnalytics'
import { LandingPage } from '@/components/LandingPage'
import { ThemeToggle } from '@/components/ThemeToggle'
import toast, { Toaster } from 'react-hot-toast'
import { HomeIcon, CogIcon, DocumentTextIcon, RocketLaunchIcon, ChatBubbleLeftRightIcon, ChartBarIcon } from '@heroicons/react/24/outline'

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: HomeIcon },
  { id: 'configure', name: 'Configure', icon: CogIcon },
  { id: 'genesis', name: 'Genesis', icon: DocumentTextIcon },
  { id: 'deploy', name: 'Deploy', icon: RocketLaunchIcon },
  { id: 'icm', name: 'ICM Testing', icon: ChatBubbleLeftRightIcon },
  { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
]

export default function Home() {
  const { isConnected, address } = useWallet()
  const { deployments, createDeployment, isDeploying } = useL1Deployment()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (!isConnected) {
    return <LandingPage />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Avalanche ICM Dashboard - Cross-Chain Messaging Made Simple</title>
        <meta name="description" content="Complete Avalanche Inter-Chain Messaging dashboard with real-time monitoring and analytics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Avalanche ICM</h1>
                <p className="text-xs text-gray-500">Cross-Chain Messaging</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Connected to Fuji Testnet</span>
              </div>
              <ThemeToggle />
              <WalletConnector />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <div className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your subnets.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Last updated</p>
                    <p className="text-sm font-medium text-gray-900">2 minutes ago</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Messages</p>
                        <p className="text-2xl font-bold text-gray-900">1,247</p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm text-green-600 font-medium">+12.5%</span>
                      <span className="text-sm text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Subnets</p>
                        <p className="text-2xl font-bold text-gray-900">4</p>
                      </div>
                      <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                        <RocketLaunchIcon className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm text-green-600 font-medium">+1</span>
                      <span className="text-sm text-gray-500 ml-2">this week</span>
                    </div>
                  </div>

                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg. Delivery</p>
                        <p className="text-2xl font-bold text-gray-900">2.3s</p>
                      </div>
                      <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
                        <ChartBarIcon className="w-6 h-6 text-warning-600" />
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
                        <p className="text-sm font-medium text-gray-600">Success Rate</p>
                        <p className="text-2xl font-bold text-gray-900">99.8%</p>
                      </div>
                      <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-success-600" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm text-green-600 font-medium">+0.1%</span>
                      <span className="text-sm text-gray-500 ml-2">vs yesterday</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      onClick={() => setActiveTab('icm')}
                      className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Send ICM Message</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('configure')}
                      className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <CogIcon className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-gray-900">Configure Subnet</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="flex items-center justify-center space-x-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ChartBarIcon className="w-5 h-5 text-primary-600" />
                      <span className="font-medium text-gray-900">View Analytics</span>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <button
                      onClick={() => setActiveTab('icm')}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View all →
                    </button>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="w-5 h-5 text-success-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Message sent to Dexalot</p>
                            <p className="text-sm text-gray-600">2 minutes ago • 0x1234...5678</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-success-600">Delivered</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs */}
            {activeTab === 'configure' && <L1ConfigForm />}
            {activeTab === 'genesis' && <GenesisConfig />}
            {activeTab === 'deploy' && <SubnetDeployment />}
            {activeTab === 'icm' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">ICM Testing</h2>
                  <p className="text-gray-600 mt-2">Send and monitor cross-chain messages between Avalanche subnets</p>
                </div>
                <ICMSendForm />
                <ICMHistory />
              </div>
            )}
            {activeTab === 'analytics' && <ICMAnalytics />}
          </div>
        </main>
      </div>
    </div>
  )
}