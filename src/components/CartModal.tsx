import React, { useState } from 'react';
import { X, ShoppingBag, Trash2, ShieldCheck, CreditCard, ChevronRight, CheckCircle2, QrCode, DollarSign } from 'lucide-react';
import { CartItem, ShopItem } from '../types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onPaymentSuccess: (details: { paymentMethod: string; orderId: string; ticketId: string; ign: string; totalPaid: number }) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
  onUpdateQuantity,
  onPaymentSuccess
}: CartModalProps) {
  const [ign, setIgn] = useState('');
  const [contact, setContact] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'method' | 'upi_qr' | 'razorpay' | 'paypal' | 'processing' | 'done'>('cart');
  
  // Selected state for UPI checkout
  const [upiRefId, setUpiRefId] = useState('');
  
  // Razorpay selected states
  const [rzpCardName, setRzpCardName] = useState('');
  const [rzpCardNo, setRzpCardNo] = useState('');
  const [rzpLoadingPercentage, setRzpLoadingPercentage] = useState(0);

  // PayPal state
  const [paypalEmail, setPaypalEmail] = useState('');

  // Generated Order Details State
  const [receiptDetails, setReceiptDetails] = useState<{ orderId: string; ticketId: string; methodValue: string } | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);

  // Generate random order codes
  const handleInitiateMethod = (method: 'upi_qr' | 'razorpay' | 'paypal') => {
    if (!ign.trim()) {
      alert('Must fill in your Minecraft IGN first!');
      return;
    }
    setCheckoutStep(method);
    if (method === 'razorpay') {
      setRzpLoadingPercentage(0);
    }
  };

  const handleSimulatePayment = (method: string) => {
    setCheckoutStep('processing');
    
    // Simulate payment loading ticker
    let pct = 0;
    const interval = setInterval(() => {
      pct += 10;
      setRzpLoadingPercentage(pct);
      if (pct >= 100) {
        clearInterval(interval);
        
        const rndOrder = 'EMP-' + Math.floor(100000 + Math.random() * 900000);
        const rndTicket = 'TKT-' + Math.floor(1000 + Math.random() * 9000);

        setReceiptDetails({
          orderId: rndOrder,
          ticketId: rndTicket,
          methodValue: method
        });

        setCheckoutStep('done');
      }
    }, 200);
  };

  const handleCompleteOrder = () => {
    if (receiptDetails) {
      onPaymentSuccess({
        paymentMethod: receiptDetails.methodValue,
        orderId: receiptDetails.orderId,
        ticketId: receiptDetails.ticketId,
        ign: ign,
        totalPaid: subtotal
      });
      // reset forms
      setIgn('');
      setContact('');
      setUpiRefId('');
      setPaypalEmail('');
      setRzpCardName('');
      setRzpCardNo('');
      setCheckoutStep('cart');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"></div>

      {/* Main card box */}
      <div className="relative w-full max-w-lg overflow-y-auto rounded-2xl border border-white/5 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl max-h-[85vh] text-slate-100">
        
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center space-x-2.5">
            <ShoppingBag className="h-5 w-5 text-yellow-400" />
            <h2 className="font-display text-lg font-extrabold text-white uppercase tracking-wide">
              {checkoutStep === 'cart' && 'Your Shopping Cart'}
              {checkoutStep === 'method' && 'Choose Gateway'}
              {checkoutStep === 'upi_qr' && 'UPI Scan & Pay'}
              {checkoutStep === 'razorpay' && 'Razorpay Security Gate'}
              {checkoutStep === 'paypal' && 'PayPal Secure Checkout'}
              {checkoutStep === 'processing' && 'Validating Payment...'}
              {checkoutStep === 'done' && 'Receipt Created!'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEP 1: CART LISTING */}
        {checkoutStep === 'cart' && (
          <div className="mt-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-sans">
                <p className="text-sm">Your cart is empty.</p>
                <button
                  onClick={onClose}
                  className="mt-4 text-xs font-bold text-yellow-400 hover:underline"
                >
                  Go Back to Store &rarr;
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3.5 max-h-[200px] overflow-y-auto pr-1">
                  {cart.map((cartItem) => (
                    <div
                      key={cartItem.item.id}
                      className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-xl border border-white/5"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{cartItem.item.emoji}</span>
                        <div>
                          <h4 className="text-xs font-bold font-sans text-slate-200">
                            {cartItem.item.name}
                          </h4>
                          <span className="text-[10px] text-yellow-400/90 font-mono font-semibold">
                            ₹{cartItem.item.price} each
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3.5">
                        <div className="flex items-center space-x-2 bg-slate-900 border border-white/5 rounded-md px-1 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white font-black"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs font-bold text-slate-200 w-4 text-center">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="px-1.5 py-0.5 text-xs text-slate-400 hover:text-white font-black"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveItem(cartItem.item.id)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded-md hover:bg-slate-950 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear cart row */}
                <div className="flex justify-end pr-1 text-[11px] font-mono">
                  <button onClick={onClearCart} className="text-red-400 hover:underline">
                    Clear Basket List
                  </button>
                </div>

                {/* Username entry */}
                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                      Minecraft Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Dream / RakshXOG"
                      value={ign}
                      onChange={(e) => setIgn(e.target.value)}
                      id="cart_ign_input"
                      className="w-full bg-slate-950 p-3 text-xs font-semibold rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-yellow-500/50"
                      required
                    />
                    <p className="text-[10px] text-slate-400 font-sans tracking-wide mt-1 pl-1">
                      Must match your game IGN exactly for plugins command delivery!
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                      Discord Username or Email
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. pokemon#1234 / email@domain.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full bg-slate-950 p-3 text-xs font-semibold rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-yellow-500/50"
                    />
                  </div>
                </div>

                {/* Checkout pricing sum */}
                <div className="border-t border-white/5 pt-4">
                  <div className="flex justify-between items-baseline mb-4">
                    <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                      Cart Subtotal
                    </span>
                    <span className="font-display text-2xl font-black text-yellow-400">
                      ₹{subtotal}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (!ign.trim()) {
                        alert('Please fill in your Minecraft IGN to pay!');
                        return;
                      }
                      setCheckoutStep('method');
                    }}
                    id="cart_proceed_gateway"
                    className="w-full py-3.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold uppercase tracking-wider text-xs shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Secure Checkout</span>
                    <ChevronRight className="h-4 w-4 stroke-[3]" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: CHOOSE GATEWAY METHOD */}
        {checkoutStep === 'method' && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-400 mb-2 pl-1 leading-normal font-sans">
              Select your preferred integrated processing system. All options execute safe server deliveries.
            </p>

            {/* UPI Option */}
            <button
              onClick={() => handleInitiateMethod('upi_qr')}
              id="gateway_opt_upi"
              className="w-full cursor-pointer flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-white/5 hover:border-yellow-500/35 transition-all text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-yellow-500/5 border border-yellow-500/15 text-yellow-400">
                  <QrCode className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">
                    Direct UPI Scan (Raj)
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans tracking-wide mt-0.5">
                    Scan via GPay/PhonePe instantly. Verified via Receipt ID.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>

            {/* Razorpay Option */}
            <button
              onClick={() => handleInitiateMethod('razorpay')}
              id="gateway_opt_razorpay"
              className="w-full cursor-pointer flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-white/5 hover:border-yellow-500/35 transition-all text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-blue-500/5 border border-blue-500/15 text-blue-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">
                    Razorpay Gateway
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans tracking-wide mt-0.5">
                    Debit/Credit Cards, Netbanking, Net Transactions.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>

            {/* PayPal Option */}
            <button
              onClick={() => handleInitiateMethod('paypal')}
              id="gateway_opt_paypal"
              className="w-full cursor-pointer flex items-center justify-between p-4 bg-slate-950/60 rounded-xl border border-white/5 hover:border-yellow-500/35 transition-all text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-500/5 border border-indigo-500/15 text-indigo-400">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-100 uppercase tracking-widest">
                    PayPal Fast Checkout
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans tracking-wide mt-0.5">
                    International secure checkout & bank card integration.
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </button>

            <button
              onClick={() => setCheckoutStep('cart')}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white font-mono hover:underline"
            >
              Back to shopping cart
            </button>
          </div>
        )}

        {/* STEP 3A: UPI QR SCAN CODES (Matches exact picture details) */}
        {checkoutStep === 'upi_qr' && (
          <div className="mt-4 space-y-4">
            
            {/* Custom UPI Raj Card Container */}
            <div className="mx-auto max-w-sm rounded-2xl bg-white text-slate-900 border border-slate-200 p-6 flex flex-col items-center">
              
              {/* Card top branding */}
              <div className="flex items-center space-x-2 mb-5">
                <div className="h-10 w-10 rounded-full bg-red-600 border border-red-500 flex items-center justify-center text-white font-display font-extrabold text-base select-none">
                  R
                </div>
                <span className="font-display text-[22px] font-extrabold text-slate-800 tracking-wider">
                  Raj
                </span>
              </div>

              {/* LIVE QR Code pointing to Raj UPI schema */}
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=rdraj9871-1@oksbi%26pn=Raj%26cu=INR%26am=${subtotal}`}
                  alt="UPI Raj scan card"
                  className="h-44 w-44 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* UPI identifier */}
              <p className="mt-4 font-mono text-[14px] font-extrabold text-slate-800 tracking-wide select-all">
                UPI ID: rdraj9871-1@oksbi
              </p>

              {/* Scan app detail footer */}
              <p className="mt-2 text-xs font-sans text-slate-500 font-semibold tracking-wide">
                Scan to pay with any UPI app
              </p>

            </div>

            {/* Verification Inputs */}
            <div className="space-y-3.5 bg-slate-950/40 p-4 border border-white/5 rounded-xl">
              <span className="block font-sans text-[11px] font-bold text-yellow-400/90 tracking-wide uppercase">
                Step 2: Submit Proof
              </span>
              <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                Scan on your GPay/PhonePe, complete the amount <span className="text-yellow-400 font-bold">₹{subtotal}</span>, then paste your transaction receipt reference code here. Inside our database, an automated buy-ticket will register to track delivery instantly!
              </p>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest pl-1 mb-1.5">
                  UPI Ref / UTR Transaction ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 129381029312 / UPI-903"
                  value={upiRefId}
                  onChange={(e) => setUpiRefId(e.target.value)}
                  id="upi_ref_id_input"
                  className="w-full bg-slate-950 p-2.5 text-xs font-mono font-bold rounded-md text-slate-200 border border-slate-800 focus:outline-none focus:border-yellow-500/50"
                  required
                />
              </div>

              <button
                onClick={() => {
                  if (!upiRefId.trim()) {
                    alert('Please enter your payment Transaction ID!');
                    return;
                  }
                  handleSimulatePayment('UPI direct transfer to Raj');
                }}
                className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer"
              >
                Submit Payment ID
              </button>
            </div>

            <button
              onClick={() => setCheckoutStep('method')}
              className="w-full py-1 text-xs text-slate-400 hover:text-white font-mono hover:underline"
            >
              Choose other payment method
            </button>
          </div>
        )}

        {/* STEP 3B: MOCK RAZORPAY NATIVE OVERLAY */}
        {checkoutStep === 'razorpay' && (
          <div className="mt-4 space-y-4">
            <div className="border border-blue-500/20 bg-slate-950/80 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5">
                <span className="font-sans text-xs font-extrabold tracking-widest text-blue-400 uppercase">
                  Razorpay Secure Checkouts
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="block text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1 pl-1">
                    Order Holder Name
                  </span>
                  <input
                    type="text"
                    placeholder="Holder Name"
                    value={rzpCardName}
                    onChange={(e) => setRzpCardName(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 p-2 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs font-bold"
                  />
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1 pl-1">
                    Card Number
                  </span>
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={rzpCardNo}
                    onChange={(e) => setRzpCardNo(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 p-2 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs font-mono font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="block text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1 pl-1">
                      Expiry Date
                    </span>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full bg-slate-900 border border-white/5 p-2 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[10px] font-mono uppercase tracking-widest mb-1 pl-1">
                      CVV Code
                    </span>
                    <input
                      type="password"
                      placeholder="***"
                      maxLength={3}
                      className="w-full bg-slate-900 border border-white/5 p-2 rounded text-slate-200 focus:outline-none focus:border-blue-500/50 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] mt-4 pt-1 border-t border-white/5">
                  <span>Transfer Total</span>
                  <span className="font-bold text-white text-sm">₹{subtotal}</span>
                </div>

                <button
                  onClick={() => {
                    if (!rzpCardName.trim() || !rzpCardNo.trim()) {
                      alert('Please complete fields to simulate!');
                      return;
                    }
                    handleSimulatePayment('Razorpay Secure Card Gateway');
                  }}
                  id="rzp_sumbit_btn"
                  className="w-full py-3 rounded bg-blue-600 hover:bg-blue-500 text-white font-extrabold tracking-wider text-xs uppercase cursor-pointer transition-colors shadow-sm mt-2"
                >
                  Pay ₹{subtotal} via Razorpay
                </button>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('method')}
              className="w-full py-1 text-xs text-slate-400 hover:text-white font-mono hover:underline"
            >
              Choose other payment method
            </button>
          </div>
        )}

        {/* STEP 3C: MOCK PAYPAL CHECKOUT */}
        {checkoutStep === 'paypal' && (
          <div className="mt-4 space-y-4">
            <div className="border border-indigo-500/20 bg-slate-950/80 p-5 rounded-2xl">
              <div className="flex items-center space-x-2 pb-3.5 border-b border-white/5 justify-between">
                <span className="font-display font-extrabold text-base text-white">
                  PayPal <span className="text-indigo-400">Checkout</span>
                </span>
                <span className="font-mono text-[9px] bg-indigo-500/10 px-2 py-0.5 rounded text-indigo-400 font-bold uppercase border border-indigo-500/20">
                  sandbox
                </span>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <span className="block text-slate-400 text-[10px] font-mono uppercase tracking-widest pl-1 mb-1">
                    PayPal Registered Email address
                  </span>
                  <input
                    type="email"
                    placeholder="paypal@example.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/5 p-2 rounded text-slate-200 focus:outline-none focus:border-indigo-500/50 text-xs font-bold"
                  />
                </div>

                <div className="flex items-center justify-between text-slate-300 font-mono text-[11px] pt-1">
                  <span>Transfer Total</span>
                  <span className="font-bold text-white text-sm">₹{subtotal}</span>
                </div>

                <p className="text-[10px] text-slate-500 font-sans tracking-wide leading-relaxed pl-1 italic">
                  International currency is automatically converted at active secure processing.
                </p>

                <button
                  onClick={() => {
                    if (!paypalEmail.trim()) {
                      alert('Please provide your Paypal simulated login!');
                      return;
                    }
                    handleSimulatePayment('PayPal International account transfer');
                  }}
                  id="paypal_submit_btn"
                  className="w-full py-3 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold tracking-wider text-xs uppercase cursor-pointer transition-colors shadow-sm mt-1"
                >
                  Pay via PayPal Checkout
                </button>
              </div>
            </div>

            <button
              onClick={() => setCheckoutStep('method')}
              className="w-full py-1 text-xs text-slate-400 hover:text-white font-mono hover:underline"
            >
              Choose other payment method
            </button>
          </div>
        )}

        {/* STEP 4: PROCESSING TRANSACTION TICKER */}
        {checkoutStep === 'processing' && (
          <div className="mt-6 py-8 text-center space-y-5 flex flex-col items-center">
            
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 border border-yellow-500/15">
              <span className="absolute animate-ping inline-flex h-full w-full rounded-full bg-yellow-500/10 opacity-75"></span>
              <span className="text-xl">💳</span>
            </div>

            <div className="space-y-2 max-w-sm">
              <h4 className="font-display text-sm font-extrabold text-white tracking-widest uppercase mb-1">
                Transacting Your Order...
              </h4>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                Contacting server socket. Registering unique deliverable assets on username <span className="text-yellow-400 font-mono font-bold text-xs">{ign}</span>. No-Refresh loop secure.
              </p>
            </div>

            {/* Custom progress loading bar */}
            <div className="w-full max-w-xs h-1 rounded overflow-hidden bg-slate-950">
              <div
                className="h-full bg-yellow-500 transition-all duration-150"
                style={{ width: `${rzpLoadingPercentage}%` }}
              ></div>
            </div>

            <span className="block font-mono text-[10px] font-bold text-slate-500 tracking-widest">
              {rzpLoadingPercentage}% COMPLETE
            </span>

          </div>
        )}

        {/* STEP 5: DONE BILL SUCCESS RECEIPT */}
        {checkoutStep === 'done' && receiptDetails && (
          <div className="mt-4 space-y-5 text-center flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="font-display text-lg font-black text-white uppercase tracking-wider">
                Transaction Received!
              </h3>
              <p className="mt-1 text-xs text-slate-400 font-sans leading-relaxed">
                Thank you for supporting the hosting/development ecosystem of Empire SMP!
              </p>
            </div>

            {/* Receipt Summary Sheet */}
            <div className="w-full bg-slate-950/60 p-4 border border-white/5 rounded-xl space-y-2.5 text-left text-xs font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Minecraft IGN:</span>
                <span className="text-yellow-400 font-bold text-xs">{ign}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Order Reference:</span>
                <span className="text-slate-200 font-bold select-all">{receiptDetails.orderId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Automated Ticket:</span>
                <span className="text-rose-400 font-bold select-all">{receiptDetails.ticketId}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-slate-400">Paid Method:</span>
                <span className="text-slate-200">{receiptDetails.methodValue}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Total Charged:</span>
                <span className="text-white font-extrabold">₹{subtotal}</span>
              </div>
            </div>

            <div className="bg-rose-500/5 p-4 rounded-lg border border-rose-500/10 text-left">
              <span className="block font-mono text-[9px] font-extrabold text-rose-400 uppercase tracking-widest pl-1 mb-1">
                📦 Delivery Dispatch Tactic
              </span>
              <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                To guarantee perfect instant item delivery, an automated, pre-approved buy ticket <span className="text-rose-400 font-mono font-semibold">{receiptDetails.ticketId}</span> has been dispatched in your Support center! You can check or chat with <span className="text-yellow-400 font-bold">Pokemon (Founder)</span> about your dispatch right now on the web page.
              </p>
            </div>

            <button
              onClick={handleCompleteOrder}
              id="checkout_complete_finish"
              className="w-full py-3.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-md mt-1"
            >
              Access Support Ticket
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
