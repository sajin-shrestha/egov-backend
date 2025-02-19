export const Roles = {
  ADMIN: 'admin',
  USER: 'user',
} as const

export const Status = {
  PENDING: 'pending',
  IN_PROCESS: 'in-process',
  RESOLVED: 'resolved',
} as const

export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIME_OUT: 408,
  CONFLICT: 409,
  UNSUPPROTED_MEDIA_TYPE: 415,
  TO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const
