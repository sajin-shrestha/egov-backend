import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'
import { v2 as cloudinary } from 'cloudinary'

import { AuthenticatedRequest } from '../middlewares/auth'
import { Complain } from './complainModel'
import { Status } from '../constants'
import { isAdmin } from '../utils/helper'
import { sendEmail } from '../services/emailService'

/**
 * File a new complain
 */
export const fileComplain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  const { subject, description, category } = req.body
  const image = req.file?.path ?? ''
  const userId = req.user.id

  try {
    const complain = new Complain({
      userId,
      subject,
      description,
      image,
      category,
    })
    await complain.save()
    res.status(201).json({ message: 'complain successfully submited' })
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}

/**
 * Get complains (Users see their own, Admins see all)
 */
export const getComplains = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  try {
    const complains = isAdmin(req.user.role)
      ? await Complain.find()
      : await Complain.find({ userId: req.user.id })
    res.status(200).json({ complains })
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}

/**
 * Get complaints (User see their own, Admins can see any)
 */
export const getComplainById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  const { id } = req.params

  try {
    const complain = await Complain.findById(id)

    if (!complain) {
      return next(createHttpError(404, 'Complain not found'))
    }

    // Allow access if the user is an admin OR the user owns the complaint
    if (!isAdmin(req.user.role) && complain.userId.toString() !== req.user.id) {
      return next(
        createHttpError(
          403,
          'You do not have permission to view this complain',
        ),
      )
    }

    res.status(200).json(complain)
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}

/**
 * Update complaint (Only owner can update their complaint)
 */
export const updateComplain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  const { id } = req.params
  const { subject, description, category, status } = req.body
  const newImage = req.file

  try {
    const complain = await Complain.findById(id)
    if (!complain) return next(createHttpError(404, 'Complain not found'))

    if (complain.userId.toString() !== req.user.id) {
      return next(createHttpError(403, 'Only creator can edit their complain'))
    }

    if (subject) complain.subject = subject
    if (description) complain.description = description
    if (category) complain.category = category

    if (isAdmin(req.user.role) && status) {
      complain.status = status
    }

    if (newImage) {
      if (complain.image) {
        const imagePublicId = complain.image.split('/').pop()?.split('.')[0]
        if (imagePublicId) {
          await cloudinary.uploader.destroy(imagePublicId)
        }
      }

      const result = await cloudinary.uploader.upload(newImage.path, {
        folder: 'complains',
      })

      complain.image = result.secure_url
    }

    await complain.save()
    res.json({ message: 'Complain edited successfully' })
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}

/**
 * Delete complaint (Users delete their own, Admins delete any)
 */
export const deleteComplain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  const { id } = req.params

  try {
    const complain = await Complain.findById(id)
    if (!complain) return next(createHttpError(404, 'Complain not found'))

    // Users can delete their own, Admins can delete any
    if (!isAdmin(req.user.role) && complain.userId.toString() !== req.user.id) {
      return next(
        createHttpError(403, 'You can only delete your own complaints'),
      )
    }

    await complain.deleteOne()
    res.json({ message: 'Complain deleted successfully' })
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}

/**
 * Update complain status (only admin)
 */
export const updateComplainStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) return next(createHttpError(401, 'Access denied'))

  const { id } = req.params

  try {
    const complain = await Complain.findById(id)
    if (!complain) return next(createHttpError(404, 'Complain not found'))

    if (!isAdmin(req.user.role)) {
      return next(
        createHttpError(403, 'You don’t have permission to change status'),
      )
    }

    let updatedMessage = ''
    let emailSubject = ''
    let emailBody = ''

    switch (complain.status) {
      case Status.PENDING:
        complain.status = Status.IN_PROCESS
        updatedMessage = 'Complain status updated to in-process'
        emailSubject = 'Your Complaint is Now Being Processed'
        emailBody = `Dear User,\n\nYour complaint with ID: ${complain._id} is now being processed. We will update you once it is resolved.\n\nBest Regards,\nSupport Team`
        break

      case Status.IN_PROCESS:
        complain.status = Status.RESOLVED
        updatedMessage = 'Complain status updated to resolved'
        emailSubject = 'Your Complaint Has Been Resolved'
        emailBody = `Dear User,\n\nYour complaint with ID: ${complain._id} has been successfully resolved.\n\nThank you for your patience.\nBest Regards,\nSupport Team`
        break

      default:
        return next(createHttpError(400, 'Cannot update complain status'))
    }

    await complain.save()

    // Send Email Notification
    await sendEmail(complain.userId, emailSubject, emailBody)

    res.json({ message: updatedMessage })
  } catch (error) {
    next(createHttpError(500, 'Internal server error'))
  }
}
