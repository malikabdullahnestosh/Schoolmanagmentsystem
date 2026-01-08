export default function NotificationBadge({ Icon, count, color, onClick }) {
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      <Icon className="w-6 h-6" />
      {count > 0 && (
        <span className={`absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white rounded-full ${color}`}>
          {count}
        </span>
      )}
    </div>
  )
}