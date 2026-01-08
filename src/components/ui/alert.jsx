export function Alert({ children, variant = "default", className = "", ...props }) {
  const variantStyles = {
    default: "bg-slate-50 text-slate-900",
    destructive: "bg-red-50 text-red-900 border-red-200",
    success: "bg-emerald-50 text-emerald-900 border-emerald-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
  }

  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border border-slate-200 p-4 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function AlertTitle({ children, className = "", ...props }) {
  return (
    <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
      {children}
    </h5>
  )
}

export function AlertDescription({ children, className = "", ...props }) {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  )
}
