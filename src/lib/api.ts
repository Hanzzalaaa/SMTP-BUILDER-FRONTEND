const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URI || "http://localhost:3000"

// Custom error type for API errors
interface ApiError extends Error {
  statusCode?: number
}

// API client with authentication
class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  // Get token from multiple sources (localStorage, cookies)
  private getToken(): string | null {
    if (typeof window === "undefined") return null

    // Try localStorage first
    let token = localStorage.getItem("auth_token")

    // If not in localStorage, try cookies
    if (!token) {
      const cookies = document.cookie.split(";")
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith("auth_token="))
      if (authCookie) {
        token = authCookie.split("=")[1]
      }
    }

    return token
  }

  private async payemntRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {

    const url = `${this.baseURL}/api/payments${endpoint}`
    const token = this.getToken()

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Always add Authorization header if token exists
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    // Always include credentials for cookie-based auth
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Include cookies in requests
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        // Handle 401 Unauthorized - throw error to let the calling code handle it properly
        if (response.status === 401) {
          const error = new Error("Authentication required") as ApiError
          error.statusCode = 401
          throw error
        }

        const error = await response.json().catch(() => ({ message: "Network error" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }

  }


  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/api/emails${endpoint}`
    const token = this.getToken()

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Always add Authorization header if token exists
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    // Always include credentials for cookie-based auth
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Include cookies in requests
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        // Handle 401 Unauthorized - throw error to let the calling code handle it properly
        if (response.status === 401) {
          const error = new Error("Authentication required") as ApiError
          error.statusCode = 401
          throw error
        }

        const error = await response.json().catch(() => ({ message: "Network error" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  private async userRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}/api/users${endpoint}`
    const token = this.getToken()

    const headers: HeadersInit = {
      ...options.headers,
    }

    // Always add Authorization header if token exists
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    // Only add Content-Type for non-FormData requests
    if (!(options.body instanceof FormData)) {
      (headers as Record<string, string>)["Content-Type"] = "application/json";
    }

    // Always include credentials for cookie-based auth
    const requestOptions: RequestInit = {
      ...options,
      headers,
      credentials: "include", // Include cookies in requests
    }

    try {
      const response = await fetch(url, requestOptions)

      if (!response.ok) {
        // Handle 401 Unauthorized - throw error to let the calling code handle it properly
        if (response.status === 401) {
          const error = new Error("Authentication required") as ApiError
          error.statusCode = 401
          throw error
        }

        const error = await response.json().catch(() => ({ message: "Network error" }))
        throw new Error(error.message || `HTTP ${response.status}`)
      }

      return response.json()
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // Health check
  async health() {
    return this.request("/health")
  }

  // Get sent emails with pagination
  async getSentEmails(page = 1, limit = 10) {
    return this.request(`/sent?page=${page}&limit=${limit}`)
  }

  // Get email details
  async getEmailDetails(emailId: string) {
    return this.request(`/${emailId}`)
  }

  // Get quota status
  async getQuotaStatus() {
    return this.request("/quota/status")
  }

  // Get email status
  async getEmailStatus(emailId: number) {
    return this.request(`/status/${emailId}`)
  }

  // Email Groups
  async createEmailGroup(data: { name: string; description?: string }) {
    return this.request("/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async addEmailsToGroup(groupId: number, data: { emails: string[]; names?: string[] }) {
    const payload = { ...data }
    return this.request(`/${groupId}/emails`, {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async getUserEmailGroups(page = 1, limit = 20, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (search) params.append("search", search)

    return this.request(`/get/allEmailGroups?${params}`)
  }

  async getEmailGroupDetails(groupId: number, page = 1, limit = 20) {
    return this.request(`/getEmailGroup/${groupId}?page=${page}&limit=${limit}`)
  }

  async updateEmailGroup(groupId: number, data: { name?: string; description?: string }) {
    return this.request(`/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteEmailGroup(groupId: number) {
    return this.request(`/deleteGroup/${groupId}`, {
      method: "DELETE",
    })
  }

  async removeEmailFromGroup(groupId: number, memberId: number) {
    return this.request(`/${groupId}/members/${memberId}`, {
      method: "DELETE",
    })
  }

  async getGroupMembers(groupId: number, page = 1, limit = 50, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (search) params.append("search", search)

    return this.request(`/${groupId}/members?${params}`)
  }

  async getGroupStats(groupId: number) {
    return this.request(`/${groupId}/stats`)
  }

  async duplicateEmailGroup(groupId: number, newName: string) {
    return this.request(`/${groupId}/duplicate`, {
      method: "POST",
      body: JSON.stringify({ name: newName }),
    })
  }

  // Bulk operations
  async bulkImportEmails(data: { groupId: number; emails: string[]; names?: string[] }) {
    return this.request("/bulk/import", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBulkImportStatus(jobId: string) {
    return this.request(`/bulk/import/status/${jobId}`)
  }

  async bulkSendEmails(data: { 
    groupId: number; 
    subject: string; 
    body: {
      content: string;
      contentType: string;
      plainTextVersion?: string;
    };
    fromEmail: string; 
    fromName?: string 
  }) {
    return this.request("/bulk/send", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getBulkSendStatus(jobId: string) {
    return this.request(`/bulk-send/status/${jobId}`)
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request("/get/allStats")
  }

  // Email Templates
  async getEmailTemplates(page = 1, limit = 20, category?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    if (category) params.append("category", category)

    return this.request(`/templates?${params}`)
  }

  async createEmailTemplate(data: { name: string; subject: string; content: string; category?: string }) {
    return this.request("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateEmailTemplate(
    templateId: number,
    data: { name?: string; subject?: string; content?: string; category?: string },
  ) {
    return this.request(`/templates/${templateId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteEmailTemplate(templateId: number) {
    return this.request(`/templates/${templateId}`, {
      method: "DELETE",
    })
  }

  async getEmailTemplate(templateId: number) {
    return this.request(`/templates/${templateId}`)
  }

  // User Settings
  async getUserSettings() {
    return this.userRequest("/settings")
  }

  async enterUserName(data: { name: string, email: string }) {
    return this.userRequest("/name", {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  }

  async updateUserSettings(data: { name?: string; email?: string }) {
    return this.userRequest("/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Billing
  async getBillingInfo() {
    return this.payemntRequest("/plans")
  }

  async updateBillingInfo(data: Record<string, unknown>) {
    return this.request("/billing", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // current plan

  async getCurrentPlan() {
    return this.payemntRequest("/subscription/status")
  }

  async upgradeSubscription(planId: string) {
    return this.payemntRequest("/initialize", {
      method: "POST",
      body: JSON.stringify({ planCode : planId, callbackUrl: `${window.location.origin}/payment/callback` }),
    })
  }

  async verifySubscription(reference: string) {
    return this.payemntRequest(`/verify/${reference}`, {
      method: "POST",
    })
  }

  // Analytics
  async getEmailAnalytics(emailId: number) {
    return this.request(`/analytics/${emailId}`)
  }

  async getCampaignAnalytics(campaignId: number) {
    return this.request(`/analytics/campaigns/${campaignId}`)
  }

  async getOverallAnalytics(dateRange?: { start: string; end: string }) {
    const params = new URLSearchParams()
    if (dateRange) {
      params.append("start", dateRange.start)
      params.append("end", dateRange.end)
    }
    return this.request(`/analytics/overall?${params}`)
  }


  // Single email sending with FormData support
  async sendEmail(data: FormData) {
    return this.request("/send", {
      method: "POST",
      body: data,
    })
  }

  // Single email sending (individual recipients)

  async sendSingleEmail(data: {
    additionalRecipients: string[]
    subject: string
    content: string
    contentType: string
    plainTextVersion?: string
    attachments?: File[]
    scheduledDate?: string
    senderName?: string
    senderEmail?: string
  }) {
    const formData = new FormData()

    // Add recipients as a single JSON string
    formData.append("additionalRecipients", JSON.stringify(data.additionalRecipients))

    // Add email content with flat structure (matching backend DTO)
    formData.append("subject", data.subject)
    formData.append("content", data.content)
    formData.append("contentType", data.contentType)
    
    if (data.plainTextVersion) {
      formData.append("plainTextVersion", data.plainTextVersion)
    }

    // Add sender info
    if (data.senderName) formData.append("senderName", data.senderName)
    if (data.senderEmail) formData.append("senderEmail", data.senderEmail)

    // Add schedule date if provided
    if (data.scheduledDate) {
      formData.append("scheduledDate", data.scheduledDate)
    }

    // Add attachments
    if (data.attachments) {
      data.attachments.forEach((file) => {
        formData.append("attachments", file)
      })
    }

    return this.request("/send", {
      method: "POST",
      body: formData,
    })
  }

}

export const apiClient = new ApiClient(API_BASE_URL)

// Types for API responses
export interface EmailGroup {
  id: number
  name: string
  description?: string
  memberCount: number
  createdAt: string
  updatedAt: string
}

export interface GroupMember {
  id: number
  email: string
  name?: string
  status: "active" | "bounced" | "unsubscribed"
  createdAt: string
  updatedAt: string
}

export interface SentEmail {
  id: number
  subject: string
  recipients: number
  status: "delivered" | "sending" | "failed" | "scheduled"
  openRate?: number
  clickRate?: number
  bounceRate?: number
  sentAt: string
  groupName?: string
}

export interface DashboardStats {
  totalEmails: number
  totalContacts: number
  openRate: number
  clickRate: number
  deliveryRate: number
  bounceRate: number
  quotaUsed: number
  quotaLimit: number
}

export interface BulkJobStatus {
  jobId: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  total: number
  processed: number
  errors: string[]
  result?: unknown
}

export interface EmailTemplate {
  id: number
  name: string
  subject: string
  content: string
  category: string
  createdAt: string
  updatedAt: string
}

export interface UserSettings {
  id: number
  emailSignature: string
  timezone: string
  emailNotifications: boolean
  marketingEmails: boolean
  theme: "light" | "dark" | "system"
}

export interface BillingInfo {
  id: number
  plan: string
  status: "active" | "cancelled" | "past_due"
  currentPeriodStart: string
  currentPeriodEnd: string
  quota: number
  quotaUsed: number
}
