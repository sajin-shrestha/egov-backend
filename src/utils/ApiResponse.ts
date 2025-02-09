class ApiResponse<T> {
  statusCode: number
  message: string
  data: T | null

  constructor(statusCode: number, message: string, data: T | null) {
    this.statusCode = statusCode
    this.message = message
    this.data = data
  }

  // success response
  static success<T>(
    statusCode: number,
    message: string,
    data: T,
  ): ApiResponse<T> {
    return new ApiResponse<T>(statusCode, message, data)
  }

  // error response
  static error(statusCode: number, message: string): ApiResponse<null> {
    return new ApiResponse<null>(statusCode, message, null)
  }
}

export default ApiResponse
