import { Search } from "lucide-react"

export default function SearchBar({ placeholder }) {
  return (
    <div className="relative">
      <input type="text" placeholder={placeholder} className="bg-white text-gray-800 px-4 py-2 pr-10 rounded w-64" />
      <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-500" />
    </div>
  )
}
