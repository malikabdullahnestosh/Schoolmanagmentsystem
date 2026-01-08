export default function UpdateHistory() {
  const historyData = [
    {
      date: "31-May-2025",
      user: "Admin",
      remarks: "Delete The testing Student",
      old: "Active",
      new: "Deleted",
    },
    {
      date: "31-May-2025",
      user: "Admin",
      remarks: "Delete The testing Staff",
      old: "Active",
      new: "Deleted",
    },
    {
      date: "31-May-2025",
      user: "Admin",
      remarks: "Class Name Changed",
      old: "Eight",
      new: "8th",
    },
    {
      date: "31-May-2025",
      user: "Admin",
      remarks: "Class Name Changed",
      old: "Seven",
      new: "7th",
    },
    {
      date: "31-May-2025",
      user: "Admin",
      remarks: "Class Name Changed",
      old: "Six",
      new: "6th",
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Updates History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 font-medium text-gray-600">Date (d-M-Y)</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">User</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Remarks</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">Old</th>
              <th className="text-left py-3 px-2 font-medium text-gray-600">New</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2 text-blue-600">{item.date}</td>
                <td className="py-3 px-2 text-blue-600">{item.user}</td>
                <td className="py-3 px-2 text-gray-700">{item.remarks}</td>
                <td className="py-3 px-2 text-gray-700">{item.old}</td>
                <td className="py-3 px-2 text-gray-700">{item.new}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
