export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date. Argument must be of type Date.")
  }
  const formattedDate = date.toISOString().split("T")[0]
  return formattedDate
}

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

export const formatDateConverted = (inputDate: string) => {
  // Parse the input date string
  const date = new Date(inputDate)

  // Get month name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ]
  const month = monthNames[date.getMonth()]

  // Get day of the month
  const day = date.getDate()

  // Get year
  const year = date.getFullYear()

  // Format the date
  const formattedDate = `${month} ${day}, ${year}`

  return formattedDate
}
