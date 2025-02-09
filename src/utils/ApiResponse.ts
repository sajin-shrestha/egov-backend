class ApiResponse<T> {
  message: string
  data: T | null

  constructor(message: string, data: T | null) {
    this.message = message
    this.data = data
  }

  static success<T>(data: T, message: string = 'Success'): ApiResponse<T> {
    return new ApiResponse<T>(message, data)
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse<null>(message, null)
  }
}

export default ApiResponse
