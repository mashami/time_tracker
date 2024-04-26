export const formatDate = (date: Date) => {
  if (!(date instanceof Date)) {
    throw new Error("Invalid date. Argument must be of type Date.")
  }
  const formattedDate = date.toISOString().split("T")[0]
  return formattedDate
}
