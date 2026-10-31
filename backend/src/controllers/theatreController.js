import prisma from '../config/database.js';

export const getAllTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;
    const where = {};

    if (city && city.toLowerCase() !== 'all') {
      where.city = {
        equals: city,
        mode: 'insensitive',
      };
    }

    const theatres = await prisma.theatre.findMany({
      where,
      include: {
        screens: {
          select: {
            id: true,
            name: true,
            screenNumber: true,
            screenType: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { theatres },
    });
  } catch (error) {
    next(error);
  }
};

export const getTheatreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const theatre = await prisma.theatre.findUnique({
      where: { id },
      include: {
        screens: {
          include: {
            shows: {
              include: {
                movie: true,
              },
            },
          },
        },
      },
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: { theatre },
    });
  } catch (error) {
    next(error);
  }
};

export const getTheatresByCity = async (req, res, next) => {
  try {
    const { city } = req.params;

    const theatres = await prisma.theatre.findMany({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
      include: {
        screens: true,
      },
      orderBy: { name: 'asc' },
    });

    res.status(200).json({
      success: true,
      data: { theatres },
    });
  } catch (error) {
    next(error);
  }
};

export const getTheatresByMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    const { city, date } = req.query;

    const showWhere = { movieId };
    if (date) {
      showWhere.showDate = date;
    }

    const shows = await prisma.show.findMany({
      where: showWhere,
      include: {
        screen: {
          include: {
            theatre: true,
          },
        },
      },
    });

    // Group shows by theatre
    const theatreMap = new Map();

    for (const show of shows) {
      const theatre = show.screen.theatre;
      if (city && theatre.city.toLowerCase() !== city.toLowerCase()) {
        continue;
      }

      if (!theatreMap.has(theatre.id)) {
        theatreMap.set(theatre.id, {
          id: theatre.id,
          name: theatre.name,
          city: theatre.city,
          address: theatre.address,
          facilities: theatre.facilities,
          shows: [],
        });
      }

      theatreMap.get(theatre.id).shows.push({
        id: show.id,
        showDate: show.showDate,
        startTime: show.startTime,
        endTime: show.endTime,
        language: show.language,
        screenName: show.screen.name,
        screenType: show.screen.screenType,
        ticketPriceMultiplier: show.ticketPriceMultiplier,
      });
    }

    const theatres = Array.from(theatreMap.values());

    res.status(200).json({
      success: true,
      data: { theatres },
    });
  } catch (error) {
    next(error);
  }
};
