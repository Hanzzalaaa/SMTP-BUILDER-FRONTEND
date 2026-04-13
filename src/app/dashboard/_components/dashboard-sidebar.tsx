"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BarChart3, Send, Mail, Users, CreditCard, Settings, ChevronUp, User2, Crown, Zap } from "lucide-react"
import { useAppSelector } from "@/lib/store/hook"
import { LogoutMenuItem } from "@/components/auth/logout-menu-item"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DashboardSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const menuItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: BarChart3
  },
  {
    title: "Send Email",
    url: "send-email",
    icon: Send
  },
  {
    title: "Sent Emails",
    url: "sent-emails",
    icon: Mail
  },
  {
    title: "Bulk Email",
    url: "bulk-email",
    icon: Zap
  },
  {
    title: "Email Groups",
    url: "groups",
    icon: Users
  },
  {
    title: "Group Manager",
    url: "group-manager",
    icon: Users
  },
  {
    title: "Billing",
    url: "billing",
    icon: CreditCard
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings
  },
]

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { user } = useAppSelector((state) => state.auth)
  const router = useRouter()

  // Helper to update the URL with the new section
  const handleMenuClick = (section: string) => {
    // Only update if not already on this section
    if (activeSection !== section) {
      const url = new URL(window.location.href)
      url.searchParams.set("section", section)
      router.replace(url.pathname + url.search, { scroll: false })
      onSectionChange(section)
    }
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return user?.email?.[0]?.toUpperCase() || "U"
  }

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split("@")[0] || "User"
  }

  const getUserPlan = () => {
    return user?.plan || "Basic"
  }

  return (
    <Sidebar collapsible="icon" className="min-w-0">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3 sm:py-4">
          <Link href="/" className="flex items-center gap-2 cursor-pointer min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white group-data-[collapsible=icon]:hidden truncate">
              SMTPMAILER
            </span>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs sm:text-sm font-medium">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeSection === item.url}
                    onClick={() => handleMenuClick(item.url)}
                    className="text-sm sm:text-base"
                  >
                    <button className="flex items-center gap-2 w-full min-w-0">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">
                       {item.title}
                      </span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground min-w-0"
                >
                  <Avatar className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-r from-orange-400 to-yellow-500 text-white text-xs sm:text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs sm:text-sm leading-tight min-w-0">
                    <span className="truncate font-semibold">{getUserDisplayName()}</span>
                    <span className="truncate text-xs flex items-center gap-1">
                      <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                      <span className="truncate">{getUserPlan()} Plan</span>
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-3 sm:size-4 flex-shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg flex-shrink-0">
                      <AvatarImage src="/placeholder.svg" alt={getUserDisplayName()} />
                      <AvatarFallback className="rounded-lg bg-gradient-to-r from-orange-400 to-yellow-500 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                      <span className="truncate font-semibold">{getUserDisplayName()}</span>
                      <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleMenuClick("settings")} className="text-sm">
                  <User2 className="w-4 h-4 mr-2 flex-shrink-0" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuClick("billing")} className="text-sm">
                  <CreditCard className="w-4 h-4 mr-2 flex-shrink-0" />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <LogoutMenuItem />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
