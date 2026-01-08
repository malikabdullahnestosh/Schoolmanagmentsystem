"use client"

import { useState, createContext, useContext } from "react"

const TabsContext = createContext(null)

export function Tabs({ children, defaultValue, onValueChange, className = "", ...props }) {
  const [value, setValue] = useState(defaultValue)

  const handleValueChange = (newValue) => {
    setValue(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div className={`space-y-4 ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, className = "", ...props }) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function TabsTrigger({ children, value, className = "", ...props }) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext)
  const isSelected = selectedValue === value

  return (
    <button
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
        ${isSelected ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"} 
        ${className}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  )
}

export function TabsContent({ children, value, className = "", ...props }) {
  const { value: selectedValue } = useContext(TabsContext)

  if (selectedValue !== value) {
    return null
  }

  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
