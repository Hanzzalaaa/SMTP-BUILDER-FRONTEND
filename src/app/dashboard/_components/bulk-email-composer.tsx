"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    Send,
    Plus,
    X,
    Paperclip,
    Eye,
    Code,
    Sparkles,
    Calendar,
    Users,
    Mail,
    Bold,
    Italic,
    Underline,
    Link,
    ImageIcon,
    List,
    ListOrdered,
    Zap,
    CheckCircle,
    AlertCircle,
    Clock,
    Target,
    TrendingUp,
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useAppSelector } from "@/lib/store/hook"
import { RootState } from "@/lib/store/store"

interface EmailGroup {
    id: number
    name: string
    memberCount: number
    description?: string
}

interface JobStatus {
    jobId: string
    status: "queued" | "processing" | "completed" | "failed"
    createdAt?: string
    completedAt?: string
    progress?: {
        total: number
        processed: number
        successful: number
        failed: number
    }
    error?: string
    result?: {
        jobId: string
        totalEmails: number
        sentEmails: number
        failedEmails: number
        batches: number
        errors: string[]
        completedAt: string
        success: boolean
    }
}



export function BulkEmailComposer() {
    const [subject, setSubject] = useState("")
    const [content, setContent] = useState("")
    const [contentType, setContentType] = useState<"text" | "html">("html")
    const [selectedGroup, setSelectedGroup] = useState<string>("")
    const [emailGroups, setEmailGroups] = useState<EmailGroup[]>([])
    const [attachments, setAttachments] = useState<File[]>([])
    const [isScheduled, setIsScheduled] = useState(false)
    const [scheduleDate, setScheduleDate] = useState("")
    const [scheduleTime, setScheduleTime] = useState("")
    const [isSending, setIsSending] = useState(false)
    const [previewMode, setPreviewMode] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Job tracking states
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null)
    const [showJobDialog, setShowJobDialog] = useState(false)
    const [, setJobPollingInterval] = useState<NodeJS.Timeout | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)

    



    

    useEffect(() => {
        setMounted(true)
        fetchEmailGroups()
    }, [])

    const fetchEmailGroups = async () => {
        try {
            const response = await apiClient.getUserEmailGroups()
            // response is of type unknown, so we need to check/parse it
            if (
                response &&
                typeof response === "object" &&
                "groups" in response &&
                Array.isArray((response as { groups?: unknown }).groups)
            ) {
                setEmailGroups((response as { groups: EmailGroup[] }).groups)
            } else {
                setEmailGroups([])
                toast.error("Unexpected response format when loading email groups")
            }
        } catch (error) {
            console.error("Failed to fetch email groups:", error)
            toast.error("Failed to load email groups")
        }
    }

    // Get email and name from Redux store (from auth slice)

    const userEmail = useAppSelector((state: RootState) => state.auth.user?.email);
    const userName = useAppSelector((state: RootState) => state.auth.user?.name);


    const startJobPolling = (jobId: string) => {
        const interval = setInterval(async () => {
            try {
                const status = await apiClient.getBulkSendStatus(jobId)
                // Ensure status is an object and has the expected properties
                if (
                    status &&
                    typeof status === "object" &&
                    "status" in status
                ) {
                    setJobStatus(status as JobStatus)

                    if (
                        (status as JobStatus).status === "completed" ||
                        (status as JobStatus).status === "failed"
                    ) {
                        clearInterval(interval)
                        setJobPollingInterval(null)
                    }
                } else {
                    throw new Error("Unexpected status response format")
                }

                if ((status as JobStatus).status === "completed") {
                    const progress = (status as JobStatus).progress;
                    toast.success(`Bulk email sent successfully! ${progress?.successful || 0} emails delivered.`);
                } else if ((status as JobStatus).status === "failed") {
                    const errorMsg = (status as JobStatus).error || "Unknown error";
                    toast.error(`Bulk email failed: ${errorMsg}`);
                }
            } catch (error) {
                console.error("Failed to fetch job status:", error);
                clearInterval(interval);
                setJobPollingInterval(null);
            }
        }, 2000)

        setJobPollingInterval(interval)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const maxSize = 10 * 1024 * 1024 // 10MB

        const validFiles = files.filter((file) => {
            if (file.size > maxSize) {
                toast.error(`File ${file.name} is too large (max 10MB)`)
                return false
            }
            return true
        })

        setAttachments((prev) => [...prev, ...validFiles])
    }

    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index))
    }

    const insertHtmlTag = (tag: string, hasClosing = true) => {
        if (!contentRef.current) return

        const textarea = contentRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = content.substring(start, end)

        let newText = ""
        if (hasClosing) {
            newText = `<${tag}>${selectedText}</${tag}>`
        } else {
            newText = `<${tag}>`
        }

        const newContent = content.substring(0, start) + newText + content.substring(end)
        setContent(newContent)

        setTimeout(() => {
            if (hasClosing && selectedText === "") {
                textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2)
            } else {
                textarea.setSelectionRange(start + newText.length, start + newText.length)
            }
            textarea.focus()
        }, 0)
    }



    const handleSend = async () => {
        if (!selectedGroup) {
            toast.error("Please select an email group")
            return
        }

        if (!subject.trim()) {
            toast.error("Please enter a subject")
            return
        }

        if (!content.trim()) {
            toast.error("Please enter email content")
            return
        }


        setIsSending(true)
        try {
            // Always convert plain text content to HTML for proper formatting
            let htmlContent = content
            const plainTextContent = content
            
            // Convert plain text to basic HTML formatting (for both HTML and Plain Text modes)
            // First, handle special patterns that should be paragraphs
            if (content.includes('✅')) {
                htmlContent = htmlContent.replace(
                    /^✅.*$/gm,
                    match => `<li>${match}</li>`
                )
                // Wrap list items in ul tags
                htmlContent = htmlContent.replace(
                    /(<li>.*?<\/li>)/g,
                    '<ul>$1</ul>'
                )
            }
            
            if (content.includes('👉')) {
                htmlContent = htmlContent.replace(
                    /^👉.*$/gm,
                    match => `<p style="text-align: center; margin: 20px 0;"><strong>${match}</strong></p>`
                )
            }
            
            if (content.includes('Here\'s what\'s new:')) {
                htmlContent = htmlContent.replace(
                    /^Here's what's new:.*$/gm,
                    match => `<h2>${match}</h2>`
                )
            }
            
            if (content.includes('We\'re excited to share')) {
                htmlContent = htmlContent.replace(
                    /^We're excited to share.*$/gm,
                    match => `<h1>${match}</h1>`
                )
            }
            
            if (content.includes('Thank you for being part')) {
                htmlContent = htmlContent.replace(
                    /^Thank you for being part.*$/gm,
                    match => `<p><strong>${match}</strong></p>`
                )
            }
            
            if (content.includes('Warm regards')) {
                htmlContent = htmlContent.replace(
                    /^Warm regards.*$/gm,
                    match => `<p><strong>${match}</strong><br>${userName || 'Your Team'}</p>`
                )
            }
            
            // Now convert all remaining single line breaks to <br> tags
            htmlContent = htmlContent.replace(/\n/g, '<br>')
            
            // Wrap content in paragraphs if it's not already wrapped
            if (!htmlContent.startsWith('<')) {
                htmlContent = `<p>${htmlContent}</p>`
            }
            
            // Clean up multiple <br> tags and wrap in paragraphs
            htmlContent = htmlContent
                .replace(/<br><br>/g, '</p><p>')
                .replace(/^<br>/, '')
                .replace(/<br>$/g, '')
            
            // Ensure proper paragraph structure
            if (!htmlContent.startsWith('<p>')) {
                htmlContent = `<p>${htmlContent}`
            }
            if (!htmlContent.endsWith('</p>')) {
                htmlContent = `${htmlContent}</p>`
            }
            
            // For plain text mode, always send as HTML but keep contentType as "text"
            // This ensures the email looks formatted but is marked as plain text
            if (contentType === "text") {
                // Keep htmlContent as HTML for proper formatting
                // But contentType remains "text" for the API
            }

            const emailData = {
                groupId: Number.parseInt(selectedGroup),
                subject,
                body: {
                    content: htmlContent,
                    contentType: contentType,
                    plainTextVersion: plainTextContent,
                },
                fromEmail: userEmail ?? "",
                fromName: userName ?? undefined,
            }

            const response = await apiClient.bulkSendEmails(emailData)

            // Remove 'any' by defining a type for the response
            type BulkSendResponse = { jobId?: string; status?: "queued" | "processing" | "completed" | "failed" };

            const jobResponse = response as BulkSendResponse;

            if (jobResponse.jobId) {
                // Job-based response - start tracking
                setJobStatus({
                    jobId: jobResponse.jobId,
                    status: jobResponse.status || "queued",
                });
                setShowJobDialog(true);
                startJobPolling(jobResponse.jobId);
                toast.success("Bulk email job started! Tracking progress...");
            } else {
                // Direct response
                toast.success("Bulk email sent successfully!");
            }

            // Reset form
            setSubject("")
            setContent("")
            setSelectedGroup("")
            setAttachments([])
            setIsScheduled(false)
            setScheduleDate("")
            setScheduleTime("")
        } catch (error) {
            console.error("Send bulk email error:", error)
            toast.error(error instanceof Error ? error.message : "Failed to send bulk email")
        } finally {
            setIsSending(false)
        }
    }

    const getSelectedGroupInfo = () => {
        return emailGroups.find((group) => group.id.toString() === selectedGroup)
    }

    const getJobStatusIcon = () => {
        if (!jobStatus) return <Clock className="w-5 h-5 text-gray-500" />

        switch (jobStatus.status) {
            case "queued":
                return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />
            case "processing":
                return <Zap className="w-5 h-5 text-orange-500 animate-spin" />
            case "completed":
                return <CheckCircle className="w-5 h-5 text-green-500" />
            case "failed":
                return <AlertCircle className="w-5 h-5 text-red-500" />
            default:
                return <Clock className="w-5 h-5 text-gray-500" />
        }
    }

    const getJobProgress = () => {
        if (!jobStatus?.progress) return 0
        return Math.round((jobStatus.progress.processed / jobStatus.progress.total) * 100)
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-yellow-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 space-y-8">
            {/* Header */}
            <div className="relative overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-orange-200/50 dark:border-gray-700/50 p-8">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-yellow-500/10 to-orange-500/10 animate-pulse"></div>
                <div className="relative flex items-center gap-4">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-2xl blur-lg opacity-75 animate-pulse"></div>
                        <div className="relative bg-gradient-to-r from-orange-400 to-yellow-500 p-4 rounded-2xl">
                            <Users className="w-8 h-8 text-white animate-bounce" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                            Bulk Email Campaign
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Send emails to entire groups with background processing 🚀
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Composer */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: "3s" }} />📧
                                Compose Bulk Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Group Selection */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-500" />👥 Select Email Group
                                </Label>
                                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                                    <SelectTrigger className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 transition-all duration-300 rounded-2xl h-14">
                                        <SelectValue placeholder="Choose an email group to send to" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-orange-200">
                                        {emailGroups.map((group) => (
                                            <SelectItem key={group.id} value={group.id.toString()} className="rounded-xl">
                                                <div className="flex items-center justify-between w-full">
                                                    <div className="flex flex-col items-start">
                                                        <span className="font-medium">{group.name}</span>
                                                        {group.description && <span className="text-xs text-gray-500">{group.description}</span>}
                                                    </div>
                                                    <Badge className="ml-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0">
                                                        {group.memberCount.toLocaleString()} members
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedGroup && (
                                    <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-5 h-5 text-blue-500" />
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                📊 This email will be sent to{" "}
                                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                                    {getSelectedGroupInfo()?.memberCount.toLocaleString()}
                                                </span>{" "}
                                                recipients
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subject */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-green-500" />📝 Subject Line
                                </Label>
                                <Input
                                    placeholder="Enter email subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl h-14 text-lg"
                                />
                            </div>



                            {/* Content Type Toggle */}
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">📄 Content Type:</Label>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="html"
                                            name="contentType"
                                            checked={contentType === "html"}
                                            onChange={() => setContentType("html")}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <Label htmlFor="html" className="cursor-pointer">
                                            🌐 HTML
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            id="text"
                                            name="contentType"
                                            checked={contentType === "text"}
                                            onChange={() => setContentType("text")}
                                            className="w-4 h-4 text-orange-500"
                                        />
                                        <Label htmlFor="text" className="cursor-pointer">
                                            📝 Plain Text
                                        </Label>
                                    </div>
                                </div>
                                {contentType === "text" && (
                                    <div className="ml-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                        <p className="text-xs text-yellow-700 dark:text-yellow-300">
                                            💡 Plain text emails have better deliverability and are more accessible
                                        </p>
                                    </div>
                                )}
                                {contentType === "html" && (
                                    <div className="ml-4 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            💡 Your plain text will be automatically converted to HTML formatting
                                        </p>
                                    </div>
                                )}
                                {contentType === "text" && (
                                    <div className="ml-4 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                        <p className="text-xs text-green-700 dark:text-green-300">
                                            💡 Plain text emails have better deliverability and are more accessible
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                            🔧 Behind the scenes: Your text gets converted to HTML for proper formatting
                                        </p>
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                            📱 Preview shows how your email will actually look when sent
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Content Editor */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Code className="w-5 h-5 text-purple-500" />
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
                                        {contentType === "html" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setContent(`We're excited to share some important updates with you! 🎉

Over the past few weeks, our team has been working hard to bring you new features, better support, and exclusive opportunities designed to help you get the most out of [Your Product/Service].

Here's what's new:
✅ [Highlight 1 – e.g., "Faster, easier access to…"]
✅ [Highlight 2 – e.g., "New feature to help you…"]
✅ [Highlight 3 – e.g., "Special offer available until…"]

We'd love for you to take advantage of these updates and continue growing with us.

👉 [Call-to-Action Button: "Get Started Now" / "Claim Your Offer" / "Learn More"]

Thank you for being part of our community — your support means the world to us.

Warm regards,`)
                                                }}
                                                className="rounded-xl"
                                            >
                                                📝 Load Example
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {!previewMode ? (
                                    <div className="space-y-4">
                                        {/* HTML Toolbar */}
                                        {contentType === "html" && (
                                            <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-orange-50/80 to-yellow-50/80 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-800/50">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("strong")}
                                                    className="rounded-xl"
                                                    title="Bold"
                                                >
                                                    <Bold className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("em")}
                                                    className="rounded-xl"
                                                    title="Italic"
                                                >
                                                    <Italic className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("u")}
                                                    className="rounded-xl"
                                                    title="Underline"
                                                >
                                                    <Underline className="w-4 h-4" />
                                                </Button>
                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("h1")}
                                                    className="rounded-xl text-xs"
                                                    title="Heading 1"
                                                >
                                                    H1
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("h2")}
                                                    className="rounded-xl text-xs"
                                                    title="Heading 2"
                                                >
                                                    H2
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("h3")}
                                                    className="rounded-xl text-xs"
                                                    title="Heading 3"
                                                >
                                                    H3
                                                </Button>
                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("ul")}
                                                    className="rounded-xl"
                                                    title="Unordered List"
                                                >
                                                    <List className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("ol")}
                                                    className="rounded-xl"
                                                    title="Ordered List"
                                                >
                                                    <ListOrdered className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag("li")}
                                                    className="rounded-xl text-xs"
                                                    title="List Item"
                                                >
                                                    LI
                                                </Button>
                                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag('a href=""')}
                                                    className="rounded-xl"
                                                    title="Link"
                                                >
                                                    <Link className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => insertHtmlTag('img src="" alt=""', false)}
                                                    className="rounded-xl"
                                                    title="Image"
                                                >
                                                    <ImageIcon className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                        <Textarea
                                            ref={contentRef}
                                            placeholder={
                                                contentType === "html"
                                                    ? "Write your email content here...\n\nYour plain text will be automatically converted to HTML formatting.\nEvery Enter press creates a line break (<br>).\n\nExample:\nWe're excited to share some important updates with you! 🎉\n\nHere's what's new:\n✅ Feature 1 - Description\n✅ Feature 2 - Description\n\nThank you for being part of our community!"
                                                    : "Write your plain text email content here...\n\nEvery Enter press creates a new line.\n\nExample:\nWe're excited to share some important updates with you! 🎉\n\nHere's what's new:\n✅ Feature 1 - Description\n✅ Feature 2 - Description\n\nThank you for being part of our community!"
                                            }
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            className="min-h-[400px] bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl resize-none font-mono text-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="min-h-[400px] bg-white dark:bg-gray-900 border-2 border-orange-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden">
                                        <div className="p-4 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 border-b border-blue-200/50 dark:border-blue-800/50">
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                                <Eye className="w-4 h-4 text-blue-500" />📧 Email Preview (How it will look in email clients)
                                            </div>
                                        </div>
                                        {contentType === "html" ? (
                                            <iframe
                                                srcDoc={
                                                    (() => {
                                                        // Convert plain text to HTML for preview
                                                        if (contentType === "html") {
                                                            let htmlContent = content
                                                            
                                                            // Handle special patterns first
                                                            if (content.includes('✅')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^✅.*$/gm,
                                                                    match => `<li>${match}</li>`
                                                                )
                                                                // Wrap list items in ul tags
                                                                htmlContent = htmlContent.replace(
                                                                    /(<li>.*?<\/li>)/g,
                                                                    '<ul>$1</ul>'
                                                                )
                                                            }
                                                            
                                                            if (content.includes('👉')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^👉.*$/gm,
                                                                    match => `<p style="text-align: center; margin: 20px 0;"><strong>${match}</strong></p>`
                                                                )
                                                            }
                                                            
                                                            if (content.includes('Here\'s what\'s new:')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^Here's what's new:.*$/gm,
                                                                    match => `<h2>${match}</h2>`
                                                                )
                                                            }
                                                            
                                                            if (content.includes('We\'re excited to share')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^We're excited to share.*$/gm,
                                                                    match => `<h1>${match}</h1>`
                                                                )
                                                            }
                                                            
                                                            if (content.includes('Thank you for being part')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^Thank you for being part.*$/gm,
                                                                    match => `<p><strong>${match}</strong></p>`
                                                                )
                                                            }
                                                            
                                                            if (content.includes('Warm regards')) {
                                                                htmlContent = htmlContent.replace(
                                                                    /^Warm regards.*$/gm,
                                                                    match => `<p><strong>${match}</strong><br>${userName || 'Your Team'}</p>`
                                                                )
                                                            }
                                                            
                                                            // Now convert all remaining single line breaks to <br> tags
                                                            htmlContent = htmlContent.replace(/\n/g, '<br>')
                                                            
                                                            // Wrap content in paragraphs if it's not already wrapped
                                                            if (!htmlContent.startsWith('<')) {
                                                                htmlContent = `<p>${htmlContent}</p>`
                                                            }
                                                            
                                                            // Clean up multiple <br> tags and wrap in paragraphs
                                                            htmlContent = htmlContent
                                                                .replace(/<br><br>/g, '</p><p>')
                                                                .replace(/^<br>/, '')
                                                                .replace(/<br>$/g, '')
                                                            
                                                            // Ensure proper paragraph structure
                                                            if (!htmlContent.startsWith('<p>')) {
                                                                htmlContent = `<p>${htmlContent}`
                                                            }
                                                            if (!htmlContent.endsWith('</p>')) {
                                                                htmlContent = `${htmlContent}</p>`
                                                            }
                                                            
                                                            return htmlContent || "<p style='padding: 20px; font-family: Arial, sans-serif; color: #666;'>Your email content will appear here...</p>"
                                                        }
                                                        return content || "<p style='padding: 20px; font-family: Arial, sans-serif; color: #666;'>Your email content will appear here...</p>"
                                                    })()
                                                }
                                                className="w-full h-[360px] border-0"
                                                title="Email Preview"
                                                sandbox="allow-same-origin"
                                            />
                                        ) : (
                                            <div className="p-6 font-sans text-gray-800 dark:text-gray-200 leading-relaxed h-[360px] overflow-auto">
                                                {content ? (
                                                    content.split('\n').map((line, index) => {
                                                        if (line.trim() === '') return <br key={index} />
                                                        
                                                        // Format special patterns for plain text
                                                        if (line.startsWith('✅')) {
                                                            return (
                                                                <div key={index} className="flex items-start gap-2 mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">
                                                                    <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
                                                                    <span className="flex-1">{line.substring(1).trim()}</span>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                        if (line.startsWith('👉')) {
                                                            return (
                                                                <div key={index} className="text-center mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                    <span className="text-blue-600 dark:text-blue-400 text-lg">👉</span>
                                                                    <span className="ml-2 font-semibold">{line.substring(1).trim()}</span>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                        if (line.startsWith('Here\'s what\'s new:')) {
                                                            return (
                                                                <h3 key={index} className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-6 first:mt-0">
                                                                    {line}
                                                                </h3>
                                                            )
                                                        }
                                                        
                                                        if (line.startsWith('We\'re excited to share')) {
                                                            return (
                                                                <h2 key={index} className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 first:mt-0">
                                                                    {line}
                                                                </h2>
                                                            )
                                                        }
                                                        
                                                        if (line.startsWith('Thank you for being part')) {
                                                            return (
                                                                <p key={index} className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
                                                                    {line}
                                                                </p>
                                                            )
                                                        }
                                                        
                                                        if (line.startsWith('Warm regards')) {
                                                            return (
                                                                <div key={index} className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                                                                        {line}
                                                                    </p>
                                                                    <p className="text-gray-600 dark:text-gray-400">
                                                                        {userName || 'Your Team'}
                                                                    </p>
                                                                </div>
                                                            )
                                                        }
                                                        
                                                        // Default line formatting
                                                        return (
                                                            <p key={index} className="mb-2 text-gray-700 dark:text-gray-300 leading-6">
                                                                {line}
                                                            </p>
                                                        )
                                                    })
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 italic">
                                                        Your email content will appear here...
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Attachments */}
                            <div className="space-y-3">
                                <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <Paperclip className="w-5 h-5 text-purple-500" />📎 Attachments
                                </Label>
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full border-2 border-dashed border-orange-200 hover:border-orange-400 text-gray-700 dark:text-gray-300 rounded-2xl py-6 text-lg font-semibold hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 bg-transparent"
                                    >
                                        <Plus className="w-5 h-5 mr-2" />📎 Add Attachments
                                    </Button>
                                    <input ref={fileInputRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                                    {attachments.length > 0 && (
                                        <div className="space-y-2">
                                            {attachments.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Paperclip className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{file.name}</span>
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeAttachment(index)}
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Schedule Options */}
                            <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
                                <div className="flex items-center gap-3">
                                    <Switch id="schedule" checked={isScheduled} onCheckedChange={setIsScheduled} />
                                    <Label
                                        htmlFor="schedule"
                                        className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
                                    >
                                        <Calendar className="w-5 h-5 text-blue-500" />⏰ Schedule Bulk Email
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
                                                min={new Date().toISOString().split("T")[0]}
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

                            {/* Send Button */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    onClick={handleSend}
                                    disabled={!selectedGroup || !subject || !content || isSending}
                                    className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSending ? (
                                        <>
                                            <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5 mr-2" />
                                            {isScheduled ? "📅 Schedule Bulk Email" : "🚀 Send to Group"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Campaign Summary */}
                    <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />📊 Campaign Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="text-center p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                        {selectedGroup ? getSelectedGroupInfo()?.memberCount.toLocaleString() || "0" : "0"}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Recipients</div>
                                </div>
                                <div className="text-center p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{attachments.length}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Attachments</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">📧 Group:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {selectedGroup ? getSelectedGroupInfo()?.name || "None" : "None"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">📄 Type:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {contentType === "html" ? "🌐 HTML" : "📝 Text"}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">⏰ Schedule:</span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {isScheduled ? "📅 Scheduled" : "🚀 Send Now"}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Bulk Email Tips */}
                    <Card className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200/50 dark:border-yellow-800/50 shadow-2xl">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />💡 Bulk Email Tips
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>🎯 Personalization:</strong> Use merge tags like {"{name}"} for better engagement
                                </p>
                            </div>
                            <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>⚡ Background Processing:</strong> Large campaigns are processed in the background
                                </p>
                            </div>
                            <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <strong>📊 Tracking:</strong> Monitor delivery status in real-time
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Job Progress Dialog */}
            <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
                <DialogContent className="sm:max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-0 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                            {getJobStatusIcon()}📊 Bulk Email Progress
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        {jobStatus && (
                            <>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
                                        <Badge
                                            className={`${jobStatus.status === "completed"
                                                ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                                                : jobStatus.status === "failed"
                                                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                    : jobStatus.status === "processing"
                                                        ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                                                        : "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                } border-0 capitalize`}
                                        >
                                            {jobStatus.status}
                                        </Badge>
                                    </div>

                                    {/* Enhanced: Show result details if available */}
                                    {jobStatus.result ? (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Total Emails:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {jobStatus.result.totalEmails}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Sent:</span>
                                                    <span className="font-medium text-green-700 dark:text-green-400">
                                                        {jobStatus.result.sentEmails}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Failed:</span>
                                                    <span className="font-medium text-red-700 dark:text-red-400">
                                                        {jobStatus.result.failedEmails}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Batches:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {jobStatus.result.batches}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Success:</span>
                                                    <span className={`font-medium ${jobStatus.result.success ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                                                        {jobStatus.result.success ? "Yes" : "No"}
                                                    </span>
                                                </div>
                                            </div>
                                            {/* Show errors if present */}
                                            {Array.isArray(jobStatus.result.errors) && jobStatus.result.errors.length > 0 && (
                                                <div className="p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl mt-2">
                                                    <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
                                                        <strong>Error{jobStatus.result.errors.length > 1 ? "s" : ""}:</strong>
                                                    </p>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {jobStatus.result.errors.map((err: string, idx: number) => (
                                                            <li key={idx} className="text-sm text-red-600 dark:text-red-400">{err}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {jobStatus.result.completedAt && (
                                                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Completed at: {new Date(jobStatus.result.completedAt).toLocaleString()}
                                                </div>
                                            )}
                                        </>
                                    ) : jobStatus.progress ? (
                                        <>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {jobStatus.progress.processed} / {jobStatus.progress.total}
                                                    </span>
                                                </div>
                                                <Progress value={getJobProgress()} className="h-3" />
                                                <div className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {getJobProgress()}% Complete
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-3 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                                                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                                                        {jobStatus.progress.successful}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Successful</div>
                                                </div>
                                                <div className="text-center p-3 bg-gradient-to-br from-red-50/80 to-pink-50/80 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl">
                                                    <div className="text-lg font-bold text-red-600 dark:text-red-400">
                                                        {jobStatus.progress.failed}
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400">Failed</div>
                                                </div>
                                            </div>
                                        </>
                                    ) : null}

                                    {/* Fallback error */}
                                    {jobStatus.error && (
                                        <div className="p-3 bg-red-50/80 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-xl">
                                            <p className="text-sm text-red-600 dark:text-red-400">
                                                <strong>Error:</strong> {jobStatus.error}
                                            </p>
                                        </div>
                                    )}

                                    {/* Fallback completedAt */}
                                    {jobStatus.completedAt && !jobStatus.result?.completedAt && (
                                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                            Completed at: {new Date(jobStatus.completedAt).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => setShowJobDialog(false)}
                                        className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-xl"
                                    >
                                        {jobStatus.status === "completed" || jobStatus.status === "failed"
                                            ? "Close"
                                            : "Continue in Background"}
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
