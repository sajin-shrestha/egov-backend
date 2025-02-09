import { Request } from 'express'

const createFilter = (
  req: Request,
  allowedFields: string[],
): Record<string, { $regex: string; $options: string }> => {
  return Object.fromEntries(
    Object.entries(req.query)
      .filter(([key]) => allowedFields.includes(key)) // Ensure only allowed fields are included
      .map(([key, value]) => [
        key.toLowerCase(),
        { $regex: String(value), $options: 'i' }, // Ensure proper conversion to string and case-insensitive matching
      ]),
  )
}

export default createFilter
