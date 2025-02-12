import { Document, Model } from 'mongoose'

interface IPaginationResultParams<T> {
  total_count: number
  next_page_number: number | null
  prev_page_number: number | null
  data: T[]
}

export const pagination = async <T extends Document>(
  model: Model<T>,
  filter: object,
  page: number = 1,
  limit: number = 10,
): Promise<IPaginationResultParams<T>> => {
  const skip = (page - 1) * limit

  const total_count = await model.countDocuments(filter)

  const data = await model
    .find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 }) // Sorting by createdAt field

  // Calculate pagination fields
  const next_page_number = page * limit < total_count ? page + 1 : null
  const prev_page_number = page > 1 ? page - 1 : null

  return {
    total_count,
    next_page_number,
    prev_page_number,
    data,
  }
}
