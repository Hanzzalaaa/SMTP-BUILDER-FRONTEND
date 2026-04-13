"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
} from "lucide-react"
import { apiClient } from "@/lib/api"
import { toast } from "sonner"
import { useAppSelector } from "@/lib/store/hook"
import { RootState } from "@/lib/store/store"

export function SingleEmailComposer() {
  const [recipients, setRecipients] = useState({
    to: [] as string[],
    cc: [] as string[],
    bcc: [] as string[],
  })
  const [currentEmail, setCurrentEmail] = useState("")
  const [currentField, setCurrentField] = useState<"to" | "cc" | "bcc">("to")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [contentType, setContentType] = useState<"text" | "html">("html")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)


  const fileInputRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addRecipient = (field: "to" | "cc" | "bcc", email: string) => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (recipients[field].includes(email)) {
      toast.error("Email already added")
      return
    }

    setRecipients((prev) => ({
      ...prev,
      [field]: [...prev[field], email],
    }))
    setCurrentEmail("")
  }

  const removeRecipient = (field: "to" | "cc" | "bcc", email: string) => {
    setRecipients((prev) => ({
      ...prev,
      [field]: prev[field].filter((e) => e !== email),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent, field: "to" | "cc" | "bcc") => {
    if (e.key === "Enter" || e.key === "," || e.key === ";") {
      e.preventDefault()
      if (currentEmail.trim()) {
        addRecipient(field, currentEmail.trim())
      }
    }
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

    // Set cursor position
    setTimeout(() => {
      if (hasClosing && selectedText === "") {
        textarea.setSelectionRange(start + tag.length + 2, start + tag.length + 2)
      } else {
        textarea.setSelectionRange(start + newText.length, start + newText.length)
      }
      textarea.focus()
    }, 0)
  }

  const userEmail = useAppSelector((state : RootState) => state.auth.user?.email)
  const userName = useAppSelector((state : RootState) => state.auth.user?.name)

  const handleSend = async () => {
    if (recipients.to.length === 0) {
      toast.error("Please add at least one recipient")
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

      const emailData: {
        additionalRecipients: string[];
        subject: string;
        content: string;
        contentType: string;
        plainTextVersion?: string;
        attachments?: File[];
        scheduledDate?: string;
        senderName?: string;
        senderEmail?: string;
      } = {
        additionalRecipients: recipients.to,
        subject,
        content: htmlContent,
        contentType: contentType,
        plainTextVersion: plainTextContent,
        ...(attachments.length > 0 && { attachments }),
        ...(userName ? { senderName: userName } : {}),
        ...(userEmail ? { senderEmail: userEmail } : {}),
        ...(isScheduled && scheduleDate && scheduleTime
          ? { scheduledDate: new Date(`${scheduleDate}T${scheduleTime}`).toISOString() }
          : {}),
      }

      await apiClient.sendSingleEmail(emailData)

      toast.success("Email sent successfully!")

      // Reset form
      setRecipients({ to: [], cc: [], bcc: [] })
      setSubject("")
      setContent("")
      setAttachments([])
      setIsScheduled(false)
      setScheduleDate("")
      setScheduleTime("")

    } catch (error) {
      console.error("Send email error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsSending(false)
    }
  }

  const getTotalRecipients = () => {
    return recipients.to.length + recipients.cc.length + recipients.bcc.length
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
              <Mail className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Send Single Email
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Send personalized emails to individual recipients with HTML support ✨
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
                <Sparkles className="w-6 h-6 text-orange-500 animate-spin" style={{ animationDuration: "3s" }} />
                ✍️ Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Recipients */}
              <div className="space-y-4">
                {/* To Field */}
                <div className="space-y-3">
                  <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />📧 To
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-white/80 dark:bg-gray-900/80 border-2 border-orange-200 dark:border-gray-600 rounded-2xl min-h-[60px]">
                    {recipients.to.map((email, index) => (
                      <Badge
                        key={index}
                        className="bg-gradient-to-r from-blue-400 to-cyan-500 text-white border-0 px-3 py-2 rounded-full flex items-center gap-2"
                      >
                        {email}
                        <X
                          className="w-4 h-4 cursor-pointer hover:bg-white/20 rounded-full"
                          onClick={() => removeRecipient("to", email)}
                        />
                      </Badge>
                    ))}
                    <Input
                      placeholder="Enter email addresses (press Enter, comma, or semicolon to add)"
                      value={currentField === "to" ? currentEmail : ""}
                      onChange={(e) => {
                        if (currentField === "to") setCurrentEmail(e.target.value)
                      }}
                      onFocus={() => setCurrentField("to")}
                      onKeyDown={(e) => handleKeyPress(e, "to")}
                      onBlur={() => {
                        if (currentEmail.trim() && currentField === "to") {
                          addRecipient("to", currentEmail.trim())
                        }
                      }}
                      className="flex-1 min-w-[200px] border-0 bg-transparent focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>

                {/* CC/BCC Toggle */}
                <div className="flex gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCc(!showCc)}
                    className={`rounded-xl ${showCc ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" : ""}`}
                  >
                    CC
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBcc(!showBcc)}
                    className={`rounded-xl ${showBcc ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : ""}`}
                  >
                    BCC
                  </Button>
                </div>

                {/* CC Field */}
                {showCc && (
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">📋 CC</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-white/80 dark:bg-gray-900/80 border-2 border-blue-200 dark:border-gray-600 rounded-2xl min-h-[60px]">
                      {recipients.cc.map((email, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 px-3 py-2 rounded-full flex items-center gap-2"
                        >
                          {email}
                          <X
                            className="w-4 h-4 cursor-pointer hover:bg-white/20 rounded-full"
                            onClick={() => removeRecipient("cc", email)}
                          />
                        </Badge>
                      ))}
                      <Input
                        placeholder="Enter CC email addresses"
                        value={currentField === "cc" ? currentEmail : ""}
                        onChange={(e) => {
                          if (currentField === "cc") setCurrentEmail(e.target.value)
                        }}
                        onFocus={() => setCurrentField("cc")}
                        onKeyDown={(e) => handleKeyPress(e, "cc")}
                        onBlur={() => {
                          if (currentEmail.trim() && currentField === "cc") {
                            addRecipient("cc", currentEmail.trim())
                          }
                        }}
                        className="flex-1 min-w-[200px] border-0 bg-transparent focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* BCC Field */}
                {showBcc && (
                  <div className="space-y-3">
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">🔒 BCC</Label>
                    <div className="flex flex-wrap gap-2 p-3 bg-white/80 dark:bg-gray-900/80 border-2 border-purple-200 dark:border-gray-600 rounded-2xl min-h-[60px]">
                      {recipients.bcc.map((email, index) => (
                        <Badge
                          key={index}
                          className="bg-gradient-to-r from-purple-400 to-pink-500 text-white border-0 px-3 py-2 rounded-full flex items-center gap-2"
                        >
                          {email}
                          <X
                            className="w-4 h-4 cursor-pointer hover:bg-white/20 rounded-full"
                            onClick={() => removeRecipient("bcc", email)}
                          />
                        </Badge>
                      ))}
                      <Input
                        placeholder="Enter BCC email addresses"
                        value={currentField === "bcc" ? currentEmail : ""}
                        onChange={(e) => {
                          if (currentField === "bcc") setCurrentEmail(e.target.value)
                        }}
                        onFocus={() => setCurrentField("bcc")}
                        onKeyDown={(e) => handleKeyPress(e, "bcc")}
                        onBlur={() => {
                          if (currentEmail.trim() && currentField === "bcc") {
                            addRecipient("bcc", currentEmail.trim())
                          }
                        }}
                        className="flex-1 min-w-[200px] border-0 bg-transparent focus:ring-0 focus:outline-none"
                      />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => insertHtmlTag("br", false)}
                          className="rounded-xl text-xs"
                          title="Line Break"
                        >
                          BR
                        </Button>
                      </div>
                    )}
                    <Textarea
                      ref={contentRef}
                      placeholder={
                        contentType === "html"
                          ? "Write your email content here...\n\nYour plain text will be automatically converted to HTML formatting.\nEvery Enter press creates a line break (<br>).\n\nExample:\nWe're excited to share some important updates with you! 🎉\n\nHere's what's new:\n✅ Feature 1 - Description\n✅ Feature 2 - Description\n\nThank you for being part of our community!"
                          : "Write your plain text email content here...\n\nEvery Enter press creates a new line.\n\n💡 Your text gets automatically converted to HTML behind the scenes for proper formatting.\n\nExample:\nWe're excited to share some important updates with you! 🎉\n\nHere's what's new:\n✅ Feature 1 - Description\n✅ Feature 2 - Description\n\nThank you for being part of our community!"
                      }
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[400px] bg-white/80 dark:bg-gray-900/80 border-orange-200 dark:border-gray-600 hover:border-orange-400 focus:border-orange-500 transition-all duration-300 rounded-2xl resize-none font-mono text-sm"
                    />
                  </div>
                ) : (
                  <div className="min-h-[400px] p-6 bg-white dark:bg-gray-900 border-2 border-orange-200/50 dark:border-gray-700/50 rounded-2xl overflow-auto">
                    {contentType === "html" ? (
                      <div
                        className="prose dark:prose-invert max-w-none"
                                                 dangerouslySetInnerHTML={{ 
                           __html: (() => {
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
                               
                               return htmlContent || "<p>Your email content will appear here...</p>"
                             }
                             return content || "<p>Your email content will appear here...</p>"
                           })()
                         }}
                      />
                                         ) : (
                                               <div className="font-sans text-gray-800 dark:text-gray-200 leading-relaxed">
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
                    <Calendar className="w-5 h-5 text-blue-500" />⏰ Schedule Email
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
                  disabled={recipients.to.length === 0 || !subject || !content || isSending}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 text-white rounded-2xl py-4 text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Email Summary */}
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />📊 Email Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getTotalRecipients()}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Recipients</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{attachments.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Attachments</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">📧 To:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{recipients.to.length}</span>
                </div>
                {recipients.cc.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">📋 CC:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipients.cc.length}</span>
                  </div>
                )}
                {recipients.bcc.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">🔒 BCC:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{recipients.bcc.length}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">📄 Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {contentType === "html" ? "🌐 HTML" : "📝 Text"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* HTML Tips */}
          {contentType === "html" && (
            <Card className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200/50 dark:border-yellow-800/50 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-yellow-500" />💡 HTML Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>🎨 Styling:</strong> Use inline CSS for better email client compatibility
                  </p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>📱 Responsive:</strong> Use tables for layout and media queries
                  </p>
                </div>
                <div className="p-3 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>🖼️ Images:</strong> Always include alt text and absolute URLs
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
