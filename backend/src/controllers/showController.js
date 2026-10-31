import prisma from '../config/database.js';

export const getShows = async (req, res, next) => {
  try {
    const { movieId, theatreId, city, date, language, screenType } = req.query;

    const where = {};

    if (movieId) where.movieId = movieId;
    if (date) where.showDate = date;
    if (language) where.language = { equals: language, mode: 'insensitive' };

    const screenWhere = {};
    if (screenType) screenWhere.screenType = screenType;
    if (theatreId) screenWhere.theatreId = theatreId;

    if (city) {
      screenWhere.theatre = {
        city: { equals: city, mode: 'insensitive' },
      };
    }

    if (Object.keys(screenWhere).length > 0) {
      where.screen = screenWhere;
    }

    const shows = await prisma.show.findMany({
      where,
      include: {
        movie: {
          select: { id: true, title: true, poster: true, banner: true, duration: true, rating: true },
        },
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
    });

    res.status(200).json({
      success: true,
      data: { shows },
    });
  } catch (error) {
    next(error);
  }
};

export const getShowById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const show = await prisma.show.findUnique({
      where: { id },
      include: {
        movie: true,
        screen: {
          include: {
            theatre: true,
          },
        },
      },
    });

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { show },
    });
  } catch (error) {
    next(error);
  }
};

export const getShowsByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { city, date } = req.query;

    const where = { movieId };
    if (date) where.showDate = date;

    if (city) {
      where.screen = {
        theatre: {
          city: { equals: city, mode: 'insensitive' },
        },
      };
    }

    const shows = await prisma.show.findMany({
      where,
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
    });

    res.status(200).json({
      success: true,
      data: { shows },
    });
  } catch (error) {
    next(error);
  }
};

export const getShowsByTheatre = async (req, res, next) => {
  try {
    const { theatreId } = req.params;
    const { date } = req.query;

    const where = {
      screen: {
        theatreId,
      },
    };

    if (date) where.showDate = date;

    const shows = await prisma.show.findMany({
      where,
      include: {
        movie: true,
        screen: true,
      },
      orderBy: [
        { showDate: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.status(200).json({
      success: true,
      data: { shows },
    });
  } catch (error) {
    next(error);
  }
};
