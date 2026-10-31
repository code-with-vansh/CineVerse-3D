import prisma from '../config/database.js';

// @desc    Get all available snacks (or all for admin)
// @route   GET /api/snacks
// @access  Public
export const getSnacks = async (req, res, next) => {
  try {
    const { category, includeUnavailable } = req.query;

    const where = {};
    if (category) {
      where.category = category.toUpperCase();
    }
    if (includeUnavailable !== 'true') {
      where.isAvailable = true;
    }

    const snacks = await prisma.snack.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { price: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      count: snacks.length,
      data: snacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get individual snack by ID
// @route   GET /api/snacks/:id
// @access  Public
export const getSnackById = async (req, res, next) => {
  try {
    const snack = await prisma.snack.findUnique({
      where: { id: req.params.id },
    });

    if (!snack) {
      return res.status(404).json({
        success: false,
        message: 'Snack product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: snack,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get snacks filtered by category
// @route   GET /api/snacks/category/:category
// @access  Public
export const getSnacksByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const snacks = await prisma.snack.findMany({
      where: {
        category: category.toUpperCase(),
        isAvailable: true,
      },
      orderBy: { price: 'asc' },
    });

    res.status(200).json({
      success: true,
      category: category.toUpperCase(),
      count: snacks.length,
      data: snacks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new snack (Admin only)
// @route   POST /api/snacks
// @access  Private/Admin
export const createSnack = async (req, res, next) => {
  try {
    const { name, description, image, category, price, isAvailable } = req.body;

    if (!name || !description || !image || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required snack fields (name, description, image, category, price).',
      });
    }

    const snack = await prisma.snack.create({
      data: {
        name,
        description,
        image,
        category: category.toUpperCase(),
        price: parseFloat(price),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Snack created successfully',
      data: snack,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a snack (Admin only)
// @route   PUT /api/snacks/:id
// @access  Private/Admin
export const updateSnack = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, category, price, isAvailable } = req.body;

    const existing = await prisma.snack.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Snack not found',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (image !== undefined) updateData.image = image;
    if (category !== undefined) updateData.category = category.toUpperCase();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (isAvailable !== undefined) updateData.isAvailable = Boolean(isAvailable);

    const updated = await prisma.snack.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Snack updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a snack (Admin only)
// @route   DELETE /api/snacks/:id
// @access  Private/Admin
export const deleteSnack = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await prisma.snack.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Snack not found',
      });
    }

    await prisma.snack.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: 'Snack deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
