import { useState } from 'react'
import { useICM } from '@/hooks/useICM'
import { useWallet } from '@/hooks/useWallet'
import toast from 'react-hot-toast'
import { PaperAirplaneIcon, ArrowPathIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const SUBNET_PRESETS = [
  {
    id: 'dexalot',
    name: 'Dexalot',
    chainId: '0x0000000000000000000000000000000000000000000000000000000000000001',
    description: 'Decentralized exchange subnet',
    icon: '🔄'
  },
  {
    id: 'dfk',
    name: 'DeFi Kingdoms',
    chainId: '0x0000000000000000000000000000000000000000000000000000000000000002',
    description: 'Gaming and DeFi subnet',
    icon: '👑'
  },
  {
    id: 'amplify',
    name: 'Amplify',
    chainId: '0x0000000000000000000000000000000000000000000000000000000000000003',
    description: 'High-performance subnet',
    icon: '⚡'
  },
  {
    id: 'custom',
    name: 'Custom Subnet',
    chainId: '',
    description: 'Enter custom blockchain ID',
    icon: '🔧'
  }
]

interface FormErrors {
  destinationPreset?: string
  customChainId?: string
  recipient?: string
  message?: string
  amount?: string
}

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
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.destinationPreset) {
      newErrors.destinationPreset = 'Please select a destination subnet'
    }

    if (formData.destinationPreset === 'custom' && !formData.customChainId.trim()) {
      newErrors.customChainId = 'Custom chain ID is required'
    }

    if (formData.destinationPreset === 'custom' && formData.customChainId && !/^0x[a-fA-F0-9]{64}$/.test(formData.customChainId)) {
      newErrors.customChainId = 'Invalid blockchain ID format (must be 0x followed by 64 hex characters)'
    }

    if (!formData.recipient.trim()) {
      newErrors.recipient = 'Recipient address is required'
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid Ethereum address format'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required'
    }

    if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters'
    }

    if (!formData.amount || parseFloat(formData.amount) < 0) {
      newErrors.amount = 'Amount must be a positive number'
    }

    if (parseFloat(formData.amount) > 10) {
      newErrors.amount = 'Amount cannot exceed 10 AVAX'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSending(true)
    setSendStatus('sending')

    try {
      const destinationChainId = formData.destinationPreset === 'custom'
        ? formData.customChainId
        : SUBNET_PRESETS.find(p => p.id === formData.destinationPreset)?.chainId

      if (!destinationChainId) {
        throw new Error('Invalid destination subnet')
      }

      await sendMessage({
        sourceChain: 'C',
        destinationChainId,
        recipient: formData.recipient,
        message: formData.message,
        amount: formData.amount,
        walletAddress: address
      })

      setSendStatus('success')
      toast.success('ICM message sent successfully!')

      // Reset form
      setFormData({
        destinationPreset: 'dexalot',
        customChainId: '',
        recipient: '',
        message: '',
        amount: '0'
      })
      setErrors({})

      // Reset status after animation
      setTimeout(() => setSendStatus('idle'), 3000)
    } catch (error: any) {
      console.error('Failed to send ICM message:', error)
      setSendStatus('error')
      toast.error(error.message || 'Failed to send message')
      setTimeout(() => setSendStatus('idle'), 3000)
    } finally {
      setIsSending(false)
    }
  }

  const getSelectedSubnet = () => {
    return SUBNET_PRESETS.find(p => p.id === formData.destinationPreset)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <PaperAirplaneIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Send ICM Message</h2>
              <p className="text-gray-600">Send secure cross-chain messages between Avalanche subnets</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination Subnet Selection */}
          <div>
            <label className="label">Destination Subnet</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SUBNET_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, destinationPreset: preset.id })}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    formData.destinationPreset === preset.id
                      ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{preset.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{preset.name}</p>
                      <p className="text-sm text-gray-600">{preset.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {errors.destinationPreset && (
              <p className="mt-2 text-sm text-error-600 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.destinationPreset}
              </p>
            )}
          </div>

          {/* Custom Chain ID Input */}
          {formData.destinationPreset === 'custom' && (
            <div className="animate-fade-in">
              <label className="label">Custom Blockchain ID</label>
              <input
                type="text"
                value={formData.customChainId}
                onChange={(e) => setFormData({ ...formData, customChainId: e.target.value })}
                placeholder="0x..."
                className={`input ${errors.customChainId ? 'input-error' : ''}`}
              />
              {errors.customChainId && (
                <p className="mt-2 text-sm text-error-600 flex items-center">
                  <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                  {errors.customChainId}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the full blockchain ID (64 hex characters after 0x)
              </p>
            </div>
          )}

          {/* Recipient Address */}
          <div>
            <label className="label">Recipient Address</label>
            <input
              type="text"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              placeholder="0x..."
              className={`input ${errors.recipient ? 'input-error' : ''}`}
            />
            {errors.recipient && (
              <p className="mt-2 text-sm text-error-600 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.recipient}
              </p>
            )}
          </div>

          {/* Message Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label">Message Content</label>
              <span className={`text-sm ${formData.message.length > 1000 ? 'text-error-600' : 'text-gray-500'}`}>
                {formData.message.length}/1000
              </span>
            </div>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Enter your cross-chain message..."
              rows={6}
              className={`input resize-none ${errors.message ? 'input-error' : ''}`}
            />
            {errors.message && (
              <p className="mt-2 text-sm text-error-600 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.message}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="label">Amount (AVAX)</label>
            <div className="relative">
              <input
                type="number"
                step="0.001"
                min="0"
                max="10"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.0"
                className={`input pr-16 ${errors.amount ? 'input-error' : ''}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <span className="text-gray-500 text-sm">AVAX</span>
              </div>
            </div>
            {errors.amount && (
              <p className="mt-2 text-sm text-error-600 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
                {errors.amount}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Network fee will be added automatically. Maximum: 10 AVAX
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSending || !address}
              className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                sendStatus === 'success' ? 'bg-success-600 hover:bg-success-700' :
                sendStatus === 'error' ? 'bg-error-600 hover:bg-error-700' : ''
              }`}
            >
              {sendStatus === 'idle' && (
                <>
                  <PaperAirplaneIcon className="w-5 h-5" />
                  <span>{isSending ? 'Sending Message...' : 'Send ICM Message'}</span>
                </>
              )}
              {sendStatus === 'sending' && (
                <>
                  <ArrowPathIcon className="w-5 h-5 animate-spin" />
                  <span>Sending Message...</span>
                </>
              )}
              {sendStatus === 'success' && (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Message Sent Successfully!</span>
                </>
              )}
              {sendStatus === 'error' && (
                <>
                  <ExclamationTriangleIcon className="w-5 h-5" />
                  <span>Failed to Send Message</span>
                </>
              )}
            </button>

            {!address && (
              <p className="mt-3 text-sm text-warning-600 text-center">
                Please connect your wallet to send messages
              </p>
            )}
          </div>
        </form>

        {/* Selected Subnet Info */}
        {getSelectedSubnet() && formData.destinationPreset !== 'custom' && (
          <div className="mt-8 p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getSelectedSubnet()?.icon}</span>
              <div>
                <p className="font-semibold text-primary-900">
                  Sending to {getSelectedSubnet()?.name}
                </p>
                <p className="text-sm text-primary-700">
                  {getSelectedSubnet()?.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}