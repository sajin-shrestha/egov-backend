import { NextFunction, Response } from 'express'
import createHttpError from 'http-errors'
import { v2 as cloudinary } from 'cloudinary'

import { AuthenticatedRequest } from '../middlewares/auth'
import { Complain } from './complainModel'
import { HttpStatusCodes, Status } from '../constants'
import { isAdmin } from '../utils/helper'
import { sendEmail } from '../services/emailService'
import createFilter from '../utils/filter'

/**
 * File a new complain
 */
export const fileComplain = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

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
    res
      .status(HttpStatusCodes.CREATED)
      .json({ message: 'complain successfully submitted' })
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
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
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

  const filter = createFilter(req, [
    'subject',
    'description',
    'category',
    'status',
  ])

  try {
    const complains = isAdmin(req.user.role)
      ? await Complain.find(filter)
          .populate({ path: 'userId', select: '-password' })
          .sort({ createdAt: -1 })
      : await Complain.find({ userId: req.user.id, ...filter })
          .populate({ path: 'userId', select: '-password' })
          .sort({ createdAt: -1 })

    res.status(HttpStatusCodes.OK).json({ complains })
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
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
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

  const { id } = req.params

  try {
    const complain = await Complain.findById(id).select('-userId')

    if (!complain) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Complain not found'),
      )
    }

    // Allow access if the user is an admin OR the user owns the complaint
    if (!isAdmin(req.user.role) && complain.userId.toString() !== req.user.id) {
      return next(
        createHttpError(
          HttpStatusCodes.UNAUTHORIZED,
          'You do not have permission to view this complain',
        ),
      )
    }

    res.status(HttpStatusCodes.OK).json(complain)
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
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
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

  const { id } = req.params
  const { subject, description, category, status } = req.body
  const newImage = req.file

  try {
    const complain = await Complain.findById(id)
    if (!complain)
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Complain not found'),
      )

    if (complain.userId.toString() !== req.user.id) {
      return next(
        createHttpError(
          HttpStatusCodes.FORBIDDEN,
          'Only creator can edit their complain',
        ),
      )
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
    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Complain edited successfully' })
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
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
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

  const { id } = req.params

  try {
    const complain = await Complain.findById(id)
    if (!complain)
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Complain not found'),
      )

    // Users can delete their own, Admins can delete any
    if (!isAdmin(req.user.role) && complain.userId.toString() !== req.user.id) {
      return next(
        createHttpError(
          HttpStatusCodes.FORBIDDEN,
          'You can only delete your own complaints',
        ),
      )
    }

    await complain.deleteOne()
    res
      .status(HttpStatusCodes.OK)
      .json({ message: 'Complain deleted successfully' })
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
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
  if (!req.user)
    return next(
      createHttpError(HttpStatusCodes.NOT_FOUND, 'User not logged-in'),
    )

  const { id } = req.params

  try {
    const complain = await Complain.findById(id)
    if (!complain)
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Complain not found'),
      )

    if (!isAdmin(req.user.role)) {
      return next(
        createHttpError(
          HttpStatusCodes.FORBIDDEN,
          'You don’t have permission to change status',
        ),
      )
    }

    let updatedMessage = ''
    let emailSubject = ''
    let emailBody = ''

    switch (complain.status) {
      case Status.PENDING:
        complain.status = Status.IN_PROCESS
        updatedMessage = 'Complain status updated to in-process'
        emailSubject = 'तपाईंको गुनासो प्रक्रियामा रहेको जानकारी'
        emailBody = `
          <p>आदरणीय सेवाग्राही,</p>
          <p>यो सूचना तपाईंको गुनासो (ID: <strong>${complain._id}</strong> शीर्षक: <strong>${complain.subject}</strong>) हाल प्रक्रिया अन्तर्गत रहेको जानकारी गराउनका लागि पठाइएको हो।</p>
          <p>सम्बन्धित निकायले यसलाई यथाशीघ्र समाधान गर्न आवश्यक पहल गरिरहेको छ।</p>
          <p>गुनासो समाधान भए पश्चात् थप जानकारी उपलब्ध गराइनेछ।</p>
          <br/>
          <p>तपाईंको सहकार्यका लागि धन्यवाद।</p>
          <p>सादर,</p>
          <p><strong>नेपाल सरकार</strong></p>
          `
        await sendEmail(complain.userId, emailSubject, emailBody)
        break

      case Status.IN_PROCESS:
        complain.status = Status.RESOLVED
        updatedMessage = 'Complain status updated to resolved'
        emailSubject = 'तपाईंको गुनासो समाधान गरिएको जानकारी'
        emailBody = `
          <p>आदरणीय सेवाग्राही,</p>
          <p>तपाईंको गुनासो (ID: <strong>${complain._id}</strong> शीर्षक: <strong>${complain.subject}</strong>) सफलतापूर्वक समाधान गरिएको जानकारी गराउन चाहन्छौं।</p>
          <p>नेपाल सरकार तपाईंको सहकार्य र धैर्यका लागि आभार व्यक्त गर्दछ।</p>
          <p>यदि थप जानकारी वा सहायता आवश्यक परेमा, कृपया सम्बन्धित निकायमा सम्पर्क गर्नुहोस्।</p>
          <br/>
          <p>सादर,</p>
          <p><strong>नेपाल सरकार</strong></p>
          `
        await sendEmail(complain.userId, emailSubject, emailBody)
        break

      default:
        return next(
          createHttpError(
            HttpStatusCodes.INTERNAL_SERVER_ERROR,
            'Cannot update complain status',
          ),
        )
    }

    await complain.save()

    // sending email
    await sendEmail(complain.userId, emailSubject, emailBody)

    res.status(HttpStatusCodes.OK).json({ message: updatedMessage })
  } catch (error) {
    next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Internal server error',
      ),
    )
  }
}
