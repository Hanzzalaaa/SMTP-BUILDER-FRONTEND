"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Server, Database, Users, Activity, Settings, LogOut } from "lucide-react"

interface ServerStatus {
  status: string
  uptime: string
}

export default function ServerControlPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(true)
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null)
  const [statusLoading, setStatusLoading] = useState(false)
  const [stopLoading, setStopLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authorized admin
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')

        if (token === 'admin-token' && userData) {
          const user = JSON.parse(userData)
          if (user.email === 'hassank1751@gmail.com') {
            setIsAuthorized(true)
          } else {
            router.push('/login')
          }
        } else {
          router.push('/login')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const checkServerStatus = async () => {
    setStatusLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/server-control/status`)
      if (response.ok) {
        const data = await response.json()
        setServerStatus(data)
      } else {
        console.error('Failed to fetch server status')
      }
    } catch (error) {
      console.error('Error fetching server status:', error)
    } finally {
      setStatusLoading(false)
    }
  }

  const stopServer = async () => {
    setStopLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/server-control/stop`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Server stop response:', data)
        // Refresh status after stopping
        await checkServerStatus()
      } else {
        console.error('Failed to stop server')
      }
    } catch (error) {
      console.error('Error stopping server:', error)
    } finally {
      setStopLoading(false)
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    )
  }
  if (!isAuthorized) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Server className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Server Control Panel
              </h1>
              <Badge variant="destructive" className="ml-2">
                Admin Only
              </Badge>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome, Admin
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your server infrastructure and monitor system performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Status</CardTitle>
              <Server className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {serverStatus?.status || 'Online'}
              </div>
              <p className="text-xs text-muted-foreground">
                Uptime: {serverStatus?.uptime || '99.9%'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Database</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                Response time: 45ms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Load</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23%</div>
              <p className="text-xs text-muted-foreground">
                CPU usage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Control Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Server Management</span>
              </CardTitle>
              <CardDescription>
                Control server operations and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full"
                variant="outline"
                onClick={checkServerStatus}
                disabled={statusLoading}
              >
                {statusLoading ? 'Checking...' : 'Check Server Status'}
              </Button>
              <Button className="w-full" variant="outline">
                Restart Server
              </Button>
              <Button className="w-full" variant="outline">
                Update Configuration
              </Button>
              <Button className="w-full" variant="outline">
                View Logs
              </Button>
              <Button
                className="w-full"
                variant="destructive"
                onClick={stopServer}
                disabled={stopLoading}
              >
                {stopLoading ? 'Stopping...' : 'Stop Server'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Operations</span>
              </CardTitle>
              <CardDescription>
                Manage database and perform maintenance tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Backup Database
              </Button>
              <Button className="w-full" variant="outline">
                Run Maintenance
              </Button>
              <Button className="w-full" variant="outline">
                View Query Performance
              </Button>
              <Button className="w-full" variant="outline">
                Optimize Tables
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                View All Users
              </Button>
              <Button className="w-full" variant="outline">
                Manage Permissions
              </Button>
              <Button className="w-full" variant="outline">
                Export User Data
              </Button>
              <Button className="w-full" variant="outline">
                Send Notifications
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>System Monitoring</span>
              </CardTitle>
              <CardDescription>
                Monitor system performance and health
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" variant="outline">
                Performance Metrics
              </Button>
              <Button className="w-full" variant="outline">
                Error Reports
              </Button>
              <Button className="w-full" variant="outline">
                Security Audit
              </Button>
              <Button className="w-full" variant="outline">
                System Health Check
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
