import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingsAPI, paymentsAPI } from "../services/api";
import { Spinner } from "../components/common";

const methods = [
  { value: "card", label: "Credit or debit card", description: "Visa, Mastercard, Amex" },
  { value: "mobile_money", label: "Mobile money", description: "Fast regional authorization" },
  { value: "cash", label: "Cash at check-in", description: "Front desk settlement" },
];

export default function PaymentPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState("card");
  const [paying, setPaying] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    bookingsAPI.getMine()
      .then(({ data }) => {
        const list = data.bookings || data;
        setBooking(list.find((item) => item._id === bookingId) || null);
      })
      .catch(() => toast.error("Could not load booking"))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const nights = useMemo(() => {
    if (!booking?.checkInDate || !booking?.checkOutDate) return 0;
    return Math.max(1, Math.round((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)));
  }, [booking]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await paymentsAPI.make({ bookingId, method });
      setConfirmed(true);
      toast.success("Payment successful. Booking confirmed.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  if (!booking) {
    return (
      <div className="min-h-[70vh] bg-[#f7f5f0] px-4 py-32 text-center">
        <h1 className="font-body text-4xl font-black text-slate-950">Booking not found</h1>
        <button onClick={() => navigate("/my-bookings")} className="mt-5 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-amber-300">View my bookings</button>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#f7f5f0] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/70 bg-white/90 p-8 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-xl md:p-12">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-lg font-black text-white">OK</div>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Booking confirmation</p>
          <h1 className="mt-3 font-body text-5xl font-black leading-tight text-slate-950">Your stay is confirmed.</h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-500">Your reservation has been secured, payment recorded, and the booking receipt is ready in your account.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              ["Booking ID", bookingId.slice(-8).toUpperCase()],
              ["Nights", nights],
              ["Payment", method.replace("_", " ")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-slate-50 p-5">
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="mt-2 font-body text-xl font-black capitalize text-slate-950">{value}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/my-bookings")} className="mt-8 rounded-2xl bg-slate-950 px-7 py-4 text-sm font-black text-amber-300">Open my bookings</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Secure checkout flow</p>
          <h1 className="font-body text-5xl font-black leading-tight tracking-normal text-slate-950 md:text-7xl">Complete your booking.</h1>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1fr_25rem]">
          <section className="space-y-7">
            <article className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <h2 className="font-body text-2xl font-black text-slate-950">Booking timeline</h2>
              <ol className="mt-6 grid gap-4 md:grid-cols-4">
                {[
                  ["Choose room", "Completed", true],
                  ["Guest details", "Verified", true],
                  ["Secure payment", "In progress", true],
                  ["Confirmation", "Next", false],
                ].map(([title, label, active]) => (
                  <li key={title} className={`rounded-3xl border p-5 ${active ? "border-amber-200 bg-amber-50" : "border-slate-100 bg-slate-50"}`}>
                    <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${active ? "bg-amber-400 text-slate-950" : "bg-slate-200 text-slate-500"}`}>{active ? "OK" : "04"}</span>
                    <p className="mt-4 font-black text-slate-950">{title}</p>
                    <p className="text-sm font-semibold text-slate-500">{label}</p>
                  </li>
                ))}
              </ol>
            </article>

            <article className="rounded-[2rem] border border-white/70 bg-white/90 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
              <h2 className="font-body text-2xl font-black text-slate-950">Payment method</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {methods.map((item) => (
                  <label key={item.value} className={`cursor-pointer rounded-3xl border p-5 transition ${method === item.value ? "border-slate-950 bg-slate-950 text-white shadow-xl" : "border-slate-100 bg-white text-slate-700 hover:border-amber-300"}`}>
                    <input type="radio" name="method" value={item.value} checked={method === item.value} onChange={() => setMethod(item.value)} className="sr-only" />
                    <p className="font-black">{item.label}</p>
                    <p className={`mt-2 text-sm ${method === item.value ? "text-white/60" : "text-slate-500"}`}>{item.description}</p>
                  </label>
                ))}
              </div>

              {method === "card" && (
                <div className="mt-7 grid gap-4">
                  <input className="h-13 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" placeholder="Cardholder name" />
                  <input className="h-13 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" placeholder="4242 4242 4242 4242" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className="h-13 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" placeholder="MM / YY" />
                    <input className="h-13 rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" placeholder="CVC" />
                  </div>
                </div>
              )}
            </article>
          </section>

          <aside className="h-fit rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:sticky lg:top-24">
            <h2 className="font-body text-2xl font-black text-slate-950">Stay summary</h2>
            <div className="mt-5 space-y-4 text-sm font-semibold text-slate-600">
              <div className="flex justify-between"><span>Booking ID</span><span className="font-mono">{bookingId.slice(-8).toUpperCase()}</span></div>
              <div className="flex justify-between"><span>Check in</span><span>{new Date(booking.checkInDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Check out</span><span>{new Date(booking.checkOutDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Duration</span><span>{nights} nights</span></div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between font-body text-2xl font-black text-slate-950">
                  <span>Total</span>
                  <span>${booking.totalAmount || 0}</span>
                </div>
              </div>
            </div>
            <button onClick={handlePay} disabled={paying} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-200 px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-amber-900/20 transition hover:-translate-y-0.5 disabled:opacity-60">
              {paying ? "Authorizing..." : "Confirm secure payment"}
            </button>
            <p className="mt-4 text-center text-xs font-semibold text-slate-400">Encrypted payment, audit-ready receipt, and instant booking confirmation.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
