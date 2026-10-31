// Seat category pricing configuration
export const SEAT_PRICING = {
  SILVER: {
    name: 'Silver Class',
    price: 180,
    color: '#10b981', // Emerald
    description: 'Front rows with expansive screen immersive field-of-view',
    badge: 'Front Tier'
  },
  GOLD: {
    name: 'Gold Class',
    price: 280,
    color: '#06b6d4', // Cyan
    description: 'Prime viewing sweet spot with optimal surround acoustics',
    badge: 'Executive'
  },
  PREMIUM: {
    name: 'Premium Balcony',
    price: 420,
    color: '#f59e0b', // Amber
    description: 'Elevated VIP balcony plush recliners with private viewing angles',
    badge: 'VIP Balcony'
  }
};

// 4 Camera presets configuration for 3D auditorium
export const CAMERA_PRESETS = {
  overview: {
    id: 'overview',
    name: 'Overview',
    position: [0, 5.8, 16.2],
    target: [0, 2.4, 4.5]
  },
  stage: {
    id: 'stage',
    name: 'From Stage',
    position: [0, 1.8, -1.0],
    target: [0, 3.0, 10.5]
  },
  balcony: {
    id: 'balcony',
    name: 'Balcony',
    position: [0, 5.8, 18.2],
    target: [0, 3.2, 0.0]
  },
  birdseye: {
    id: 'birdseye',
    name: "Bird's Eye",
    position: [0, 15.2, 10.2],
    target: [0, 0, 10.2]
  }
};

export const ROW_COORDINATES = {
  A: { category: 'SILVER', z: 4.2, y: 0.2 },
  B: { category: 'SILVER', z: 5.6, y: 0.45 },
  C: { category: 'SILVER', z: 7.0, y: 0.7 },
  D: { category: 'GOLD', z: 8.8, y: 1.0 },
  E: { category: 'GOLD', z: 10.2, y: 1.3 },
  F: { category: 'GOLD', z: 11.6, y: 1.6 },
  G: { category: 'GOLD', z: 13.0, y: 1.9 },
  H: { category: 'GOLD', z: 14.4, y: 2.2 },
  J: { category: 'PREMIUM', z: 16.8, y: 3.1 },
  K: { category: 'PREMIUM', z: 18.2, y: 3.6 },
  L: { category: 'PREMIUM', z: 19.6, y: 4.1 }
};

export function getSeatPosition(row, seatNum) {
  const rowConfig = ROW_COORDINATES[row] || { y: 1.0, z: 10.0 };
  let xOffset = 0;
  if (seatNum <= 4) {
    xOffset = -6.2 + (seatNum - 1) * 0.95;
  } else if (seatNum <= 10) {
    xOffset = -2.85 + (seatNum - 5) * 0.95;
  } else {
    xOffset = 3.35 + (seatNum - 11) * 0.95;
  }
  return [xOffset, rowConfig.y, rowConfig.z];
}

// Generates realistic cinema auditorium seat matrix (fallback / local simulation)
export function generateCinemaSeats(movieId = 'kalki-2898-ad', showtime = '10:30 AM') {
  const rows = [
    { row: 'A', category: 'SILVER', z: 4.2, y: 0.2 },
    { row: 'B', category: 'SILVER', z: 5.6, y: 0.45 },
    { row: 'C', category: 'SILVER', z: 7.0, y: 0.7 },
    { row: 'D', category: 'GOLD', z: 8.8, y: 1.0 },
    { row: 'E', category: 'GOLD', z: 10.2, y: 1.3 },
    { row: 'F', category: 'GOLD', z: 11.6, y: 1.6 },
    { row: 'G', category: 'GOLD', z: 13.0, y: 1.9 },
    { row: 'H', category: 'GOLD', z: 14.4, y: 2.2 },
    { row: 'J', category: 'PREMIUM', z: 16.8, y: 3.1 },
    { row: 'K', category: 'PREMIUM', z: 18.2, y: 3.6 },
    { row: 'L', category: 'PREMIUM', z: 19.6, y: 4.1 }
  ];

  const seedString = `${movieId}-${showtime}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }

  const seats = [];

  rows.forEach((rowConfig) => {
    for (let seatNum = 1; seatNum <= 14; seatNum++) {
      let xOffset = 0;

      if (seatNum <= 4) {
        xOffset = -6.2 + (seatNum - 1) * 0.95;
      } else if (seatNum <= 10) {
        xOffset = -2.85 + (seatNum - 5) * 0.95;
      } else {
        xOffset = 3.35 + (seatNum - 11) * 0.95;
      }

      const id = `${rowConfig.row}-${seatNum}`;
      const seatSeed = Math.sin(hash + rowConfig.row.charCodeAt(0) * 17 + seatNum * 31) * 10000;
      const rand = seatSeed - Math.floor(seatSeed);
      const isOccupied = rand < 0.28;

      seats.push({
        id,
        row: rowConfig.row,
        number: seatNum,
        label: `${rowConfig.row}${seatNum}`,
        category: rowConfig.category,
        price: SEAT_PRICING[rowConfig.category].price,
        status: isOccupied ? 'occupied' : 'available',
        position: [xOffset, rowConfig.y, rowConfig.z]
      });
    }
  });

  return seats;
}
