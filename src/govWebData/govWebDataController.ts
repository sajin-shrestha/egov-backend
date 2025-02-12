import { NextFunction, Request, Response } from 'express'
import createHttpError from 'http-errors'
import govWebDataModel from './govWebDataModel'
import { AuthenticatedRequest } from '../middlewares/auth'
import { HttpStatusCodes } from '../constants'
import { isAdmin } from '../utils/helper'
import createFilter from '../utils/filter'
import { pagination } from '../utils/pagination'

const getAllGovWebData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Get page number and limit from query parameters, default to page 1 and limit 10 if not provided
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const filter = createFilter(req, ['name', 'description', 'address'])

    const { total_count, next_page_number, prev_page_number, data } =
      await pagination(
        govWebDataModel, // Model to be paginated
        filter, // Filter to apply
        page, // Page number
        limit, // Limit per page
      )

    res.status(HttpStatusCodes.OK).json({
      total_count,
      next_page_number,
      prev_page_number,
      data,
    })
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while fetching government data',
      ),
    )
  }
}

// Get government web data by ID
const getGovWebDataById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  try {
    const data = await govWebDataModel.findById(id)
    if (!data) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Government data not found'),
      )
    }
    res.status(HttpStatusCodes.OK).json(data)
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while fetching government data',
      ),
    )
  }
}

// Add new government web data
const addGovWebData = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user)
    return next(createHttpError(HttpStatusCodes.NOT_FOUND, 'User Not Found'))

  if (!isAdmin(req.user.role))
    return next(createHttpError(HttpStatusCodes.UNAUTHORIZED, 'Unauthorized'))

  const { name, description, address, website_url, image_url } = req.body

  if (!name || !description || !address || !website_url) {
    return next(
      createHttpError(
        HttpStatusCodes.BAD_REQUEST,
        'Some required fields are missing',
      ),
    )
  }

  try {
    const existingGovData = await govWebDataModel.findOne({ website_url })
    if (existingGovData) {
      return next(
        createHttpError(
          HttpStatusCodes.BAD_REQUEST,
          'Government data already exists with this website url',
        ),
      )
    }

    await govWebDataModel.create({
      name,
      description,
      address,
      website_url,
      image_url: image_url || '',
    })

    res.status(HttpStatusCodes.CREATED).json({
      message: 'New government data added successfully',
    })
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while adding government data',
      ),
    )
  }
}

// Edit existing government web data
const editGovWebData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params
  const { name, description, address, website_url, image_url } = req.body

  try {
    const existingGovData = await govWebDataModel.findById(id)

    if (!existingGovData) {
      return next(
        createHttpError(HttpStatusCodes.NOT_FOUND, 'Government data not found'),
      )
    }

    if (name) existingGovData.name = name
    if (description) existingGovData.description = description
    if (address) existingGovData.address = address
    if (website_url) existingGovData.website_url = website_url
    if (image_url !== undefined) existingGovData.image_url = image_url // to allow empty string for image_url

    await existingGovData.save()

    res.status(HttpStatusCodes.OK).json({
      message: 'Government data updated successfully',
    })
  } catch (error) {
    return next(
      createHttpError(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        'Error while editing government data',
      ),
    )
  }
}

export { addGovWebData, editGovWebData, getAllGovWebData, getGovWebDataById }
