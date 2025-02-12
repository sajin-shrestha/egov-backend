import { Request } from 'express'

const createFilter = (
  req: Request,
  allowedFields: string[],
): Record<string, any> => {
  let filter: Record<string, any> = {}

  const searchTerm = (req.query.search as string) || ''

  // Apply search term across allowed fields if a search term is provided
  if (searchTerm) {
    filter.$or = allowedFields.map((field) => ({
      [field]: { $regex: searchTerm, $options: 'i' }, // Case-insensitive search
    }))
  }

  // Add query parameter filters to the filter object for allowed fields
  Object.entries(req.query)
    .filter(([key]) => allowedFields.includes(key))
    .forEach(([key, value]) => {
      filter[key] = String(value) // Apply exact match filter for query parameters
    })

  return filter
}

export default createFilter
