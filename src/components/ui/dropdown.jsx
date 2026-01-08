"use client"

import { useRef, useEffect } from "react"

export function Dropdown({ children, className = "", ...props }) {
  return (
    <div className={`relative ${className}`} {...props}>
      {children}
    </div>
  )
}

export function DropdownTrigger({ children, onClick, className = "", ...props }) {
  return (
    <div className={`cursor-pointer ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export function DropdownMenu({ children, open, onClose, align = "left", className = "", ...props }) {
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose && onClose()
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, onClose])

  if (!open) return null

  const alignmentStyles = {
    left: "left-0",
    right: "right-0",
  }

  return (
    <div
      ref={menuRef}
      className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-md ${alignmentStyles[align]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownItem({ children, onClick, className = "", ...props }) {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-slate-100 ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

export function DropdownSeparator({ className = "", ...props }) {
  return <div className={`-mx-1 my-1 h-px bg-slate-200 ${className}`} {...props} />
}
