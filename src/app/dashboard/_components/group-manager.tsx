"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Info } from "lucide-react"
import {
  Users,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  BarChart3,
  Copy,
  Trash2,
  Eye,
  UserPlus,
  CheckCircle,
  Mail,
  TrendingUp,
} from "lucide-react"
import { useEmailGroups } from "@/hooks/user-apis"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

type EmailGroup = {
  id: number
  name: string
  description?: string
  memberCount?: number
  emailsSent?: number
  status?: string
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

type GroupMember = {
  id?: string
  email: string
  name?: string
  status?: "active" | "bounced" | "unsubscribed"
  joinedDate?: string
  lastActivity?: string
  createdAt?: string
  tags?: string[]
  [key: string]: unknown
}

type GroupStats = {
  id?: number
  memberCount?: number
  totalEmailsSent?: number
  emailStats?: Record<string, unknown>
  successRate?: number
  recentEmails?: unknown[]
  createdAt?: string
  openRate?: number
  [key: string]: unknown
}

type GroupsResponse = {
  groups: EmailGroup[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export function GroupManager() {
  const [activeTab, setActiveTab] = useState("groups")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)

  // Group creation states
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    tags: "",
    settings: {
      allowDuplicates: false,
      autoCleanBounces: true,
      requireDoubleOptIn: false,
    },
  })

  // Group management states
  const [selectedGroup, setSelectedGroup] = useState<EmailGroup | null>(null)
  const [showMembersDialog, setShowMembersDialog] = useState(false)
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const [groupMembers, setGroupMembers] = useState<GroupMember[]>([])
  const [groupStats, setGroupStats] = useState<GroupStats | null>(null)
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])
  const [membersSearch] = useState("")
  const [membersPage] = useState(1)

  // Member addition states
  const [newMembers, setNewMembers] = useState({
    emails: "",
    importMethod: "manual" as "manual" | "csv",
    tags: "",
  })

  const { data: groupsData, loading, error, refetch } = useEmailGroups(page, 20, searchTerm) as {
    data: GroupsResponse | null
    loading: boolean
    error: unknown
    refetch: () => void
  }

  const getStatistics = () => {
    if (!groupsData) {
      return { totalGroups: 0, totalMembers: 0, activeGroups: 0 }
    }

    
    // Handle the correct data structure based on your console.log
    const groups = groupsData.groups || []
    const pagination = groupsData.pagination

    const totalGroups = pagination?.total || groups.length
    const totalMembers = groups.reduce((sum: number, group: EmailGroup) => sum + (group.memberCount || 0), 0)
    const activeGroups = groups.filter((g: EmailGroup) => g.status === "active" || g.isActive).length

    return { totalGroups, totalMembers, activeGroups }
  }

  const handleCreateGroup = async () => {
    try {
      await apiClient.createEmailGroup({
        name: newGroup.name,
        description: newGroup.description,
      })

      setNewGroup({
        name: "",
        description: "",
        tags: "",
        settings: {
          allowDuplicates: false,
          autoCleanBounces: true,
          requireDoubleOptIn: false,
        },
      })
      setShowCreateDialog(false)
      refetch()
      toast.success("Group created successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create group")
    }
  }

  const loadGroupMembers = async (groupId: number, page = 1, search = "") => {
    try {
      const response = await apiClient.getGroupMembers(groupId, page, 20, search)
      let members: GroupMember[] = []
      if (typeof response === "object" && response !== null) {
        if ("members" in response && Array.isArray((response as { members: GroupMember[] }).members)) {
          members = (response as { members: GroupMember[] }).members
        } else if ("data" in response && response.data && Array.isArray((response as { data: { members: GroupMember[] } }).data.members)) {
          members = (response as { data: { members: GroupMember[] } }).data.members
        }
      }
      setGroupMembers(members)
    } catch (error) {
      console.error("Failed to load group members:", error)
      toast.error("Failed to load group members")
    }
  }

  const loadGroupStats = async (groupId: number) => {
    try {
      const stats = await apiClient.getGroupStats(groupId)
      let groupStats: GroupStats = {}
      if (typeof stats === "object" && stats !== null) {
        if ("data" in stats && stats.data) {
          groupStats = (stats as { data: GroupStats }).data
        } else {
          groupStats = stats as GroupStats
        }
      }
      setGroupStats(groupStats)
    } catch (error) {
      console.error("Failed to load group statistics:", error)
      toast.error("Failed to load group statistics")
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const parseEmails = (emailText: string) => {
    const emails = emailText
      .split(/[\n,;]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0)

    const valid: string[] = []
    const invalid: string[] = []

    emails.forEach((email) => {
      if (validateEmail(email)) {
        valid.push(email)
      } else {
        invalid.push(email)
      }
    })

    return { valid, invalid }
  }

  const handleAddMembers = async () => {
    if (!selectedGroup) return

    const { valid, invalid } = parseEmails(newMembers.emails)

    if (valid.length === 0) {
      toast.error("No valid email addresses found")
      return
    }

    try {
      await apiClient.addEmailsToGroup(selectedGroup.id, { emails: valid })
      setNewMembers({ emails: "", importMethod: "manual", tags: "" })
      setShowAddMembersDialog(false)
      toast.success(`Added ${valid.length} members successfully!`)

      if (invalid.length > 0) {
        toast.warning(`${invalid.length} invalid email addresses were skipped`)
      }

      await loadGroupMembers(selectedGroup.id, membersPage, membersSearch)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add members")
    }
  }

  const handleRemoveMember = async (groupId: number, id: number) => {
    try {
      await apiClient.removeEmailFromGroup(groupId, id)
      toast.success("Member removed successfully")
      await loadGroupMembers(groupId, membersPage, membersSearch)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member")
    }
  }

  const handleDuplicateGroup = async (groupId: number, name: string) => {
    try {
      await apiClient.duplicateEmailGroup(groupId, name)
      toast.success(`Group duplicated as "${name}"`)
      refetch()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to duplicate group")
    }
  }

  const handleDeleteGroup = async (groupId: number) => {
    try {
      await apiClient.deleteEmailGroup(groupId)
      refetch()
      toast.success("Group deleted successfully!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete group")
    }
  }

  const handleBulkAction = async (action: "delete" | "export") => {
    if (!selectedGroup || selectedMembers.length === 0) return

    if (action === "delete") {
      if (!window.confirm(`Delete ${selectedMembers.length} selected members?`)) return

      try {
        await Promise.all(
          selectedMembers.map(async (memberId) => {
            const member = groupMembers.find((m) => m.id === memberId)
            if (member) {
              await handleRemoveMember(selectedGroup.id, Number(member.id))
            }
          })
        )
        setSelectedMembers([])
        refetch()
      } catch (error) {
        console.error("Failed to delete some members:", error)
        toast.error("Failed to delete some members")
      }
    }
  }

  const statistics = getStatistics()

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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Failed to Load Groups</h2>
            <p className="text-gray-600 dark:text-gray-400">{String(error)}</p>
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

  // Get groups array safely
  const groups = groupsData?.groups || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-2xl">
                <Users className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                Groups Manager
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">Manage your subscriber groups and campaigns</p>
            </div>
          </div>
          <Button
            onClick={refetch}
            variant="outline"
            className="rounded-2xl border-orange-200 hover:border-orange-400 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/70 dark:bg-gray-800/70 h-15 backdrop-blur-xl border-0 shadow-lg rounded-2xl p-2">
          <TabsTrigger
            value="groups"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-yellow-500 data-[state=active]:text-white font-semibold py-3"
          >
            Group Emails
          </TabsTrigger>
          <TabsTrigger
            value="manager"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-400 data-[state=active]:to-yellow-500 data-[state=active]:text-white font-semibold py-3"
          >
            Group Manager
          </TabsTrigger>
        </TabsList>

        <TabsContent value="groups" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.totalGroups}</div>
                    <div className="text-gray-600 dark:text-gray-400">Total Groups</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.totalMembers}</div>
                    <div className="text-gray-600 dark:text-gray-400">Total Members</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.activeGroups}</div>
                    <div className="text-gray-600 dark:text-gray-400">Active Groups</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create Group Button */}
          <div className="flex justify-between items-center">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-orange-200 dark:border-gray-600"
              />
            </div>

            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                  <Plus className="w-5 h-5 mr-3" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] rounded-3xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-orange-500" />
                    Create New Email Group
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 p-2">
                  <div className="space-y-3">
                    <Label htmlFor="groupName" className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Group Name
                    </Label>
                    <Input
                      id="groupName"
                      placeholder="Enter group name"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                      className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl h-14 text-lg"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="groupDescription"
                      className="text-lg font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="groupDescription"
                      placeholder="Brief description of this group"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                      className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl min-h-[100px] text-lg resize-none"
                    />
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateDialog(false)}
                      className="flex-1 rounded-2xl border-gray-300 dark:border-gray-600 bg-transparent"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateGroup}
                      disabled={!newGroup.name.trim()}
                      className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl font-semibold"
                    >
                      Create Group
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: EmailGroup, index: number) => (
              <Card
                key={group.id}
                className="group hover:scale-105 transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                        {group.name}
                      </CardTitle>
                      <Badge
                        className={`flex items-center gap-1 border-0 px-3 py-1 rounded-full font-semibold text-sm shadow-sm transition-all duration-300
                          ${group.status === "active" || group.isActive
                            ? "bg-gradient-to-r from-green-400/80 to-emerald-500/80 text-white shadow-green-200 dark:shadow-green-900"
                            : "bg-gradient-to-r from-gray-200/80 to-gray-400/80 text-gray-700 dark:text-gray-300 shadow-gray-200 dark:shadow-gray-900"
                          }`}
                      >
                        <span
                          className={`inline-block w-2.5 h-2.5 rounded-full mr-1
                            ${group.status === "active" || group.isActive
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-400"
                            }`}
                        ></span>
                        {group.status === "active" || group.isActive ? "Active" : (group.status ? group.status : "Active")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-4 rounded-2xl">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Members:</div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.memberCount || 0}</div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-4 rounded-2xl">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Created:</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {group.createdAt ? new Date(group.createdAt).toLocaleDateString() : ""}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedGroup(group)
                      setShowStatsDialog(true)
                      loadGroupStats(group.id)
                    }}
                    className="w-full rounded-xl border-purple-200 hover:border-purple-400 text-purple-600 hover:text-purple-700 bg-transparent"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Statistics
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="manager" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-orange-200 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Groups Grid with Management Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group: EmailGroup, index: number) => (
              <Card
                key={group.id}
                className="group hover:scale-105 transition-all duration-500 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                        {group.name}
                      </CardTitle>
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 px-4 py-2 rounded-full font-semibold">
                        {group.status || (group.isActive ? "Active" : "Inactive")}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {/* Duplicate Group Modal Trigger */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-orange-600"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs rounded-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                              <Copy className="w-5 h-5 text-orange-500" />
                              Duplicate Group
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label htmlFor={`duplicate-group-name-${group.id}`}>New Group Name</Label>
                            <Input
                              id={`duplicate-group-name-${group.id}`}
                              type="text"
                              defaultValue={group.name + " (Copy)"}
                              className="rounded-xl"
                              autoFocus
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  const input = e.target as HTMLInputElement;
                                  if (input.value.trim()) {
                                    handleDuplicateGroup(group.id, input.value.trim());
                                    (document.activeElement as HTMLElement)?.blur();
                                  }
                                }
                              }}
                            />
                            <div className="flex gap-2 mt-2">
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-1 rounded-xl"
                                >
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button
                                  className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 text-white rounded-xl font-semibold shadow hover:from-orange-500 hover:to-yellow-600"
                                  onClick={() => {
                                    const input = document.getElementById(`duplicate-group-name-${group.id}`) as HTMLInputElement
                                    if (input && input.value.trim()) {
                                      handleDuplicateGroup(group.id, input.value.trim())
                                    }
                                  }}
                                >
                                  Duplicate
                                </Button>
                              </DialogTrigger>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {/* Delete Group Confirm Modal */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xs rounded-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
                          <DialogHeader>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-red-600">
                              <Trash2 className="w-5 h-5 text-red-500" />
                              Delete Group
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="text-gray-700 dark:text-gray-200">
                              Are you sure you want to delete the group <span className="font-semibold">{group.name}</span>?<br />
                              This action cannot be undone.
                            </div>
                            <div className="flex gap-2 mt-2">
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="flex-1 rounded-xl"
                                >
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogTrigger asChild>
                                <Button
                                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-semibold shadow hover:from-red-600 hover:to-orange-600"
                                  onClick={() => handleDeleteGroup(group.id)}
                                >
                                  Delete
                                </Button>
                              </DialogTrigger>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Members</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.memberCount || 0}</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active</span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{group.isActive ? group.memberCount || 0 : 0}</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        setSelectedGroup(group)
                        setShowMembersDialog(true)
                        loadGroupMembers(group.id)
                      }}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Members
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedGroup(group)
                        setShowAddMembersDialog(true)
                      }}
                      className="flex-1 min-w-[140px] bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-2xl py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Members
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Members Management Dialog */}
      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-[900px] max-h-[80vh] rounded-3xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="w-6 h-6 text-orange-500" />
              {selectedGroup?.name} Members ({groupMembers.length})
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 p-2">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {selectedMembers.length > 0 ? `${selectedMembers.length} selected` : `${groupMembers.length} members`}
                </span>
                {selectedMembers.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => handleBulkAction("delete")}
                    className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white rounded-xl px-4 py-2 font-semibold"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete Selected
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                onClick={() => {
                  setShowAddMembersDialog(true)
                  setShowMembersDialog(false)
                }}
                className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl px-4 py-2 font-semibold"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Add Members
              </Button>
            </div>

            <div className="border-2 border-orange-200/50 dark:border-gray-700/50 rounded-2xl max-h-[400px] overflow-y-auto bg-white/50 dark:bg-gray-900/50">
              <div className="p-4 space-y-2">
                {groupMembers.map((member: GroupMember, index: number) => (
                  <div
                    key={member.id || index}
                    className="flex items-center justify-between py-3 px-4 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-yellow-50/50 dark:hover:from-orange-900/10 dark:hover:to-yellow-900/10 rounded-xl transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={selectedMembers.includes(member.id || member.email)}
                        onCheckedChange={(checked) => {
                          const memberId = member.id || member.email
                          if (checked) {
                            setSelectedMembers([...selectedMembers, memberId])
                          } else {
                            setSelectedMembers(selectedMembers.filter((id) => id !== memberId))
                          }
                        }}
                      />
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {member.email[0]?.toUpperCase() || ""}
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-gray-900 dark:text-white">{member.email}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Added{" "}
                          {(member.createdAt || member.joinedDate)
                            ? new Date(
                                member.createdAt
                                  ? member.createdAt
                                  : member.joinedDate as string
                              ).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(Number(selectedGroup?.id), Number(member.id))}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {groupMembers.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No members in this group yet</p>
                    <p className="text-sm">Add some members to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Members Dialog */}
      <Dialog open={showAddMembersDialog} onOpenChange={setShowAddMembersDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] rounded-3xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <UserPlus className="w-6 h-6 text-orange-500" />
              Add Members to {selectedGroup?.name}
            </DialogTitle>
          </DialogHeader>
          {/* Make the content scrollable if it overflows */}
          <div className="space-y-6 p-2 flex-1 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-orange-500" />
                  Add Multiple Emails
                </Label>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {newMembers.emails.trim()
                    ? `${newMembers.emails
                      .trim()
                      .split("\n")
                      .filter((email) => email.trim()).length
                    } emails entered`
                    : "0 emails"}
                </div>
              </div>

              <div className="relative">
                <Textarea
                  placeholder="Enter email addresses (one per line)&#10;&#10;Examples:&#10;john.doe@company.com&#10;jane.smith@example.org&#10;user@domain.co.uk"
                  value={newMembers.emails}
                  onChange={(e) => setNewMembers({ ...newMembers, emails: e.target.value })}
                  className="min-h-[240px] max-h-[320px] bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50 border-2 border-orange-200/50 dark:border-gray-600/50 hover:border-orange-400/70 focus:border-orange-500 transition-all duration-300 rounded-2xl resize-none text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner backdrop-blur-sm overflow-y-auto"
                  style={{ scrollbarWidth: "thin", scrollbarColor: "#fbbf24 #fff" }}
                />
                {newMembers.emails.trim() && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-lg text-xs font-medium">
                      {
                        newMembers.emails
                          .trim()
                          .split("\n")
                          .filter((email) => email.trim() && email.includes("@")).length
                      }{" "}
                      valid
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300">Formatting Tips</h4>
                    <ul className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• Enter one email address per line</li>
                      <li>• Invalid emails will be automatically skipped</li>
                      <li>• Duplicate emails will be ignored</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 sticky bottom-0 bg-white/95 dark:bg-gray-800/95 pt-4 pb-2 z-10">
              <Button
                variant="outline"
                onClick={() => setShowAddMembersDialog(false)}
                className="flex-1 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMembers}
                disabled={!newMembers.emails.trim()}
                className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add{" "}
                {newMembers.emails.trim()
                  ? newMembers.emails
                    .trim()
                    .split("\n")
                    .filter((email) => email.trim() && email.includes("@")).length
                  : 0}{" "}
                Members
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Statistics Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-500" />
              {selectedGroup?.name} - Statistics
            </DialogTitle>
          </DialogHeader>

          {groupStats && (
            <div className="space-y-6 p-2">
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {groupStats.memberCount || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Members</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {groupStats.memberCount || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Members</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {groupStats.totalEmailsSent || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Emails Sent</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {typeof groupStats.openRate === "number" ? groupStats.openRate : 99.9}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Open Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {groupsData?.pagination && (
        <div className="flex justify-center gap-2 mt-8">
          <Button 
            variant="outline" 
            onClick={() => setPage(page - 1)} 
            disabled={page === 1} 
            className="rounded-xl"
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-gray-600 dark:text-gray-400">
            Page {page} of {groupsData.pagination.totalPages || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage(page + 1)}
            disabled={!groupsData.pagination.hasNext}
            className="rounded-xl"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}