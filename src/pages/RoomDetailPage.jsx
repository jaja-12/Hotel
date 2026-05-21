import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingsAPI, roomsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/common";

const demoRooms = [
  { _id: "demo-aurora", roomNumber: 1204, roomType: "Presidential Suite", pricePerNight: 520, status: "Available" },
  { _id: "demo-maison", roomNumber: 905, roomType: "Executive Room", pricePerNight: 342, status: "Available" },
  { _id: "demo-bleu", roomNumber: 711, roomType: "Deluxe", pricePerNight: 245, status: "Available" },
];

const gallery = [
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
];

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkIn: "", checkOut: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    roomsAPI.getAll()
      .then(({ data }) => {
        const list = data.rooms || data;
        const found = list.find((item) => item._id === id) || demoRooms.find((item) => item._id === id);
        setRoom(found || null);
      })
      .catch(() => setRoom(demoRooms.find((item) => item._id === id) || demoRooms[0]))
      .finally(() => setLoading(false));
  }, [id]);

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const diff = (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24);
    return Math.max(0, diff);
  }, [booking]);

  const total = room && nights ? room.pricePerNight * nights : 0;

  const handleBook = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (!booking.checkIn || !booking.checkOut || nights <= 0) {
      toast.error("Select valid check-in and check-out dates");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await bookingsAPI.create({ roomId: id, checkIn: booking.checkIn, checkOut: booking.checkOut });
      toast.success("Booking created. Continue to secure payment.");
      navigate(`/payment/${data._id || data.booking?._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  if (!room) {
    return (
      <div className="min-h-[70vh] bg-[#f7f5f0] px-4 py-32 text-center">
        <h1 className="font-body text-4xl font-black text-slate-950">Room not found</h1>
        <Link to="/rooms" className="mt-5 inline-flex rounded-2xl bg-slate-950 px-6 py-3 text-sm font-black text-amber-300">Back to rooms</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
          <Link to="/" className="hover:text-slate-950">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-slate-950">Rooms</Link>
          <span>/</span>
          <span className="text-slate-950">{room.roomType}</span>
        </div>

        <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Image gallery and availability</p>
            <h1 className="font-body text-5xl font-black leading-tight tracking-normal text-slate-950 md:text-7xl">{room.roomType}</h1>
            <p className="mt-3 text-lg font-semibold text-slate-500">Room #{room.roomNumber} at Aurora Grand Kigali</p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 text-right shadow-xl shadow-slate-900/5">
            <p className="font-body text-4xl font-black text-slate-950">${room.pricePerNight}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">per night</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.4fr_.6fr]">
          <img src={gallery[0]} alt={`${room.roomType} hero`} className="h-[28rem] w-full rounded-[2rem] object-cover shadow-2xl shadow-slate-900/10" />
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {gallery.slice(1).map((image) => (
              <img key={image} src={image} alt="Room gallery" className="h-36 w-full rounded-[1.5rem] object-cover shadow-xl shadow-slate-900/5 lg:h-[8.65rem]" />
            ))}
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-7 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
        <section className="space-y-7">
          <article className="rounded-[2rem] border border-white/70 bg-white/85 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["4.97", "guest rating"],
                ["2,184", "verified reviews"],
                ["3 rooms", "left at this rate"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl bg-slate-50 p-5">
                  <p className="font-body text-3xl font-black text-slate-950">{value}</p>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-7 text-lg leading-8 text-slate-600">
              A premium hospitality experience with executive lounge access, soft blue interiors, rainfall shower, blackout comfort, fast Wi-Fi, and flexible checkout built for high-value guests.
            </p>
          </article>

          <article className="rounded-[2rem] border border-white/70 bg-white/85 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <h2 className="font-body text-2xl font-black text-slate-950">Availability calendar</h2>
            <div className="mt-5 grid grid-cols-7 gap-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day} className="text-center text-xs font-black uppercase text-slate-400">{day}</span>)}
              {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((day) => (
                <button key={day} className={`h-12 rounded-2xl border text-sm font-black ${[10, 11, 12].includes(day) ? "border-slate-950 bg-slate-950 text-white" : day === 16 ? "border-slate-200 bg-slate-100 text-slate-300 line-through" : "border-slate-200 bg-white text-slate-700"}`}>
                  {day}
                </button>
              ))}
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/70 bg-white/85 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <h2 className="font-body text-2xl font-black text-slate-950">Premium amenities</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {["Executive lounge", "Airport transfer", "Rainfall shower", "Spa access", "Smart workspace", "Daily housekeeping", "Secure payment", "Flexible cancellation", "Concierge support"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm font-bold text-slate-600">{item}</div>
              ))}
            </div>
          </article>
        </section>

        <aside className="h-fit rounded-[2rem] border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:sticky lg:top-24">
          <h2 className="font-body text-2xl font-black text-slate-950">Reserve this room</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Check in</span>
              <input type="date" value={booking.checkIn} min={new Date().toISOString().split("T")[0]} onChange={(event) => setBooking((current) => ({ ...current, checkIn: event.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-amber-400" />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Check out</span>
              <input type="date" value={booking.checkOut} min={booking.checkIn || new Date().toISOString().split("T")[0]} onChange={(event) => setBooking((current) => ({ ...current, checkOut: event.target.value }))} className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-amber-400" />
            </label>

            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex justify-between text-sm font-semibold text-slate-500">
                <span>${room.pricePerNight} x {nights || 0} nights</span>
                <span>${total}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4 font-body text-xl font-black text-slate-950">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>

            <button onClick={handleBook} disabled={submitting || room.status !== "Available"} className="h-13 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-200 px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-amber-900/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? "Creating booking..." : user ? "Continue to secure checkout" : "Sign in to book"}
            </button>
            <p className="text-center text-xs font-semibold text-slate-400">Encrypted checkout, instant confirmation, and receipt included.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
