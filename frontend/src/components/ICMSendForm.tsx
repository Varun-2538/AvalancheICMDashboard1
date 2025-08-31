import { useState } from 'react'
import { useICM } from '@/hooks/useICM'
import { useWallet } from '@/hooks/useWallet'
import toast from 'react-hot-toast'

const SUBNET_PRESETS = [
  { id: 'dexalot', name: 'Dexalot', chainId: '0x2VCAhX6vE3UnXC6s1CBPE6jJ4c4cHWMfPgCptuWS59pQ8WYxXw' },
  { id: 'dfk', name: 'DeFi Kingdoms', chainId: '0x2rwhRKN8qfxK9AEJunfUjn5WH7PQzUPPQKCb59ak6fwsrwF2R' },
  { id: 'amplify', name: 'Amplify', chainId: '0xzJytnh96Pc8rM337bBrtMvJDbEdDNjcXiG3WkTNCiLp8krJUk' },
  { id: 'custom', name: 'Custom Subnet', chainId: '' }
]

export function ICMSendForm() {
  const { sendMessage } = useICM()
  const { address } = useWallet()
  const [formData, setFormData] = useState({
    destinationPreset: 'dexalot',
    customChainId: '',
    recipient: '',
    message: '',
    amount: '0'
  })
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    setIsSending(true)
    try {
      const destinationChainId = formData.destinationPreset === 'custom' 
        ? formData.customChainId 
        : SUBNET_PRESETS.find(p => p.id === formData.destinationPreset)?.chainId

      if (!destinationChainId) {
        throw new Error('Please select a destination subnet')
      }

      await sendMessage({
        sourceChain: 'C',
        destinationChainId,
        recipient: formData.recipient,
        message: formData.message,
        amount: formData.amount,
        walletAddress: address
      })

      toast.success('ICM message sent successfully!')
      
      // Reset form
      setFormData({
        destinationPreset: 'dexalot',
        customChainId: '',
        recipient: '',
        message: '',
        amount: '0'
      })
    } catch (error: any) {
      console.error('Failed to send ICM message:', error)
      toast.error(error.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Send ICM Message</h2>
          <p className="text-gray-600">Send cross-chain messages between Avalanche subnets using Teleporter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Subnet
            </label>
            <select
              value={formData.destinationPreset}
              onChange={(e) => setFormData({ ...formData, destinationPreset: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {SUBNET_PRESETS.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
          </div>

          {formData.destinationPreset === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Chain ID
              </label>
              <input
                type="text"
                value={formData.customChainId}
                onChange={(e) => setFormData({ ...formData, customChainId: e.target.value })}
                placeholder="Enter blockchain ID"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                required={formData.destinationPreset === 'custom'}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="0x..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your cross-chain message..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (AVAX)
            </label>
            <input
              type="number"
              step="0.001"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:from-red-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? 'Sending Message...' : 'Send ICM Message'}
          </button>
        </form>
      </div>
    </div>
  )
}