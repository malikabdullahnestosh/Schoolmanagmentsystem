import { ArrowRight } from "lucide-react"

export default function StatCard({ title, value, color, icon: Icon }) {
  return (
    <div className={`${color} text-white rounded-lg p-4 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="text-3xl font-bold mb-2">{value}</div>
        <div className="text-sm mb-4">{title}</div>
        <div className="flex items-center justify-between">
          <span className="text-sm">More info</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      <div className="absolute top-4 right-4 opacity-30">
        <Icon className="w-12 h-12" />
      </div>
    </div>
  )
}
