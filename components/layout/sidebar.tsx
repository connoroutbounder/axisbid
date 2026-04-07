'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Hammer,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface SidebarProps {
  userRole: 'customer' | 'shop' | 'admin'
}

export function Sidebar({ userRole }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const customerLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Jobs', href: '/dashboard/jobs', icon: FileText },
    { label: 'Get Quote', href: '/dashboard/quote/new', icon: Hammer },
  ]

  const shopLinks = [
    { label: 'Dashboard', href: '/dashboard/shop', icon: LayoutDashboard },
    { label: 'Available Jobs', href: '/dashboard/shop?tab=available', icon: Hammer },
    { label: 'My Bids', href: '/dashboard/shop?tab=bids', icon: FileText },
    { label: 'Active Jobs', href: '/dashboard/shop?tab=active', icon: LayoutDashboard },
  ]

  const adminLinks = [
    { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { label: 'Shops', href: '/dashboard/admin/shops', icon: Hammer },
    { label: 'Jobs', href: '/dashboard/admin/jobs', icon: FileText },
  ]

  const links =
    userRole === 'customer'
      ? customerLinks
      : userRole === 'shop'
        ? shopLinks
        : adminLinks

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0 flex flex-col',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <span className="font-semibold text-gray-900">Menu</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft
            className={cn(
              'w-5 h-5 transition-transform',
              collapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                'text-gray-700 hover:bg-gray-100 hover:text-brand-blue',
                collapsed && 'justify-center'
              )}
              title={collapsed ? link.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
            'text-gray-700 hover:bg-gray-100 hover:text-brand-blue',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          className={cn(
            'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
            'text-gray-700 hover:bg-gray-100 hover:text-red-600',
            collapsed && 'justify-center'
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}
