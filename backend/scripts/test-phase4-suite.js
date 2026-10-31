// CineVerse 3D — Phase 4 Backend Integration Test Suite
const BASE_URL = 'http://localhost:5000/api';

async function runPhase4Tests() {
  console.log('====================================================');
  console.log('🍿 CINEVERSE 3D - PHASE 4 FULL-STACK API TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName, detail = '') {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  try {
    // 1. Snacks Catalog APIs
    console.log('--- 1. SNACKS CATALOG APIS ---');
    const snacksRes = await fetch(`${BASE_URL}/snacks`);
    const snacksJson = await snacksRes.json();
    assert(snacksRes.status === 200 && snacksJson.count >= 19, `GET /api/snacks returns all available snacks (Count: ${snacksJson.count})`);

    const popcornRes = await fetch(`${BASE_URL}/snacks/category/POPCORN`);
    const popcornJson = await popcornRes.json();
    assert(popcornRes.status === 200 && popcornJson.data.length >= 4, `GET /api/snacks/category/POPCORN returns popcorn items (Count: ${popcornJson.data?.length})`);

    const testSnack1 = snacksJson.data[0];
    const testSnack2 = snacksJson.data.find(s => s.category === 'BEVERAGES') || snacksJson.data[1];

    // 2. Resolve a Show and available seats
    console.log('\n--- 2. SHOW & SEAT AVAILABILITY ---');
    const showsRes = await fetch(`${BASE_URL}/shows`);
    const showsJson = await showsRes.json();
    const testShow = showsJson.data.shows[0];
    assert(testShow && testShow.id, `Resolved test show: ${testShow.movie.title} (${testShow.startTime})`);

    const seatsRes = await fetch(`${BASE_URL}/shows/${testShow.id}/seats`);
    const seatsJson = await seatsRes.json();
    const availableSeats = seatsJson.data.seats.filter(s => s.status === 'AVAILABLE');
    assert(availableSeats.length >= 2, `Found ${availableSeats.length} available seats for show`);

    const selectedSeatIds = [availableSeats[0].id, availableSeats[1].id];

    // 3. Hold seats atomically
    console.log('\n--- 3. ATOMIC SEAT HOLD ---');
    const holdRes = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        showId: testShow.id,
        seatIds: selectedSeatIds,
      }),
    });
    const holdJson = await holdRes.json();
    assert(holdRes.status === 201 && holdJson.data.bookingReference, `POST /api/bookings/hold created pending booking: ${holdJson.data?.bookingReference}`);
    const bookingRef = holdJson.data.bookingReference;
    const bookingId = holdJson.data.bookingId;

    // 4. Attach Snacks to pending booking
    console.log('\n--- 4. ATTACH SNACKS & RECALCULATE AMOUNTS ---');
    const attachSnacksRes = await fetch(`${BASE_URL}/bookings/${bookingRef}/snacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { snackId: testSnack1.id, quantity: 2 },
          { snackId: testSnack2.id, quantity: 2 },
        ],
      }),
    });
    const attachSnacksJson = await attachSnacksRes.json();
    const updatedBooking = attachSnacksJson.data.booking;
    const expectedSnackSubtotal = (testSnack1.price * 2) + (testSnack2.price * 2);
    assert(
      attachSnacksRes.status === 200 &&
      updatedBooking.totalSnackAmount === expectedSnackSubtotal &&
      updatedBooking.bookingSnacks.length === 2,
      `POST /api/bookings/:id/snacks updated snacks subtotal correctly (₹${updatedBooking?.totalSnackAmount})`
    );

    // 5. Get Booking Summary
    console.log('\n--- 5. CHECKOUT SUMMARY BREAKDOWN ---');
    const summaryRes = await fetch(`${BASE_URL}/bookings/${bookingRef}/summary`);
    const summaryJson = await summaryRes.json();
    assert(
      summaryRes.status === 200 &&
      summaryJson.data.isHoldActive === true &&
      summaryJson.data.remainingHoldSeconds > 0 &&
      summaryJson.data.booking.grandTotal > 0,
      `GET /api/bookings/:id/summary returns verified active hold and grand total ₹${summaryJson.data?.booking?.grandTotal}`
    );

    // 6. Initiate Payment
    console.log('\n--- 6. INITIATE DEMO PAYMENT ---');
    const initPayRes = await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: bookingRef,
        paymentMethod: 'UPI',
      }),
    });
    const initPayJson = await initPayRes.json();
    assert(
      initPayRes.status === 201 &&
      initPayJson.data.payment.id &&
      initPayJson.data.payment.status === 'PENDING',
      `POST /api/payments/initiate created pending transaction: ${initPayJson.data?.payment?.transactionReference}`
    );
    const paymentId = initPayJson.data.payment.id;

    // 7. Simulate Payment Failure
    console.log('\n--- 7. SIMULATE PAYMENT FAILURE (RETRYABLE) ---');
    const failPayRes = await fetch(`${BASE_URL}/payments/${paymentId}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcome: 'FAILED',
        paymentMethod: 'UPI',
      }),
    });
    const failPayJson = await failPayRes.json();
    assert(
      failPayRes.status === 400 &&
      failPayJson.payment.status === 'FAILED' &&
      failPayJson.canRetry === true,
      `POST /api/payments/:id/simulate-result with FAILED marks payment failed without confirming booking`
    );

    // 8. Re-initiate or Retry and Simulate Payment Success
    console.log('\n--- 8. SIMULATE PAYMENT SUCCESS (TRANSACTIONAL CONFIRMATION) ---');
    const retryPayRes = await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bookingReference: bookingRef,
        paymentMethod: 'CARD',
      }),
    });
    const retryPayJson = await retryPayRes.json();
    const successPaymentId = retryPayJson.data.payment.id;

    const successPayRes = await fetch(`${BASE_URL}/payments/${successPaymentId}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcome: 'SUCCESS',
        paymentMethod: 'CARD',
      }),
    });
    const successPayJson = await successPayRes.json();
    assert(
      successPayRes.status === 200 &&
      successPayJson.booking.status === 'CONFIRMED' &&
      successPayJson.ticketCode &&
      successPayJson.ticketCode.startsWith('CV3D-TKT-'),
      `Simulated Payment SUCCESS: Booking confirmed with unique ticket code: ${successPayJson.ticketCode}`
    );
    const ticketCode = successPayJson.ticketCode;

    // 9. Verify Idempotency of Payment Success
    console.log('\n--- 9. PAYMENT IDEMPOTENCY ---');
    const idempotentRes = await fetch(`${BASE_URL}/payments/${successPaymentId}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome: 'SUCCESS' }),
    });
    const idempotentJson = await idempotentRes.json();
    assert(
      idempotentRes.status === 200 &&
      idempotentJson.isIdempotent === true &&
      idempotentJson.ticketCode === ticketCode,
      'Calling payment success again returns idempotent safe response without double confirmation'
    );

    // 10. Verify Seat Status in ShowSeat became BOOKED
    console.log('\n--- 10. VERIFY SEATS MARKED BOOKED IN DATABASE ---');
    const verifySeatsRes = await fetch(`${BASE_URL}/shows/${testShow.id}/seats`);
    const verifySeatsJson = await verifySeatsRes.json();
    const updatedSeats = verifySeatsJson.data.seats.filter(s => selectedSeatIds.includes(s.id));
    const allBooked = updatedSeats.every(s => s.status === 'BOOKED');
    assert(allBooked, `All ${updatedSeats.length} held seats permanently transitioned to BOOKED status in PostgreSQL`);

    // 11. Verify Digital Ticket Endpoint
    console.log('\n--- 11. DIGITAL TICKET VERIFICATION ENDPOINT ---');
    const ticketRes = await fetch(`${BASE_URL}/tickets/${ticketCode}`);
    const ticketJson = await ticketRes.json();
    assert(
      ticketRes.status === 200 &&
      ticketJson.isValid === true &&
      ticketJson.data.ticketCode === ticketCode &&
      ticketJson.data.movie.title === testShow.movie.title &&
      ticketJson.data.seats.length === 2,
      `GET /api/tickets/:ticketCode successfully verifies ticket validity and returns ticket metadata`
    );

    console.log('\n====================================================');
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('Fatal test error:', err);
  }
}

runPhase4Tests();
