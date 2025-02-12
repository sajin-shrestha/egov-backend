// import { Request } from 'express'

// const createFilter = (
//   req: Request,
//   allowedFields: string[],
// ): Record<string, { $regex: string; $options: string }> => {
//   return Object.fromEntries(
//     Object.entries(req.query)
//       .filter(([key]) => allowedFields.includes(key)) // Ensure only allowed fields are included
//       .map(([key, value]) => [
//         key.toLowerCase(),
//         { $regex: String(value), $options: 'i' }, // Ensure proper conversion to string and case-insensitive matching
//       ]),
//   )
// }

// export default createFilter

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
