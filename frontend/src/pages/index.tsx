import { useState, useEffect } from 'react'
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
import toast, { Toaster } from 'react-hot-toast'

export default function Home() {
  const { isConnected, address } = useWallet()
  const { deployments, createDeployment, isDeploying } = useL1Deployment()
  const [activeTab, setActiveTab] = useState('configure')

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <Head>
        <title>AvalancheL1SubnetCreator - Avalanche L1 Subnet Creator</title>
        <meta name="description" content="Complete Avalanche L1 Subnet Creation & ICM Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Toaster position="top-right" />

      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏗️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AvalancheL1SubnetCreator</h1>
                <p className="text-sm text-gray-600">L1 Subnet Creator & ICM</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <WalletConnector />
            </div>
          </div>
          
          {isConnected && (
            <nav className="flex space-x-8 -mb-px">
              <button
                onClick={() => setActiveTab('configure')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'configure' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Configure
              </button>
              <button
                onClick={() => setActiveTab('genesis')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'genesis' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Genesis
              </button>
              <button
                onClick={() => setActiveTab('deploy')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'deploy' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Deploy
              </button>
              <button
                onClick={() => setActiveTab('icm')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'icm' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                ICM Testing
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics' 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="mx-auto max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-4xl">🏗️</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Avalanche L1 Subnet Creator
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Connect your wallet to start creating and deploying custom Avalanche L1 subnets
              </p>
              <WalletConnector />
            </div>
          </div>
        ) : (
          <div className="px-4 sm:px-0">
            {activeTab === 'configure' && <L1ConfigForm />}
            {activeTab === 'genesis' && <GenesisConfig />}
            {activeTab === 'deploy' && <SubnetDeployment />}
            {activeTab === 'icm' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Test ICM Between Subnets</h2>
                <ICMSendForm />
                <ICMHistory />
              </div>
            )}
            {activeTab === 'analytics' && <ICMAnalytics />}
          </div>
        )}
      </main>
    </div>
  )
}