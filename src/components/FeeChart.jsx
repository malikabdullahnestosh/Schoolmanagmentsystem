export default function FeeChart() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Fee</h3>
        <button className="text-blue-600 text-sm hover:underline">View Report</button>
      </div>

      <div className="mb-6">
        <div className="text-4xl font-bold text-gray-800 mb-2">0</div>
        <div className="text-sm text-gray-600">May Month Fees Paid</div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Fees Paid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span>Fees Payable</span>
          </div>
        </div>

        <div className="flex items-end justify-between h-32 border-b border-gray-200">
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-16 bg-gray-200 rounded-sm"></div>
                <div className="w-6 h-2 bg-blue-500 rounded-sm"></div>
              </div>
              <span className="text-xs text-gray-600">{month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
