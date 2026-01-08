export function Separator({ orientation = "horizontal", className = "", ...props }) {
  return (
    <div
      role="separator"
      className={`${orientation === "horizontal" ? "h-px w-full" : "h-full w-px"} bg-slate-200 ${className}`}
      {...props}
    />
  )
}
