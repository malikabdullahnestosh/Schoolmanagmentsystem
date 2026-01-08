"use client"

export function Button({
  children,
  variant = "primary",
  size = "medium",
  className = "",
  disabled = false,
  type = "button",
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"

  const variantStyles = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400",
    outline: "border border-slate-300 bg-transparent hover:bg-slate-100 focus:ring-slate-400",
    ghost: "bg-transparent hover:bg-slate-100 focus:ring-slate-400",
    link: "bg-transparent underline-offset-4 hover:underline focus:ring-slate-400 p-0 h-auto",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  }

  const sizeStyles = {
    small: "text-xs px-2.5 py-1.5",
    medium: "text-sm px-4 py-2",
    large: "text-base px-6 py-3",
    icon: "p-2",
  }

  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`

  return (
    <button type={type} className={buttonStyles} disabled={disabled} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
