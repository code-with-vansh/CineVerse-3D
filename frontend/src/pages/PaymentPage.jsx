import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import bookingService from '../services/bookingService';
import paymentService from '../services/paymentService';
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ShieldCheck, 
  Timer, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft,
  Lock,
  QrCode,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';

export const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingRef = searchParams.get('bookingRef');

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [holdTimer, setHoldTimer] = useState(300);
  const [activeMethod, setActiveMethod] = useState('UPI'); // UPI, CARD, WALLET

  // UPI Form state
  const [upiId, setUpiId] = useState('user@okaxis');

  // Card Form state
  const [cardName, setCardName] = useState('Demo Moviegoer');
  const [cardNumber, setCardNumber] = useState('4532 8821 9934 1120');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Wallet Form state
  const [selectedWallet, setSelectedWallet] = useState('cineverse_vip');

  // Simulation state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [failureModalOpen, setFailureModalOpen] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Fetch Booking Summary
  useEffect(() => {
    if (!bookingRef) {
      navigate('/');
      return;
    }

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await bookingService.getBookingSummary(bookingRef);
        if (!data?.booking) throw new Error('Booking not found.');

        setBooking(data.booking);
        setHoldTimer(data.remainingHoldSeconds || 300);

        if (!data.isHoldActive && data.booking.status === 'PENDING') {
          setErrorMessage('Seat reservation hold has expired. Please reselect your seats.');
        }
      } catch (err) {
        setErrorMessage(err.message || 'Failed to load booking for payment.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [bookingRef, navigate]);

  // Hold Timer Countdown
  useEffect(() => {
    if (!holdTimer || holdTimer <= 0) return;

    const interval = setInterval(() => {
      setHoldTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setErrorMessage('Your 5-minute seat reservation has expired.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [holdTimer]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Simulate Payment Handler
  const handleSimulatePayment = async (outcome = 'SUCCESS') => {
    if (holdTimer <= 0) {
      setErrorMessage('Your seat hold has expired. No payment can be processed.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Step 1: Initiate Payment Record on Backend
      setProcessingStep('1/3 Contacting simulated banking network...');
      const initData = await paymentService.initiatePayment({
        bookingReference: bookingRef,
        paymentMethod: activeMethod,
      });

      const paymentId = initData.data?.payment?.id;
      if (!paymentId) throw new Error('Failed to initialize demo payment.');

      // Step 2: Simulate Delay & Processing
      await new Promise((r) => setTimeout(r, 900));
      setProcessingStep('2/3 Validating PostgreSQL seat locks atomically...');
      await new Promise((r) => setTimeout(r, 800));

      // Step 3: Trigger Payment Result Simulation
      setProcessingStep('3/3 Finalizing transaction & issuing digital ticket...');
      const result = await paymentService.simulatePaymentResult(paymentId, outcome, activeMethod);

      if (outcome === 'SUCCESS' && result.success) {
        const ticketCode = result.ticketCode || result.booking?.ticketCode;
        navigate(`/ticket/${ticketCode}?success=true`);
      } else {
        // Simulated failure
        setFailureModalOpen(true);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment simulation encountered an error.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleAutofillCard = (brand) => {
    if (brand === 'visa') {
      setCardNumber('4532 8821 9934 1120');
      setCardExpiry('12/28');
      setCardCvv('789');
    } else if (brand === 'mastercard') {
      setCardNumber('5424 1800 2341 9921');
      setCardExpiry('08/29');
      setCardCvv('456');
    } else {
      setCardNumber('6071 5200 4410 8832');
      setCardExpiry('10/27');
      setCardCvv('123');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07080d] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-sm font-semibold text-zinc-400">Loading simulated payment terminal...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-[#06070a] text-white pt-24 pb-24 selection:bg-red-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top Breadcrumb & Demo Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800/80 mb-6">
          <div>
            <button
              onClick={() => navigate(`/checkout?bookingRef=${bookingRef}`)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white mb-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Checkout Review</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
              <span>Simulated Payment Terminal</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-widest font-extrabold">
                Sandbox Mode
              </span>
            </h1>
          </div>

          {/* Seat Hold Status */}
          <div className="flex items-center gap-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl px-4 py-2.5 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Timer className={`w-4 h-4 ${holdTimer < 60 ? 'text-red-500 animate-pulse' : 'text-amber-400'}`} />
              <span className="text-xs text-zinc-300 font-semibold">Seat Hold:</span>
            </div>
            <span className={`font-mono text-sm font-black ${holdTimer < 60 ? 'text-red-400' : 'text-amber-400'}`}>
              {formatTimer(holdTimer)}
            </span>
          </div>
        </div>

        {/* Prominent Demo Notice Banner */}
        <div className="p-4 rounded-3xl bg-amber-950/30 border-2 border-amber-500/50 mb-8 flex items-start gap-3 shadow-xl">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-extrabold text-amber-300 tracking-wide uppercase text-sm">
              DEMO PAYMENT — NO REAL MONEY WILL BE CHARGED
            </p>
            <p className="text-zinc-300 mt-1 leading-relaxed">
              This application is configured for academic and portfolio demonstration. Test both successful confirmation and failure recovery flows using the simulated actions below.
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/80 border border-red-500/60 text-white flex items-center justify-between text-xs font-semibold shadow-xl">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            {holdTimer <= 0 && (
              <button
                onClick={() => navigate('/cinema-hall')}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
              >
                Reselect Seats
              </button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Payment Method Tabs & Inputs (7 Cols) */}
          <div className="md:col-span-7 bg-[#0d1019] border border-zinc-800/80 rounded-3xl p-6 shadow-2xl">
            {/* Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-zinc-900/80 rounded-2xl border border-zinc-800 mb-6">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: Smartphone },
                { id: 'CARD', label: 'Debit/Credit', icon: CreditCard },
                { id: 'WALLET', label: 'Wallets', icon: Wallet },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveMethod(id)}
                  className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMethod === id
                      ? 'bg-red-600 text-white shadow-lg'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: UPI PAYMENT */}
            {activeMethod === 'UPI' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Demo Virtual Payment Address (VPA / UPI ID)
                  </label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. yourname@okaxis"
                    className="w-full px-4 py-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 focus:border-red-500 text-sm font-mono text-white outline-none transition-colors"
                  />
                </div>

                {/* Quick Presets */}
                <div>
                  <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
                    Quick Demo UPI IDs:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['user@okaxis', 'demo@okhdfcbank', 'student@cineverse', 'paytm@upi'].map((vpa) => (
                      <button
                        key={vpa}
                        type="button"
                        onClick={() => setUpiId(vpa)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                          upiId === vpa
                            ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
                        }`}
                      >
                        {vpa}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated QR Code box */}
                <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white p-1 shrink-0 flex items-center justify-center">
                    <QrCode className="w-14 h-14 text-black" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white">Simulated Dynamic BharatQR</p>
                    <p className="text-zinc-400 text-[11px] mt-0.5">
                      Amount locked to ₹{booking.grandTotal.toFixed(2)} for instant verification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CARD PAYMENT */}
            {activeMethod === 'CARD' && (
              <div className="space-y-4 animate-in fade-in duration-300">
                {/* Autofill presets */}
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                  <span className="text-zinc-400">Autofill Test Card:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAutofillCard('visa')}
                      className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-sky-400"
                    >
                      Visa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutofillCard('mastercard')}
                      className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-amber-400"
                    >
                      Mastercard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAutofillCard('rupay')}
                      className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-emerald-400"
                    >
                      RuPay
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1">
                    Card Number (Demo)
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      Expiry (MM/YY)
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1">
                      CVV / CVC (Dummy)
                    </label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs font-mono text-white outline-none"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-zinc-500 italic">
                  * CVV and card numbers are never sent to external servers or persisted in the database.
                </p>
              </div>
            )}

            {/* TAB 3: WALLET PAYMENT */}
            {activeMethod === 'WALLET' && (
              <div className="space-y-3 animate-in fade-in duration-300">
                {[
                  { id: 'cineverse_vip', name: 'CineVerse VIP Credits', balance: '₹2,500.00 (Demo Balance)', badge: 'Recommended' },
                  { id: 'amazon_pay', name: 'Amazon Pay Balance', balance: '₹1,200.00' },
                  { id: 'phonepe', name: 'PhonePe Wallet', balance: '₹850.00' },
                  { id: 'paytm', name: 'Paytm Wallet', balance: '₹600.00' },
                ].map((wallet) => (
                  <label
                    key={wallet.id}
                    onClick={() => setSelectedWallet(wallet.id)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      selectedWallet === wallet.id
                        ? 'bg-red-950/30 border-red-500/60 shadow-md'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedWallet === wallet.id ? 'border-red-500 bg-red-600' : 'border-zinc-600'
                      }`}>
                        {selectedWallet === wallet.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{wallet.name}</span>
                        <span className="text-[11px] text-zinc-400">{wallet.balance}</span>
                      </div>
                    </div>
                    {wallet.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                        {wallet.badge}
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Amount Payable & Dual Simulation Actions (5 Cols) */}
          <div className="md:col-span-5 space-y-5">
            <div className="p-6 rounded-3xl bg-[#0d1019] border border-zinc-800/80 shadow-2xl">
              <span className="text-xs uppercase font-extrabold tracking-wider text-zinc-400 block mb-1">
                Amount Payable
              </span>
              <div className="font-mono text-3xl font-black text-amber-400 mb-4">
                ₹{booking.grandTotal.toFixed(2)}
              </div>

              {/* Order Recap */}
              <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 mb-6">
                <div className="flex justify-between text-zinc-400">
                  <span>Movie:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{booking.show?.movie?.title}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Seats:</span>
                  <span className="font-bold text-white">
                    {booking.bookingSeats?.map(bs => `${bs.seat?.row}${bs.seat?.seatNumber}`).join(', ')}
                  </span>
                </div>
                {booking.bookingSnacks?.length > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Snacks:</span>
                    <span className="font-bold text-white">{booking.bookingSnacks.length} items</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span>Reference:</span>
                  <span className="font-mono font-bold text-red-400 text-[11px]">{booking.bookingReference}</span>
                </div>
              </div>

              {/* ACTION 1: SIMULATE SUCCESS */}
              <button
                onClick={() => handleSimulatePayment('SUCCESS')}
                disabled={isProcessing || holdTimer <= 0}
                className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/40 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Payment SUCCESS</span>
                  </>
                )}
              </button>

              {/* ACTION 2: SIMULATE FAILURE (For Testing Requirement) */}
              <button
                onClick={() => handleSimulatePayment('FAILED')}
                disabled={isProcessing || holdTimer <= 0}
                className="mt-3 w-full py-3 px-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-red-900/60 text-red-400 hover:text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Simulate Payment FAILURE (Test Recovery)</span>
              </button>

              <div className="mt-4 pt-3 border-t border-zinc-800 text-center text-[10px] text-zinc-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-emerald-500" />
                <span>Transactional atomic booking lock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Processing Modal Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0d1019] border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Simulating Transaction</h3>
              <p className="text-xs text-zinc-400 font-mono mb-4">
                {processingStep || 'Communicating with simulated bank...'}
              </p>
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-red-600 to-amber-500 h-full w-2/3 animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Failure Outcome Modal */}
        {failureModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="w-full max-w-md bg-[#0e111a] border border-red-800/80 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/40">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Simulated Payment Declined</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                The simulated transaction was intentionally rejected by the demo issuer. Your seat reservation remains safely locked for <span className="font-mono text-amber-400 font-bold">{formatTimer(holdTimer)}</span>.
              </p>

              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 mb-6 text-left">
                <div className="flex justify-between pb-1.5 border-b border-zinc-800">
                  <span className="text-zinc-400">Simulation Status:</span>
                  <span className="font-bold text-red-400">FAILED (TEST ONLY)</span>
                </div>
                <div className="flex justify-between pt-1.5">
                  <span className="text-zinc-400">Booking Status:</span>
                  <span className="font-bold text-amber-400">PENDING (Hold Preserved)</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFailureModalOpen(false)}
                  className="w-1/2 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition-colors"
                >
                  Change Method
                </button>
                <button
                  onClick={() => {
                    setFailureModalOpen(false);
                    handleSimulatePayment('SUCCESS');
                  }}
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg transition-all"
                >
                  Retry with Success
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
