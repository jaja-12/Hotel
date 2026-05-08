import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { paymentsAPI, bookingsAPI } from "../services/api";
import { Button, Spinner } from "../components/common";
import toast from "react-hot-toast";

const methods = [
  { value: "card", label: "Credit / Debit Card", icon: "💳" },
  { value: "mobile_money", label: "Mobile Money", icon: "📱" },
  { value: "cash", label: "Cash at Check-in", icon: "💵" },
];

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("card");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    bookingsAPI.getMine()
      .then(({ data }) => {
        const list = data.bookings || data;
        const b = list.find(b => b._id === bookingId);
        setBooking(b || null);
      })
      .catch(() => toast.error("Could not load booking"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await paymentsAPI.make({ bookingId, method });
      toast.success("Payment successful! Enjoy your stay 🎉");
      navigate("/my-bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!booking) return (
    <div className="text-center py-32 font-body text-stone-600">
      <p className="text-2xl mb-2">Booking not found</p>
      <button onClick={() => navigate("/my-bookings")} className="text-amber-600 hover:underline text-sm">← My Bookings</button>
    </div>
  );

  const nights = Math.round((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <span className="text-4xl">💳</span>
          <h1 className="font-display text-3xl text-stone-900 mt-3">Complete Payment</h1>
          <p className="font-body text-stone-500 text-sm mt-1">Secure checkout for your booking</p>
        </div>

        {/* Booking summary */}
        <div className="bg-white border border-stone-100 rounded-sm p-6 mb-6">
          <h2 className="font-body font-medium text-stone-800 text-sm uppercase tracking-wide mb-4">Booking Summary</h2>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Booking ID</span>
              <span className="font-mono text-xs text-stone-400">{bookingId.slice(-8).toUpperCase()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Check-in</span>
              <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Check-out</span>
              <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Duration</span>
              <span>{nights} night{nights !== 1 ? "s" : ""}</span>
            </div>
            <hr className="border-stone-100 my-2" />
            <div className="flex justify-between font-medium text-stone-900">
              <span>Total Amount</span>
              <span className="font-display text-lg">${booking.totalAmount || "—"}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white border border-stone-100 rounded-sm p-6 mb-6">
          <h2 className="font-body font-medium text-stone-800 text-sm uppercase tracking-wide mb-4">Payment Method</h2>
          <div className="space-y-3">
            {methods.map(m => (
              <label key={m.value} className={`flex items-center gap-4 p-4 border rounded-sm cursor-pointer transition-colors ${method === m.value ? "border-stone-900 bg-stone-50" : "border-stone-100 hover:border-stone-300"}`}>
                <input type="radio" name="method" value={m.value} checked={method === m.value} onChange={() => setMethod(m.value)} className="sr-only" />
                <span className="text-2xl">{m.icon}</span>
                <span className="font-body text-sm text-stone-700">{m.label}</span>
                {method === m.value && <span className="ml-auto text-stone-900">✓</span>}
              </label>
            ))}
          </div>
        </div>

        {/* Security note */}
        <div className="flex items-center gap-2 mb-6 text-stone-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="font-body text-xs">Payments are encrypted and secure</p>
        </div>

        <Button fullWidth size="lg" onClick={handlePay} loading={paying} variant="secondary">
          Confirm Payment
        </Button>
        <button onClick={() => navigate("/my-bookings")} className="w-full mt-3 text-center font-body text-sm text-stone-400 hover:text-stone-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
