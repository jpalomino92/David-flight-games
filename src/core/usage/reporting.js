export function buildUsageReport(usageStats, locale = 'es') {
  const last7Days = []
  const today = new Date()

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(today)
    date.setDate(date.getDate() - index)

    const dateString = date.toISOString().split('T')[0]

    last7Days.push({
      date: dateString,
      label: date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric' }),
      total: 0,
    })
  }

  const report = {}

  Object.keys(usageStats).forEach((gameId) => {
    last7Days.forEach((day) => {
      const seconds = usageStats[gameId].dailyStats?.[day.date] || 0

      if (!report[gameId]) {
        report[gameId] = [...last7Days]
      }

      report[gameId].find((entry) => entry.date === day.date).total += seconds
    })
  })

  return report
}
