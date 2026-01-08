import { createContext, useContext, useState, useCallback, useEffect } from "react"

const SidebarContext = createContext(null)

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(() => {
    // By default, sidebar is closed
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-open")
      if (stored !== null) return stored === "true"
    }
    return false // default to closed
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-open", open ? "true" : "false")
    }
  }, [open])

  const toggleSidebar = useCallback(() => {
    setOpen(prev => !prev)
  }, [])

  const value = { open, toggleSidebar }
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

export function Sidebar({ children, open = true, className = "", ...props }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 transition-all duration-200 bg-white shadow-lg
        ${open ? "w-64" : "w-[64px]"} ${className}
      `}
      {...props}
    >
      <div className="flex h-full flex-col overflow-hidden">{children}</div>
    </aside>
  )
}

export function SidebarHeader({ children, className = "", ...props }) {
  return (
    <div className={`flex items-center justify-between border-b border-slate-200 p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SidebarContent({ children, className = "", ...props }) {
  return (
    <div className={`flex-1 overflow-y-auto p-2 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SidebarFooter({ children, className = "", ...props }) {
  return (
    <div className={`mt-auto border-t border-slate-200 p-4 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenu({ children, className = "", ...props }) {
  return (
    <div className={`space-y-1 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({ children, className = "", ...props }) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  )
}

export function SidebarMenuButton({ children, isActive = false, className = "", ...props }) {
  return (
    <button
      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
        isActive ? "bg-emerald-100 text-emerald-900" : "text-slate-700 hover:bg-slate-100"
      } ${className}`}
      {...props}
      tabIndex={-1}
    >
      {children}
    </button>
  )
}