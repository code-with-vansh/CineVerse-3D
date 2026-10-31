-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ScreenType" AS ENUM ('IMAX', 'THREE_D', 'FOUR_DX', 'STANDARD');

-- CreateEnum
CREATE TYPE "SeatCategory" AS ENUM ('SILVER', 'GOLD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'LOCKED', 'BOOKED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'EXPIRED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "poster" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "trailerUrl" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 8.0,
    "cast" TEXT NOT NULL,
    "director" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theatres" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "facilities" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "theatres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screens" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screenNumber" INTEGER NOT NULL,
    "theatreId" TEXT NOT NULL,
    "screenType" "ScreenType" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "screens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "row" TEXT NOT NULL,
    "seatNumber" INTEGER NOT NULL,
    "category" "SeatCategory" NOT NULL DEFAULT 'SILVER',
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shows" (
    "id" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,
    "screenId" TEXT NOT NULL,
    "showDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "ticketPriceMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show_seats" (
    "id" TEXT NOT NULL,
    "showId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "status" "SeatStatus" NOT NULL DEFAULT 'AVAILABLE',
    "lockedBy" TEXT,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "show_seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "bookingReference" TEXT NOT NULL,
    "userId" TEXT,
    "showId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalTicketAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_seats" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "seatId" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_seats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "movies_language_idx" ON "movies"("language");

-- CreateIndex
CREATE INDEX "movies_title_idx" ON "movies"("title");

-- CreateIndex
CREATE INDEX "theatres_city_idx" ON "theatres"("city");

-- CreateIndex
CREATE UNIQUE INDEX "screens_theatreId_screenNumber_key" ON "screens"("theatreId", "screenNumber");

-- CreateIndex
CREATE INDEX "seats_screenId_idx" ON "seats"("screenId");

-- CreateIndex
CREATE UNIQUE INDEX "seats_screenId_row_seatNumber_key" ON "seats"("screenId", "row", "seatNumber");

-- CreateIndex
CREATE INDEX "shows_movieId_idx" ON "shows"("movieId");

-- CreateIndex
CREATE INDEX "shows_screenId_idx" ON "shows"("screenId");

-- CreateIndex
CREATE INDEX "shows_showDate_idx" ON "shows"("showDate");

-- CreateIndex
CREATE INDEX "show_seats_showId_idx" ON "show_seats"("showId");

-- CreateIndex
CREATE INDEX "show_seats_status_idx" ON "show_seats"("status");

-- CreateIndex
CREATE UNIQUE INDEX "show_seats_showId_seatId_key" ON "show_seats"("showId", "seatId");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_bookingReference_key" ON "bookings"("bookingReference");

-- CreateIndex
CREATE INDEX "bookings_bookingReference_idx" ON "bookings"("bookingReference");

-- CreateIndex
CREATE INDEX "bookings_userId_idx" ON "bookings"("userId");

-- CreateIndex
CREATE INDEX "bookings_showId_idx" ON "bookings"("showId");

-- CreateIndex
CREATE INDEX "booking_seats_bookingId_idx" ON "booking_seats"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "booking_seats_bookingId_seatId_key" ON "booking_seats"("bookingId", "seatId");

-- AddForeignKey
ALTER TABLE "screens" ADD CONSTRAINT "screens_theatreId_fkey" FOREIGN KEY ("theatreId") REFERENCES "theatres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shows" ADD CONSTRAINT "shows_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_seats" ADD CONSTRAINT "show_seats_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show_seats" ADD CONSTRAINT "show_seats_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_showId_fkey" FOREIGN KEY ("showId") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_seatId_fkey" FOREIGN KEY ("seatId") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
