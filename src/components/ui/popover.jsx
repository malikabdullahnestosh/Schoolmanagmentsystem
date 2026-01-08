"use client"

import { useRef, useEffect } from "react"

export function Popover({ children, className = "", ...props }) {
  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {children}
    </div>
  )
}

export function PopoverTrigger({ children, onClick, className = "", asChild = false, ...props }) {
  return (
    <div className={`cursor-pointer ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export function PopoverContent({ children, className = "", align = "center", side = "bottom", ...props }) {
  const contentRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        // Handle outside click if needed
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const alignmentStyles = {
    start: "left-0",
    center: "left-1/2 -translate-x-1/2",
    end: "right-0",
  }

  const sideStyles = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  }

  return (
    <div
      ref={contentRef}
      className={`absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 shadow-md ${alignmentStyles[align]} ${sideStyles[side]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
