import { Roles } from '../constants'

export const isAdmin = (role: string): boolean => {
  return role === Roles.ADMIN
}

export const isUser = (role: string): boolean => {
  return role === Roles.USER
}
