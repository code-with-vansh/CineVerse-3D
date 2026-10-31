import { getSeatsForShow } from '../services/seatService.js';

export const getShowSeats = async (req, res, next) => {
  try {
    const { showId } = req.params;

    if (!showId) {
      return res.status(400).json({
        success: false,
        message: 'Show ID parameter is required.',
      });
    }

    const data = await getSeatsForShow(showId);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
