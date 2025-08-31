import { useState, useEffect, useMemo } from 'react'
import { useICM } from '@/hooks/useICM'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  DocumentArrowDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface Message {
  id: string
  status: 'completed' | 'failed' | 'pending' | 'processing'
  timestamp: string
  content: string
  recipient: string
  destinationSubnet: string
  txHash?: string
  amount: string
  sourceChain: string
}

type SortField = 'timestamp' | 'status' | 'amount' | 'destinationSubnet'
type SortDirection = 'asc' | 'desc'

export function ICMHistory() {
  const { messages, getMessageHistory } = useICM()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [subnetFilter, setSubnetFilter] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('timestamp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)

  const itemsPerPage = 10

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

  // Get unique subnets for filter
  const uniqueSubnets = useMemo(() => {
    const subnets = [...new Set(messages.map(msg => msg.destinationSubnet))]
    return subnets.sort()
  }, [messages])

  // Filter and sort messages
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages.filter(message => {
      const matchesSearch = searchQuery === '' ||
        message.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        message.txHash?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || message.status === statusFilter
      const matchesSubnet = subnetFilter === 'all' || message.destinationSubnet === subnetFilter

      return matchesSearch && matchesStatus && matchesSubnet
    })

    // Sort messages
    filtered.sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]

      if (sortField === 'timestamp') {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      } else if (sortField === 'amount') {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [messages, searchQuery, statusFilter, subnetFilter, sortField, sortDirection])

  // Paginate messages
  const paginatedMessages = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedMessages.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedMessages, currentPage])

  const totalPages = Math.ceil(filteredAndSortedMessages.length / itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
    setCurrentPage(1)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-success-600" />
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-error-600" />
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-warning-600" />
      default:
        return <ExclamationCircleIcon className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-success-100 text-success-800`
      case 'failed':
        return `${baseClasses} bg-error-100 text-error-800`
      case 'pending':
        return `${baseClasses} bg-warning-100 text-warning-800`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const exportToCSV = () => {
    const headers = ['Date', 'Status', 'Recipient', 'Subnet', 'Amount', 'Message', 'TX Hash']
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedMessages.map(msg => [
        formatDate(msg.timestamp),
        getStatusText(msg.status),
        msg.recipient,
        msg.destinationSubnet,
        msg.amount,
        `"${msg.content.replace(/"/g, '""')}"`,
        msg.txHash || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `icm-messages-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600">Loading message history...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Message History</h2>
          <p className="text-gray-600">Track and manage your cross-chain messages</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages, addresses, or TX hashes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Delivered</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
          </div>

          {/* Subnet Filter */}
          <div>
            <select
              value={subnetFilter}
              onChange={(e) => setSubnetFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Subnets</option>
              {uniqueSubnets.map(subnet => (
                <option key={subnet} value={subnet}>{subnet}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {paginatedMessages.length} of {filteredAndSortedMessages.length} messages
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>

      {/* Messages Table */}
      {paginatedMessages.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📭</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== 'all' || subnetFilter !== 'all'
              ? 'Try adjusting your filters to see more results.'
              : 'You haven\'t sent any ICM messages yet.'}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Date</span>
                      {sortField === 'timestamp' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Status</span>
                      {sortField === 'status' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipient
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('destinationSubnet')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Subnet</span>
                      {sortField === 'destinationSubnet' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      {sortField === 'amount' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedMessages.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(message.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(message.status)}
                        <span className={getStatusBadge(message.status)}>
                          {getStatusText(message.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="truncate" title={message.content}>
                        {message.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="font-mono">{formatAddress(message.recipient)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {message.destinationSubnet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {message.amount} AVAX
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedMessage(message)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        {message.txHash && (
                          <a
                            href={`https://testnet.snowtrace.io/tx/${message.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-900"
                          >
                            TX
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(selectedMessage.status)}
                  <span className={getStatusBadge(selectedMessage.status)}>
                    {getStatusText(selectedMessage.status)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedMessage.timestamp)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-gray-900">{selectedMessage.content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <p className="font-mono text-sm text-gray-900">{selectedMessage.recipient}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-sm text-gray-900">{selectedMessage.amount} AVAX</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination Subnet</label>
                    <p className="text-sm text-gray-900">{selectedMessage.destinationSubnet}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Source Chain</label>
                    <p className="text-sm text-gray-900">{selectedMessage.sourceChain}</p>
                  </div>
                </div>

                {selectedMessage.txHash && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash</label>
                    <a
                      href={`https://testnet.snowtrace.io/tx/${selectedMessage.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm text-primary-600 hover:text-primary-700 break-all"
                    >
                      {selectedMessage.txHash}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}