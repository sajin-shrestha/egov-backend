import { Request } from 'express'

const createFilter = (
  req: Request,
  allowedFields: string[],
): Record<string, { $regex: string; $options: string }> => {
  return Object.fromEntries(
    Object.entries(req.query)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value]) => [
        key.toLowerCase(),
        { $regex: String(value), $options: 'i' },
      ]),
  )
}

export default createFilter
