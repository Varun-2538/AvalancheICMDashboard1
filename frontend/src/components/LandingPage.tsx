import { useState } from 'react'
import { ArrowRightIcon, BoltIcon, ShieldCheckIcon, GlobeAltIcon, ChartBarIcon, CpuChipIcon } from '@heroicons/react/24/outline'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-primary-200 transition-all duration-300">
    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors duration-300">
      <div className="text-primary-600">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
)

interface StatCardProps {
  value: string
  label: string
  trend?: string
}

const StatCard = ({ value, label, trend }: StatCardProps) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-primary-600 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
    {trend && <div className="text-xs text-green-600 font-medium">{trend}</div>}
  </div>
)

export function LandingPage() {
  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Send cross-chain messages instantly with Avalanche\'s high-performance network.'
    },
    {
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      title: 'Secure & Reliable',
      description: 'Built on Avalanche\'s robust infrastructure with enterprise-grade security.'
    },
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      title: 'Multi-Subnet Support',
      description: 'Connect with Dexalot, DeFi Kingdoms, Amplify, and custom subnets seamlessly.'
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: 'Real-time Analytics',
      description: 'Monitor transaction status and performance with live dashboards.'
    },
    {
      icon: <CpuChipIcon className="w-6 h-6" />,
      title: 'Developer Friendly',
      description: 'Simple APIs and comprehensive documentation for easy integration.'
    }
  ]

  const stats = [
    { value: '99.9%', label: 'Uptime', trend: '+0.1%' },
    { value: '< 3s', label: 'Avg. Delivery Time' },
    { value: '50+', label: 'Supported Subnets' },
    { value: '10k+', label: 'Daily Messages' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-8">
              <BoltIcon className="w-4 h-4 mr-2" />
              Powered by Avalanche ICM Protocol
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Cross-Chain Messaging
              <span className="block gradient-text">Made Simple</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
              Send secure, instant messages between Avalanche subnets using Teleporter.
              Monitor transactions in real-time with comprehensive analytics and seamless wallet integration.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="btn-primary flex items-center text-lg px-8 py-4">
                Get Started
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
              <button className="btn-secondary text-lg px-8 py-4">
                View Documentation
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Avalanche ICM?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the future of cross-chain communication with our powerful features
              designed for developers and businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Building?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Join thousands of developers building the future of cross-chain applications
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
            />
            <button className="bg-white text-primary-600 font-medium px-6 py-3 rounded-lg hover:bg-primary-50 transition-colors duration-200">
              Get Updates
            </button>
          </div>

          <p className="text-primary-200 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <BoltIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">Avalanche ICM</span>
              </div>
              <p className="text-gray-400 mb-4">
                The most reliable cross-chain messaging platform for Avalanche subnets.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Discord
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  GitHub
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Avalanche ICM. Built with ❤️ by Unite DeFi.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
