import prisma from '../config/database.js';

export const getAllMovies = async (req, res, next) => {
  try {
    const { language, genre, search, page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const where = {};

    if (language && language.toLowerCase() !== 'all') {
      where.language = {
        equals: language,
        mode: 'insensitive',
      };
    }

    if (genre) {
      where.genre = {
        contains: genre,
        mode: 'insensitive',
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { cast: { contains: search, mode: 'insensitive' } },
        { director: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [total, movies] = await Promise.all([
      prisma.movie.count({ where }),
      prisma.movie.findMany({
        where,
        skip,
        take,
        orderBy: { rating: 'desc' },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        page: parseInt(page, 10),
        limit: take,
        totalPages: Math.ceil(total / take),
        movies,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMovieById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.findUnique({
      where: { id },
      include: {
        shows: {
          include: {
            screen: {
              include: {
                theatre: true,
              },
            },
          },
          orderBy: [
            { showDate: 'asc' },
            { startTime: 'asc' },
          ],
        },
      },
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

export const getMoviesByLanguage = async (req, res, next) => {
  try {
    const { language } = req.params;

    const movies = await prisma.movie.findMany({
      where: {
        language: {
          equals: language,
          mode: 'insensitive',
        },
      },
      orderBy: { rating: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

export const searchMovies = async (req, res, next) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) {
      return res.status(200).json({
        success: true,
        data: { movies: [] },
      });
    }

    const movies = await prisma.movie.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { cast: { contains: query, mode: 'insensitive' } },
          { director: { contains: query, mode: 'insensitive' } },
          { language: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });

    res.status(200).json({
      success: true,
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

export const getNowShowing = async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany({
      where: {
        shows: {
          some: {},
        },
      },
      orderBy: { rating: 'desc' },
      take: 20,
    });

    res.status(200).json({
      success: true,
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcoming = async (req, res, next) => {
  try {
    const movies = await prisma.movie.findMany({
      where: {
        shows: {
          none: {},
        },
      },
      orderBy: { releaseDate: 'asc' },
      take: 10,
    });

    res.status(200).json({
      success: true,
      data: { movies },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Operations
export const createMovie = async (req, res, next) => {
  try {
    const { title, description, poster, banner, trailerUrl, language, genre, duration, releaseDate, rating, cast, director } = req.body;

    if (!title || !description || !poster || !banner || !language || !genre) {
      return res.status(400).json({
        success: false,
        message: 'Missing required movie fields.',
      });
    }

    const movie = await prisma.movie.create({
      data: {
        title,
        description,
        poster,
        banner,
        trailerUrl: trailerUrl || '',
        language,
        genre,
        duration: duration || '150 min',
        releaseDate: releaseDate || new Date().toISOString().split('T')[0],
        rating: parseFloat(rating) || 8.0,
        cast: cast || '',
        director: director || '',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Movie created successfully.',
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

export const updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    const movie = await prisma.movie.update({
      where: { id },
      data: req.body,
    });

    res.status(200).json({
      success: true,
      message: 'Movie updated successfully.',
      data: { movie },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMovie = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.movie.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Movie deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
