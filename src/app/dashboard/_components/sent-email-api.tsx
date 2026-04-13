"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Mail,
  Search,
  Filter,
  Eye,
  BarChart3,
  Calendar,
  Users,
  MousePointer,
  Download,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { useSentEmails } from "@/hooks/user-apis"

interface SentEmail {
  id: number
  subject: string
  recipientCount?: number
  status: string
  sentAt: string
  groupName?: string
  attachmentCount?: number
}

interface EmailData {
  emails: {
    id: number
    subject: string
    status: string
    recipientCount: number
    attachmentCount: number
    groupName?: string
    sentAt: string
    createdAt: string
    failureReason: string | null
  }[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const STATUS_MAP: Record<string, { label: string; color: string; icon: string }> = {
  SENT: {
    label: "Sent",
    color: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    icon: "✅",
  },
  DELIVERED: {
    label: "Delivered",
    color: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    icon: "✅",
  },
  SENDING: {
    label: "Sending",
    color: "bg-gradient-to-r from-blue-400 to-cyan-500 text-white",
    icon: "📤",
  },
  FAILED: {
    label: "Failed",
    color: "bg-gradient-to-r from-red-400 to-pink-500 text-white",
    icon: "❌",
  },
  SCHEDULED: {
    label: "Scheduled",
    color: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
    icon: "⏰",
  },
  default: {
    label: "Unknown",
    color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
    icon: "📧",
  },
}

export function SentEmailsApi() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

  // The API returns { emails, pagination }
  const { data: emailsData, loading, error, refetch } = useSentEmails(page, 10)

  const getStatusColor = (status: string) => {
    return STATUS_MAP[status?.toUpperCase()]?.color || STATUS_MAP.default.color
  }

  const getStatusIcon = (status: string) => {
    return STATUS_MAP[status?.toUpperCase()]?.icon || STATUS_MAP.default.icon
  }

  const getStatusLabel = (status: string) => {
    return STATUS_MAP[status?.toUpperCase()]?.label || STATUS_MAP.default.label
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleViewDetails = (email: SentEmail) => {
    setSelectedEmail(email)
    setShowDetailsDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl p-8">
          <div className="text-center space-y-4">
            <div className="text-red-500 text-6xl">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to Load Sent Emails</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
            <Button
              onClick={refetch}
              className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl px-8 py-3"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Defensive fallback for emailsData
  const emails = Array.isArray((emailsData as EmailData)?.emails) ? (emailsData as EmailData).emails : []
  const pagination = typeof (emailsData as EmailData)?.pagination === "object" && (emailsData as EmailData)?.pagination !== null
    ? (emailsData as EmailData).pagination
    : { page: 1, limit: 10, total: 0, totalPages: 1 }

  // Filtering
  const filteredEmails =
    emails.filter((email: SentEmail) => {
      const matchesSearch =
        email.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (email.groupName && email.groupName.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === "all" || email.status?.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    }) || []

  // Stats
  const totalCampaigns = pagination.total || emails.length
  const totalRecipients = emails.reduce((sum: number, email: SentEmail) => sum + (email.recipientCount || 0), 0)
  // No open/click/bounce rate in API, so show N/A or 0.0%
  const avgOpenRate = "N/A"
  const avgClickRate = "N/A"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-8">
      {/* Animated Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-2xl">
                <Mail className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Sent Emails
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Track and analyze your email campaigns ✨</p>
            </div>
          </div>
          <Button
            onClick={refetch}
            className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <RefreshCw className="w-5 h-5 mr-2" />🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="🔍 Search emails by subject or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl h-14 text-lg"
              />
            </div>
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px] bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 transition-all duration-300 rounded-2xl h-14">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    <SelectValue placeholder="Filter by status" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-orange-200">
                  <SelectItem value="all" className="rounded-xl">
                    📧 All Status
                  </SelectItem>
                  <SelectItem value="SENT" className="rounded-xl">
                    ✅ Sent
                  </SelectItem>
                  <SelectItem value="DELIVERED" className="rounded-xl">
                    ✅ Delivered
                  </SelectItem>
                  <SelectItem value="SENDING" className="rounded-xl">
                    📤 Sending
                  </SelectItem>
                  <SelectItem value="FAILED" className="rounded-xl">
                    ❌ Failed
                  </SelectItem>
                  <SelectItem value="SCHEDULED" className="rounded-xl">
                    ⏰ Scheduled
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl px-6 py-4 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Download className="w-4 h-4 mr-2" />📥 Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Campaigns",
            value: totalCampaigns,
            icon: Mail,
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            darkBgGradient: "from-blue-900/20 to-cyan-900/20",
          },
          {
            title: "Total Recipients",
            value: totalRecipients,
            icon: Users,
            gradient: "from-green-400 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
            darkBgGradient: "from-green-900/20 to-emerald-900/20",
          },
          {
            title: "Avg Open Rate",
            value: avgOpenRate,
            icon: Eye,
            gradient: "from-purple-400 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            darkBgGradient: "from-purple-900/20 to-pink-900/20",
          },
          {
            title: "Avg Click Rate",
            value: avgClickRate,
            icon: MousePointer,
            gradient: "from-orange-400 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            darkBgGradient: "from-orange-900/20 to-red-900/20",
          },
        ].map((stat, index) => (
          <div
            key={stat.title}
            className="group hover:scale-105 transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card
              className={`bg-gradient-to-br ${stat.bgGradient} dark:${stat.darkBgGradient} border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden`}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-lg mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.title}</div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Emails List */}
      <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: "3s" }} />📧 Email
            Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-orange-200/50 dark:border-gray-700/50 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20">
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">📧 Subject</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">👥 Recipients</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">📅 Sent</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">📊 Status</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">📎 Attachments</th>
                  <th className="text-left py-6 px-6 font-bold text-gray-700 dark:text-gray-300">⚡ Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmails.map((email: SentEmail, index: number) => (
                  <tr
                    key={email.id}
                    className="border-b border-gray-100/50 dark:border-gray-800/50 hover:bg-gradient-to-r hover:from-orange-50/30 hover:to-yellow-50/30 dark:hover:from-orange-900/10 dark:hover:to-yellow-900/10 transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-6 px-6">
                      <div className="space-y-2">
                        <div className="font-bold text-gray-900 dark:text-white text-lg max-w-[300px] truncate">
                          {email.subject}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          📂 {email.groupName || "Direct Send"}
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {email.recipientCount?.toLocaleString() || 0}
                        </span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-green-500" />
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{formatDate(email.sentAt)}</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <Badge
                        className={`${getStatusColor(email.status)} border-0 px-4 py-2 rounded-full font-semibold`}
                      >
                        {getStatusIcon(email.status)} {getStatusLabel(email.status)}
                      </Badge>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {email.attachmentCount || 0}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">file(s)</span>
                      </div>
                    </td>
                    <td className="py-6 px-6">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleViewDetails(email)}
                          className="bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-xl px-4 py-2 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          👁️ View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-2 border-orange-200 hover:border-orange-400 text-orange-600 hover:text-orange-700 rounded-xl px-4 py-2 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 bg-transparent"
                        >
                          <BarChart3 className="w-4 h-4 mr-1" />📊 Stats
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEmails.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500 dark:text-gray-400">
                      No sent emails found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-xl"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
            disabled={page === pagination.totalPages}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}

      {/* Email Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] rounded-3xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <Mail className="w-6 h-6 text-orange-500" />📧 Campaign Details
            </DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-6 p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">📝 Subject</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedEmail.subject}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">👥 Recipients</h4>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedEmail.recipientCount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">📅 Sent Date</h4>
                    <p className="text-gray-700 dark:text-gray-300">{formatDate(selectedEmail.sentAt)}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">📂 Group</h4>
                    <p className="text-gray-700 dark:text-gray-300">{selectedEmail.groupName || "Direct Send"}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-6 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200/50 dark:border-green-800/50">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    N/A
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">👁️ Open Rate</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    N/A
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">🖱️ Click Rate</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    N/A
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">⚠️ Bounce Rate</div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <BarChart3 className="w-4 h-4 mr-2" />📊 View Full Report
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-orange-200 hover:border-orange-400 text-gray-700 dark:text-gray-300 rounded-2xl py-3 font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />📥 Export Data
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
