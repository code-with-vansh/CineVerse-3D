// CineVerse 3D — Comprehensive Phase 4 Test Scenarios 1-5
import prisma from '../src/config/database.js';

const BASE_URL = 'http://localhost:5000/api';

async function runAllScenarios() {
  console.log('================================================================');
  console.log('🍿 CINEVERSE 3D — FULL PHASE 4 VERIFICATION (SCENARIOS 1-5)');
  console.log('================================================================\n');

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
    // -------------------------------------------------------------
    // SCENARIO 1: COMPLETE SUCCESSFUL BOOKING JOURNEY
    // -------------------------------------------------------------
    console.log('>>> SCENARIO 1: SUCCESSFUL BOOKING JOURNEY <<<');
    
    // 1.1 Fetch Show and Seats
    const showsRes = await fetch(`${BASE_URL}/shows`);
    const showsJson = await showsRes.json();
    const show = showsJson.data.shows[0];
    
    const seatsRes = await fetch(`${BASE_URL}/shows/${show.id}/seats`);
    const seatsJson = await seatsRes.json();
    const availableSeats = seatsJson.data.seats.filter(s => s.status === 'AVAILABLE');
    const selectedSeats = [availableSeats[0].id, availableSeats[1].id];

    // 1.2 Hold Seats
    const holdRes = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId: show.id, seatIds: selectedSeats }),
    });
    const holdJson = await holdRes.json();
    const bookingRef = holdJson.data.bookingReference;
    assert(holdRes.status === 201 && bookingRef, '1. Held 2 seats atomically in PostgreSQL');

    // 1.3 Add Popcorn & Beverages
    const snacksRes = await fetch(`${BASE_URL}/snacks`);
    const snacks = (await snacksRes.json()).data;
    const popcorn = snacks.find(s => s.category === 'POPCORN');
    const drink = snacks.find(s => s.category === 'BEVERAGES');

    const addSnacksRes = await fetch(`${BASE_URL}/bookings/${bookingRef}/snacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { snackId: popcorn.id, quantity: 2 },
          { snackId: drink.id, quantity: 1 },
        ],
      }),
    });
    const addSnacksJson = await addSnacksRes.json();
    assert(addSnacksRes.status === 200, '2. Attached Popcorn & Drink to booking');

    // 1.4 Modify Cart Quantity
    const modSnacksRes = await fetch(`${BASE_URL}/bookings/${bookingRef}/snacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [
          { snackId: popcorn.id, quantity: 1 }, // Changed from 2 to 1
          { snackId: drink.id, quantity: 2 },   // Changed from 1 to 2
        ],
      }),
    });
    const modSnacksJson = await modSnacksRes.json();
    const expectedSnackAmount = (popcorn.price * 1) + (drink.price * 2);
    assert(
      modSnacksJson.data.booking.totalSnackAmount === expectedSnackAmount,
      `3. Modified snack quantities updated server subtotal to ₹${expectedSnackAmount}`
    );

    // 1.5 Checkout & Price Calculation
    const summaryRes = await fetch(`${BASE_URL}/bookings/${bookingRef}/summary`);
    const summaryJson = await summaryRes.json();
    const summary = summaryJson.data.booking;
    const expectedTax = Math.round(((35.0 * 0.18) + (expectedSnackAmount * 0.05)) * 100) / 100;
    const expectedGrandTotal = Math.round((summary.totalTicketAmount + expectedSnackAmount + 35.0 + expectedTax) * 100) / 100;
    assert(summary.grandTotal === expectedGrandTotal, `4. Server price calculation accurate (₹${summary.grandTotal})`);

    // 1.6 Initiate Demo Payment
    const initPayRes = await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference: bookingRef, paymentMethod: 'UPI' }),
    });
    const initPayJson = await initPayRes.json();
    const paymentId = initPayJson.data.payment.id;
    assert(initPayRes.status === 201 && paymentId, '5. Initiated demo UPI payment transaction');

    // 1.7 Simulate Successful Payment
    const simSuccessRes = await fetch(`${BASE_URL}/payments/${paymentId}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome: 'SUCCESS', paymentMethod: 'UPI' }),
    });
    const simSuccessJson = await simSuccessRes.json();
    assert(
      simSuccessRes.status === 200 &&
      simSuccessJson.booking.status === 'CONFIRMED' &&
      simSuccessJson.ticketCode,
      `6. Payment successful & booking confirmed: ${simSuccessJson.ticketCode}`
    );
    const ticketCode = simSuccessJson.ticketCode;

    // 1.8 Verify Ticket
    const ticketRes = await fetch(`${BASE_URL}/tickets/${ticketCode}`);
    const ticketJson = await ticketRes.json();
    assert(ticketJson.isValid === true && ticketJson.data.ticketCode === ticketCode, '7. Ticket verified via /api/tickets/:ticketCode');

    // -------------------------------------------------------------
    // SCENARIO 2: PAYMENT FAILURE & RETRY
    // -------------------------------------------------------------
    console.log('\n>>> SCENARIO 2: PAYMENT FAILURE & RETRY <<<');
    
    // 2.1 Create another booking
    const avail2 = (await (await fetch(`${BASE_URL}/shows/${show.id}/seats`)).json()).data.seats.filter(s => s.status === 'AVAILABLE');
    const hold2Res = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId: show.id, seatIds: [avail2[0].id] }),
    });
    const booking2Ref = (await hold2Res.json()).data.bookingReference;

    // 2.2 Initiate payment & simulate failure
    const initPay2 = await (await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference: booking2Ref, paymentMethod: 'CARD' }),
    })).json();

    const failPayRes = await fetch(`${BASE_URL}/payments/${initPay2.data.payment.id}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome: 'FAILED' }),
    });
    const failJson = await failPayRes.json();
    assert(failPayRes.status === 400 && failJson.payment.status === 'FAILED', '1. Payment marked FAILED on simulator decline');

    // 2.3 Verify booking is STILL PENDING and seats not booked
    const checkBooking2 = await (await fetch(`${BASE_URL}/bookings/${booking2Ref}`)).json();
    assert(checkBooking2.data.booking.status === 'PENDING', '2. Booking remains PENDING after payment failure');

    // 2.4 Retry payment with SUCCESS
    const retryPay = await (await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference: booking2Ref, paymentMethod: 'WALLET' }),
    })).json();

    const retrySuccess = await (await fetch(`${BASE_URL}/payments/${retryPay.data.payment.id}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome: 'SUCCESS' }),
    })).json();
    assert(retrySuccess.success === true && retrySuccess.booking.status === 'CONFIRMED', '3. Retry payment successfully confirmed the booking');

    // -------------------------------------------------------------
    // SCENARIO 3: EXPIRED SEAT HOLD
    // -------------------------------------------------------------
    console.log('\n>>> SCENARIO 3: EXPIRED SEAT HOLD HANDLING <<<');
    
    // 3.1 Create booking then artificially set lockedUntil into the past
    const avail3 = (await (await fetch(`${BASE_URL}/shows/${show.id}/seats`)).json()).data.seats.filter(s => s.status === 'AVAILABLE');
    const hold3Res = await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId: show.id, seatIds: [avail3[0].id] }),
    });
    const booking3Ref = (await hold3Res.json()).data.bookingReference;

    // Simulate hold expiration in database (set lockedUntil to 10 minutes ago)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    await prisma.showSeat.update({
      where: { showId_seatId: { showId: show.id, seatId: avail3[0].id } },
      data: { lockedUntil: tenMinutesAgo },
    });

    // 3.2 Attempt payment initiation with expired hold
    const expiredInitRes = await fetch(`${BASE_URL}/payments/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingReference: booking3Ref, paymentMethod: 'UPI' }),
    });
    assert(expiredInitRes.status === 410, '1. Payment initiation rejected with HTTP 410 for expired seat reservation');

    // 3.3 Verify seat became AVAILABLE again
    const seatRefresh = (await (await fetch(`${BASE_URL}/shows/${show.id}/seats`)).json()).data.seats.find(s => s.id === avail3[0].id);
    assert(seatRefresh.status === 'AVAILABLE', '2. Expired seat automatically reclaimed to AVAILABLE status');

    // -------------------------------------------------------------
    // SCENARIO 4: CART VALIDATION
    // -------------------------------------------------------------
    console.log('\n>>> SCENARIO 4: CART VALIDATION & TAMPERING PREVENTION <<<');
    
    const avail4 = (await (await fetch(`${BASE_URL}/shows/${show.id}/seats`)).json()).data.seats.filter(s => s.status === 'AVAILABLE');
    const hold4 = await (await fetch(`${BASE_URL}/bookings/hold`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ showId: show.id, seatIds: [avail4[0].id] }),
    })).json();
    const booking4Ref = hold4.data.bookingReference;

    // 4.1 Invalid snack quantity (< 1 or > 20)
    const badQtyRes = await fetch(`${BASE_URL}/bookings/${booking4Ref}/snacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ snackId: popcorn.id, quantity: 999 }] }),
    });
    assert(badQtyRes.status === 400, '1. Backend rejects excessive snack quantity (> 20)');

    // 4.2 Non-existent snack ID
    const badIdRes = await fetch(`${BASE_URL}/bookings/${booking4Ref}/snacks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ snackId: 'non-existent-snack-uuid', quantity: 1 }] }),
    });
    assert(badIdRes.status === 400, '2. Backend rejects non-existent snack product ID');

    // -------------------------------------------------------------
    // SCENARIO 5: SECURITY & IDEMPOTENCY
    // -------------------------------------------------------------
    console.log('\n>>> SCENARIO 5: SECURITY & IDEMPOTENCY <<<');

    // 5.1 Test Idempotency on Confirmed Payment
    const doublePayRes = await fetch(`${BASE_URL}/payments/${retryPay.data.payment.id}/simulate-result`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ outcome: 'SUCCESS' }),
    });
    const doublePayJson = await doublePayRes.json();
    assert(
      doublePayRes.status === 200 && doublePayJson.isIdempotent === true,
      '1. Repeated payment confirmation handled idempotently without duplicating tickets'
    );

    // 5.2 Invalid Ticket Verification
    const fakeTicketRes = await fetch(`${BASE_URL}/tickets/CV3D-FAKE-CODE-999`);
    assert(fakeTicketRes.status === 404, '2. Verification endpoint safely rejects fraudulent ticket codes');

    console.log('\n================================================================');
    console.log(`🎉 ALL PHASE 4 SCENARIOS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================================\n');

  } catch (err) {
    console.error('Test runner failure:', err);
  } finally {
    await prisma.$disconnect();
  }
}

runAllScenarios();
