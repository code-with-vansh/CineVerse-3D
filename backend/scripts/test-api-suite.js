// CineVerse 3D Comprehensive API Test Suite
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 CINEVERSE 3D - BACKEND & DATABASE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('--- 1. HEALTH & CONNECTIVITY ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthJson = await healthRes.json();
    assert(healthRes.status === 200 && healthJson.status === 'ok', 'GET /api/health returns 200 OK');

    // 2. Authentication
    console.log('\n--- 2. AUTHENTICATION & SECURITY ---');
    const testEmail = `test_user_${Date.now()}@cineverse.com`;

    // 2.1 Register
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Arjun Verma',
        email: testEmail,
        password: 'Password@123',
      }),
    });
    const regJson = await regRes.json();
    assert(regRes.status === 201 && regJson.success && regJson.data.token, 'POST /api/auth/register creates user and returns JWT');
    const userToken = regJson.data.token;

    // 2.2 Duplicate Email
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate',
        email: testEmail,
        password: 'Password@123',
      }),
    });
    assert(dupRes.status === 400, 'POST /api/auth/register prevents duplicate email registration (400)');

    // 2.3 Login Correct
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'Password@123',
      }),
    });
    const loginJson = await loginRes.json();
    assert(loginRes.status === 200 && loginJson.success && loginJson.data.user.email === testEmail, 'POST /api/auth/login succeeds with valid credentials');

    // 2.4 Login Incorrect Password
    const badLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword!',
      }),
    });
    assert(badLoginRes.status === 401, 'POST /api/auth/login rejects incorrect password with 401');

    // 2.5 Protected /api/auth/me with Bearer token
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const meJson = await meRes.json();
    assert(meRes.status === 200 && meJson.data.user.email === testEmail, 'GET /api/auth/me returns current user info with JWT');

    // 2.6 Reject invalid JWT
    const invalidJwtRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: 'Bearer invalid.token.payload' },
    });
    assert(invalidJwtRes.status === 401, 'GET /api/auth/me rejects invalid token with 401');

    // 2.7 Admin login
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@cineverse.com',
        password: 'Admin@123',
      }),
    });
    const adminLoginJson = await adminLoginRes.json();
    const adminToken = adminLoginJson.data.token;
    assert(adminLoginRes.status === 200 && adminLoginJson.data.user.role === 'ADMIN', 'POST /api/auth/login retrieves seeded ADMIN user');

    // 2.8 Non-admin cannot create movies (403)
    const nonAdminMovieRes = await fetch(`${BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: 'Hacked Movie',
        description: 'Should fail',
        poster: 'http://test.com/p.jpg',
        banner: 'http://test.com/b.jpg',
        language: 'Hindi',
        genre: 'Action',
      }),
    });
    assert(nonAdminMovieRes.status === 403, 'POST /api/movies forbids non-admin users (403 Forbidden)');

    // 3. Movies API
    console.log('\n--- 3. MOVIES CATALOG APIS ---');
    // 3.1 Get all movies
    const moviesRes = await fetch(`${BASE_URL}/movies`);
    const moviesJson = await moviesRes.json();
    assert(moviesRes.status === 200 && moviesJson.data.movies.length >= 20, `GET /api/movies returns ${moviesJson.data.total} movies (>= 20)`);
    const sampleMovie = moviesJson.data.movies[0];

    // 3.2 Filter by language
    const tamilRes = await fetch(`${BASE_URL}/movies/language/Tamil`);
    const tamilJson = await tamilRes.json();
    assert(tamilRes.status === 200 && tamilJson.data.movies.every((m) => m.language.toLowerCase() === 'tamil'), 'GET /api/movies/language/Tamil filters correctly');

    // 3.3 Search movies
    const searchRes = await fetch(`${BASE_URL}/movies/search?q=Kalki`);
    const searchJson = await searchRes.json();
    assert(searchRes.status === 200 && searchJson.data.movies.some((m) => m.title.includes('Kalki')), 'GET /api/movies/search?q=Kalki finds matching movie');

    // 3.4 Now showing
    const nowShowingRes = await fetch(`${BASE_URL}/movies/now-showing`);
    const nowShowingJson = await nowShowingRes.json();
    assert(nowShowingRes.status === 200 && nowShowingJson.data.movies.length > 0, 'GET /api/movies/now-showing returns active catalogue');

    // 3.5 Single movie details
    const movieDetailRes = await fetch(`${BASE_URL}/movies/${sampleMovie.id}`);
    const movieDetailJson = await movieDetailRes.json();
    assert(movieDetailRes.status === 200 && movieDetailJson.data.movie.title === sampleMovie.title, 'GET /api/movies/:id returns detailed movie with shows');

    // 4. Theatres & Shows
    console.log('\n--- 4. THEATRES & SHOWS APIS ---');
    const theatresRes = await fetch(`${BASE_URL}/theatres`);
    const theatresJson = await theatresRes.json();
    assert(theatresRes.status === 200 && theatresJson.data.theatres.length >= 5, `GET /api/theatres returns ${theatresJson.data.theatres.length} theatres (>= 5)`);

    const cityRes = await fetch(`${BASE_URL}/theatres/city/Mumbai`);
    const cityJson = await cityRes.json();
    assert(cityRes.status === 200 && cityJson.data.theatres.every((t) => t.city.toLowerCase() === 'mumbai'), 'GET /api/theatres/city/Mumbai filters by city');

    // Fetch all shows
    const allShowsRes = await fetch(`${BASE_URL}/shows`);
    const allShowsJson = await allShowsRes.json();
    assert(allShowsRes.status === 200 && allShowsJson.data.shows.length > 0, `GET /api/shows returns ${allShowsJson.data.shows.length} shows`);
    const testShow = allShowsJson.data.shows[0];

    // Fetch shows for this movie
    const showsRes = await fetch(`${BASE_URL}/shows?movieId=${testShow.movieId}`);
    const showsJson = await showsRes.json();
    assert(showsRes.status === 200 && showsJson.data.shows.length > 0, 'GET /api/shows?movieId=... returns active shows');

    // 5. Dynamic Seats & 3D Cinema Hall
    console.log('\n--- 5. DYNAMIC SEAT AVAILABILITY (3D AUDITORIUM) ---');
    const seatsRes = await fetch(`${BASE_URL}/shows/${testShow.id}/seats`);
    const seatsJson = await seatsRes.json();
    assert(
      seatsRes.status === 200 &&
      seatsJson.data.seats.length === 154 &&
      seatsJson.data.seats.some((s) => s.category === 'SILVER') &&
      seatsJson.data.seats.some((s) => s.category === 'GOLD') &&
      seatsJson.data.seats.some((s) => s.category === 'PREMIUM'),
      'GET /api/shows/:showId/seats returns full 154 seats with SILVER/GOLD/PREMIUM categories'
    );

    const availableSeats = seatsJson.data.seats.filter((s) => s.status === 'AVAILABLE');
    assert(availableSeats.length >= 2, 'Show has available seats ready for reservation');
    const seatsToHold = [availableSeats[0].id, availableSeats[1].id];

    // 6. Temporary Seat Locking & Double-Booking Prevention
    console.log('\n--- 6. CONCURRENCY-SAFE SEAT LOCKING & BOOKING ---');
    // 6.1 Create seat hold
    const holdRes = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        showId: testShow.id,
        seatIds: seatsToHold,
      }),
    });
    const holdJson = await holdRes.json();
    assert(
      holdRes.status === 201 &&
      holdJson.success &&
      holdJson.data.bookingReference &&
      holdJson.data.status === 'PENDING' &&
      holdJson.data.seatsCount === 2,
      `POST /api/bookings/hold locked 2 seats with reference ${holdJson.data?.bookingReference}`
    );
    const bookingRef = holdJson.data.bookingReference;

    // 6.2 Prevent double-booking (attempting to hold the exact same seats simultaneously)
    const doubleHoldRes = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        showId: testShow.id,
        seatIds: seatsToHold,
      }),
    });
    assert(doubleHoldRes.status === 409, 'POST /api/bookings/hold blocks simultaneous double-booking with 409 Conflict');

    // 6.3 Verify seats now show as LOCKED in dynamic seat map
    const recheckedSeatsRes = await fetch(`${BASE_URL}/shows/${testShow.id}/seats`);
    const recheckedSeatsJson = await recheckedSeatsRes.json();
    const isLockedNow = recheckedSeatsJson.data.seats.filter((s) => seatsToHold.includes(s.id)).every((s) => s.status === 'LOCKED');
    assert(isLockedNow, 'Seat availability reflects real-time LOCKED status in 3D auditorium');

    // 6.4 Release seat hold
    const releaseRes = await fetch(`${BASE_URL}/bookings/release`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        bookingReference: bookingRef,
      }),
    });
    const releaseJson = await releaseRes.json();
    assert(releaseRes.status === 200 && releaseJson.success, 'POST /api/bookings/release releases seat hold');

    // 6.5 Verify released seats are back to AVAILABLE
    const releasedSeatsRes = await fetch(`${BASE_URL}/shows/${testShow.id}/seats`);
    const releasedSeatsJson = await releasedSeatsRes.json();
    const isAvailableNow = releasedSeatsJson.data.seats.filter((s) => seatsToHold.includes(s.id)).every((s) => s.status === 'AVAILABLE');
    assert(isAvailableNow, 'Released seats immediately revert to AVAILABLE for other users');

    // 6.6 Booking history for user
    const userBookingsRes = await fetch(`${BASE_URL}/users/me/bookings`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const userBookingsJson = await userBookingsRes.json();
    assert(userBookingsRes.status === 200 && Array.isArray(userBookingsJson.data.bookings), 'GET /api/users/me/bookings retrieves user booking history');

    console.log('\n====================================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution exception:', err);
    process.exit(1);
  }
}

runTests();
