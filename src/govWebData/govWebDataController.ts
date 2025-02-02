import { NextFunction, Request, Response } from 'express'
import govWebDataModel from './govWebDataModel'
import createHttpError from 'http-errors'

// Get all government web data
const getAllGovWebData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await govWebDataModel.find()
    res.status(200).json(data)
  } catch (error) {
    return next(createHttpError(500, 'Error while fetching government data'))
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
      return next(createHttpError(404, 'Government data not found'))
    }
    res.status(200).json(data)
  } catch (error) {
    return next(createHttpError(500, 'Error while fetching government data'))
  }
}

// Add new government web data
const addGovWebData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, description, address, website_url, image_url } = req.body

  if (!name || !description || !address || !website_url) {
    return next(createHttpError(400, 'Some required fields are missing'))
  }

  try {
    const existingGovData = await govWebDataModel.findOne({ website_url })
    if (existingGovData) {
      return next(
        createHttpError(
          400,
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

    res.status(201).json({
      message: 'New government data added successfully',
    })
  } catch (error) {
    return next(createHttpError(500, 'Error while adding government data'))
  }
}

// Edit existing government web data
const editGovWebData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.body
  const { name, description, address, website_url, image_url } = req.body

  if (!id || !name || !description || !address || !website_url) {
    return next(createHttpError(400, 'Some required fields are missing'))
  }

  try {
    const existingGovData = await govWebDataModel.findById(id)
    if (!existingGovData) {
      return next(createHttpError(404, 'Government data not found'))
    }

    existingGovData.name = name
    existingGovData.description = description
    existingGovData.address = address
    existingGovData.website_url = website_url
    existingGovData.image_url = image_url || ''

    await existingGovData.save()

    res.status(200).json({
      message: 'Government data updated successfully',
    })
  } catch (error) {
    return next(createHttpError(500, 'Error while editing government data'))
  }
}

export { addGovWebData, editGovWebData, getAllGovWebData, getGovWebDataById }
