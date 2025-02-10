// Success Response Class with Pagination Support
class SuccessApiResponse<T> {
  statusCode: number
  message: string
  total: number
  prev: string | null
  next: string | null
  data: T

  constructor(
    statusCode: number,
    message: string,
    total: number,
    prev: string | null,
    next: string | null,
    data: T,
  ) {
    this.statusCode = statusCode
    this.message = message
    this.total = total
    this.prev = prev
    this.next = next
    this.data = data
  }

  /**
   *
   * @param statusCode - HTTP status code for the response (e.g., 200).
   * @param message - Message describing the response (e.g., 'Fetched data successfully').
   * @param total - Total number of items available for pagination (e.g., 100).
   * @param prev - The URL or string for the previous page. Pass `null` if there is no previous page.
   * @param next - The URL or string for the next page. Pass `null` if there is no next page.
   * @param data - The data being returned in the response (e.g., an array of users).
   *
   * @returns A new `SuccessApiResponse` instance with the given values.
   */
  static success<T>(
    statusCode: number,
    message: string,
    total: number,
    prev: string | null,
    next: string | null,
    data: T,
  ): SuccessApiResponse<T> {
    return new SuccessApiResponse<T>(
      statusCode,
      message,
      total,
      prev,
      next,
      data,
    )
  }
}

// Error Response Class
class ErrorApiResponse {
  statusCode: number
  message: string
  errorStack: string | null

  constructor(
    statusCode: number,
    message: string,
    errorStack: string | null = null,
  ) {
    this.statusCode = statusCode
    this.message = message
    this.errorStack = errorStack
  }

  /**
   *
   * @param statusCode - HTTP status code for the error (e.g., 400 for bad request).
   * @param message - Error message (e.g., 'Validation failed').
   * @param errorStack - Optional error stack that can be included in the response (e.g., 'Field "name" is required').
   *
   * @returns A new `ErrorApiResponse` instance with the given values.
   */
  static error(
    statusCode: number,
    message: string,
    errorStack: string | null = null,
  ): ErrorApiResponse {
    return new ErrorApiResponse(statusCode, message, errorStack)
  }
}

export { SuccessApiResponse, ErrorApiResponse }
