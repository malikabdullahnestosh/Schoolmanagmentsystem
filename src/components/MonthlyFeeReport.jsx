export default function MonthlyFeeReport() {
  const months = ["January", "February", "March", "April", "May", "June"]

  const goals = [
    { label: "Students", current: 5, target: 5, percentage: 100 },
    { label: "Fees Paid", current: 0, target: 20500, percentage: 0 },
    { label: "Attendance", current: 0, target: 5, percentage: 0 },
    { label: "Expense", current: 0, target: 0, percentage: 0 },
  ]

  const summaryData = [
    { label: "TOTAL FEES", value: "0" },
    { label: "TOTAL PAYABLE", value: "20,500" },
    { label: "TOTAL RECEIVABLE", value: "20,500" },
    { label: "TOTAL STUDENTS", value: "5" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Monthly Fees Report - Left Side */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Fees Report</h3>

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-blue-500 rounded-sm"></div>
              <span className="text-gray-700">Fees Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-gray-300 rounded-sm"></div>
              <span className="text-gray-700">Fees Payable</span>
            </div>
          </div>

          {/* Chart Container */}
          <div className="relative h-64 border border-gray-200 rounded bg-gray-50">
            {/* Y-axis labels */}
            <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
              <span>1.0</span>
              <span>0.8</span>
              <span>0.6</span>
              <span>0.4</span>
              <span>0.2</span>
              <span>0</span>
              <span>-0.2</span>
              <span>-0.4</span>
              <span>-0.6</span>
              <span>-0.8</span>
              <span>-1.0</span>
            </div>

            {/* Chart area */}
            <div className="ml-10 mr-4 h-full relative">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-4">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="border-t border-gray-200"></div>
                ))}
              </div>

              {/* Blue line chart */}
              <div className="absolute inset-0 flex items-center">
                <div className="w-full h-0.5 bg-blue-500"></div>
              </div>
            </div>

            {/* X-axis labels */}
            <div className="absolute bottom-2 left-10 right-4 flex justify-between text-xs text-gray-500">
              {months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Goal Completion - Right Side */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Goal Completion</h3>

          <div className="space-y-6">
            {goals.map((goal, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{goal.label}</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${goal.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards at Bottom */}
      <div className="border-t border-gray-200 pt-6">
        <div className="grid grid-cols-4 gap-4">
          {summaryData.map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">{item.value}</div>
              <div className="text-xs font-medium text-gray-600 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
