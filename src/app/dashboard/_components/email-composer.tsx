"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Send,
  Users,
  Eye,
  Code,
  Sparkles,
  Zap,
  Target,
  Mail,
  ImageIcon,
  Link,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"

const emailGroups = [
  { id: 1, name: "Newsletter Subscribers", count: 15420 },
  { id: 2, name: "Premium Customers", count: 8930 },
  { id: 3, name: "Trial Users", count: 3240 },
  { id: 4, name: "VIP Members", count: 567 },
]

const emailTemplates = [
  { id: 1, name: "Welcome Email", category: "Onboarding" },
  { id: 2, name: "Newsletter Template", category: "Marketing" },
  { id: 3, name: "Product Launch", category: "Announcement" },
  { id: 4, name: "Thank You", category: "Transactional" },
]

export const EmailComposer = () => {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [, setRecipients] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSending, setIsSending] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const handleSend = async () => {
    if (!subject.trim() || !content.trim() || !selectedGroup) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSending(true)
    try {
      const formData = new FormData()
      formData.append("subject", subject)
      formData.append("content", content)

      if (selectedGroup) {
        formData.append("groupId", selectedGroup)
      }

      if (scheduledDate) {
        formData.append("scheduledDate", scheduledDate.toISOString())
      }

      // Add attachments
      attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      await apiClient.sendEmail(formData)

      toast.success("Email sent successfully!")

      // Reset form
      setSubject("")
      setContent("")
      setRecipients([])
      setSelectedGroup(null)
      setScheduledDate(null)
      setAttachments([])
    } catch (error) {
      console.error("Send email error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  const handleSendEmail = () => {
    if (isScheduled && scheduleDate && scheduleTime) {
      const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`)
      setScheduledDate(scheduledDateTime)
    }
    handleSend()
  }

  const handleScheduleEmail = () => {
    if (!scheduleDate || !scheduleTime) {
      toast.error("Please select date and time for scheduling")
      return
    }
    const scheduledDateTime = new Date(`${scheduleDate}T${scheduleTime}`)
    setScheduledDate(scheduledDateTime)
    handleSend()
  }

  const handleSaveDraft = () => {
    // Handle save draft logic
    toast.success("Draft saved successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-8">
      {/* Animated Header */}
      <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-2xl">
              <Send className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Email Composer
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Create and send beautiful email campaigns ✨</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Composer */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: "3s" }} />
                ✍️ Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipients */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />👥 Recipients
                </Label>
                <Select value={selectedGroup || ""} onValueChange={setSelectedGroup}>
                  <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 transition-all duration-300 rounded-2xl h-14">
                    <SelectValue placeholder="Select email group" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-orange-200">
                    {emailGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()} className="rounded-xl">
                        <div className="flex items-center justify-between w-full">
                          <span>{group.name}</span>
                          <Badge className="ml-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-0">
                            {group.count.toLocaleString()}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />📝 Subject Line
                </Label>
                <Input
                  placeholder="Enter email subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl h-14 text-lg"
                />
              </div>

              {/* Content Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-purple-500" />
                    ✉️ Email Content
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant={previewMode ? "outline" : "default"}
                      size="sm"
                      onClick={() => setPreviewMode(false)}
                      className="rounded-xl"
                    >
                      <Code className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant={previewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPreviewMode(true)}
                      className="rounded-xl"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </div>

                {!previewMode ? (
                  <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <Underline className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <AlignLeft className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <AlignCenter className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <AlignRight className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="rounded-xl">
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Write your email content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[300px] bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl resize-none"
                    />
                  </div>
                ) : (
                  <div className="min-h-[300px] p-6 bg-white dark:bg-gray-900 border-2 border-orange-200/50 dark:border-gray-700/50 rounded-2xl">
                    <div className="prose dark:prose-invert max-w-none">
                      <h3 className="text-xl font-bold mb-4">{subject || "Email Subject"}</h3>
                      <div className="whitespace-pre-wrap">{content || "Your email content will appear here..."}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Schedule Options */}
              <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="schedule"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                  />
                  <Label
                    htmlFor="schedule"
                    className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                  >
                    <Zap className="w-5 h-5 text-blue-500" />⏰ Schedule Email
                  </Label>
                </div>
                {isScheduled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">📅 Date</Label>
                      <Input
                        type="date"
                        value={scheduleDate}
                        onChange={(e) => setScheduleDate(e.target.value)}
                        className="bg-white/80 dark:bg-gray-900/80 border-blue-200 dark:border-gray-600 rounded-xl h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">⏰ Time</Label>
                      <Input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="bg-white/80 dark:bg-gray-900/80 border-blue-200 dark:border-gray-600 rounded-xl h-12"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-6">
                <Button
                  onClick={isScheduled ? handleScheduleEmail : handleSendEmail}
                  disabled={!selectedGroup || !subject || !content || isSending}
                  className="flex-1 min-w-[200px] bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {isScheduled ? "📅 Schedule Email" : "🚀 Send Now"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={isSending}
                  className="flex-1 min-w-[150px] border-2 border-orange-200 hover:border-orange-400 text-gray-700 dark:text-gray-300 rounded-2xl py-4 text-lg font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 bg-transparent"
                >
                  💾 Save Draft
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Templates */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />📄 Templates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTemplate || ""} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 rounded-xl h-12">
                  <SelectValue placeholder="Choose template" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {emailTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id.toString()} className="rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{template.name}</div>
                        <div className="text-xs text-gray-500">{template.category}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="w-full border-purple-200 hover:border-purple-400 text-purple-600 hover:text-purple-700 rounded-xl py-3 bg-transparent"
              >
                🎨 Create New Template
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200/50 dark:border-green-800/50 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />📊 Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">28,157</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">94.2%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Delivery Rate</div>
                </div>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">12,420</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Emails Sent This Month</div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200/50 dark:border-yellow-800/50 shadow-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />💡 Pro Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>📧 Subject Line:</strong> Keep it under 50 characters for better open rates
                </p>
              </div>
              <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>⏰ Best Time:</strong> Tuesday-Thursday, 10 AM - 2 PM
                </p>
              </div>
              <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>📱 Mobile:</strong> 60% of emails are opened on mobile devices
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
