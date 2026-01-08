"use client"

import React, { useState, useRef, useEffect } from "react"

export function Select({ children, value, onValueChange, placeholder = "Select an option", className = "", ...props }) {
  const [open, setOpen] = useState(false)
  const selectRef = useRef(null)

  // Find the selected item's label
  const selectedItem = React.Children.toArray(children).find((child) => child.props.value === value)

  const displayValue = selectedItem ? selectedItem.props.children : placeholder

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={selectRef} className={`relative ${className}`} {...props}>
      <SelectTrigger onClick={() => setOpen(!open)}>{displayValue}</SelectTrigger>

      {open && (
        <SelectContent>
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, {
                onSelect: () => {
                  onValueChange(child.props.value)
                  setOpen(false)
                },
              })
            }
            return child
          })}
        </SelectContent>
      )}
    </div>
  )
}

export function SelectTrigger({ children, onClick, className = "", ...props }) {
  return (
    <button
      type="button"
      className={`flex h-10 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      onClick={onClick}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 opacity-50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

export function SelectContent({ children, className = "", ...props }) {
  return (
    <div
      className={`absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white p-1 text-slate-700 shadow-md ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectItem({ children, value, onSelect, className = "", ...props }) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-slate-100 ${className}`}
      onClick={onSelect}
      {...props}
    >
      {children}
    </div>
  )
}

export function SelectValue({ placeholder }) {
  return <span>{placeholder}</span>
}
