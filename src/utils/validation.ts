// email format (simple regex check)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// - Must be 8-15 characters long
// - Must contain at least one number
// - Must contain at least one special character
export const validatePassword = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,15}$/
  return passwordRegex.test(password)
}
