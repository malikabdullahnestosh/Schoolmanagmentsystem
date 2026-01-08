"use client"

import { useState } from "react"
import { Button } from "./button"

// A simplified calendar component
export function Calendar({ selected, onSelect, mode = "single", initialFocus = false, className = "", ...props }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [viewDate, setViewDate] = useState(selected || new Date())

  // Get days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  // Month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Day names
  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // Previous month
  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1))
  }

  // Next month
  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1))
  }

  // Handle day selection
  const handleDayClick = (day) => {
    const newDate = new Date(year, month, day)
    onSelect(newDate)
  }

  // Check if a day is selected
  const isDaySelected = (day) => {
    if (!selected) return false
    return selected.getDate() === day && selected.getMonth() === month && selected.getFullYear() === year
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(
      <button
        key={day}
        className={`h-9 w-9 rounded-md text-sm ${
          isDaySelected(day) ? "bg-emerald-600 text-white" : "hover:bg-slate-100"
        }`}
        onClick={() => handleDayClick(day)}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className={`p-3 ${className}`} {...props}>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" className="h-7 w-7 p-0" onClick={handlePrevMonth}>
          &lt;
        </Button>
        <div className="text-sm font-medium">
          {monthNames[month]} {year}
        </div>
        <Button variant="outline" className="h-7 w-7 p-0" onClick={handleNextMonth}>
          &gt;
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((day) => (
          <div key={day} className="h-9 w-9 text-xs font-medium text-slate-500 flex items-center justify-center">
            {day}
          </div>
        ))}
        {calendarDays}
      </div>
    </div>
  )
}
