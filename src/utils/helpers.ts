export const findDaysBetweenDates = (
  startDateStr: string,
  endDateStr: string
) => {
  const startDate = new Date(startDateStr)
  const endDate = new Date(endDateStr)

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error(
      "Invalid date format. Please provide dates in the format 'YYYY-MM-DD'."
    )
  }

  const startUTC = Date.UTC(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  )
  const endUTC = Date.UTC(
    endDate.getFullYear(),
    endDate.getMonth(),
    endDate.getDate()
  )

  const diffMillis = Math.abs(endUTC - startUTC)

  const days = Math.floor(diffMillis / (1000 * 60 * 60 * 24))

  return days
}

export const isEmailValid = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function formatDate(inputDate: string | number | Date) {
  const date = new Date(inputDate)

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

export function daysAgo(inputDate: Date) {
  const now = new Date() as any
  const pastDate = new Date(inputDate) as any

  // Calculate the difference in milliseconds
  const diffInMs = now - pastDate

  // Convert milliseconds to days
  const diffInDays = Math.floor(diffInMs / 1000 / 60 / 60 / 24)

  return diffInDays
}
