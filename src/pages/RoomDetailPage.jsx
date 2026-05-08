import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { roomsAPI, bookingsAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Button, Badge, Spinner } from "../components/common";
import { ROOM_TYPE_ICONS } from "../constants/roomTypes";
import toast from "react-hot-toast";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ checkIn: "", checkOut: "" });
  const [submitting, setSubmitting] = useState(false);
  const [nights, setNights] = useState(0);

  useEffect(() => {
    roomsAPI.getAll()
      .then(({ data }) => {
        const list = data.rooms || data;
        const found = list.find(r => r._id === id);
        setRoom(found || null);
      })
      .catch(() => toast.error("Could not load room details"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (booking.checkIn && booking.checkOut) {
      const diff = (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24);
      setNights(Math.max(0, diff));
    }
  }, [booking]);

  const handleBook = async () => {
    if (!user) { navigate("/login"); return; }
    if (!booking.checkIn || !booking.checkOut) { toast.error("Please select check-in and check-out dates"); return; }
    if (nights <= 0) { toast.error("Check-out must be after check-in"); return; }
    setSubmitting(true);
    try {
      const { data } = await bookingsAPI.create({ roomId: id, checkIn: booking.checkIn, checkOut: booking.checkOut });
      toast.success("Booking created! Proceeding to payment…");
      navigate(`/payment/${data._id || data.booking?._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;
  if (!room) return (
    <div className="text-center py-32">
      <p className="font-display text-2xl text-stone-700 mb-4">Room not found</p>
      <Link to="/rooms" className="font-body text-amber-600 hover:underline">← Back to rooms</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 font-body text-sm text-stone-400 mb-8">
          <Link to="/" className="hover:text-stone-700">Home</Link>
          <span>/</span>
          <Link to="/rooms" className="hover:text-stone-700">Rooms</Link>
          <span>/</span>
          <span className="text-stone-700">Room {room.roomNumber}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Room info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <img src="../assets/room1.avif" alt={`Room ${room.roomNumber}`} className="w-full h-80 object-cover rounded-sm shadow-sm" />
            <div className="h-80 bg-gradient-to-br from-stone-200 to-stone-300 rounded-sm overflow-hidden relative flex items-center justify-center">
              <span className="text-9xl opacity-20">{ROOM_TYPE_ICONS[room.roomType] || "🏨"}</span>
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant={room.status === "Available" ? "success" : "danger"}>
                  {room.status === "Available" ? "Available" : room.status}
                </Badge>
                <span className="bg-white/90 text-stone-700 text-xs font-body px-2.5 py-1 rounded-full">#{room.roomNumber}</span>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white border border-stone-100 rounded-sm p-7">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-display text-3xl text-stone-900">{room.roomType}</h1>
                  <p className="font-body text-stone-500 mt-1">Room #{room.roomNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-3xl text-stone-900">${room.pricePerNight}</p>
                  <p className="font-body text-xs text-stone-400">per night</p>
                </div>
              </div>

              <hr className="border-stone-100 my-5" />

              <h3 className="font-body font-medium text-stone-800 mb-3 text-sm uppercase tracking-wide">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {["Free Wi-Fi", "Air Conditioning", "Flat-screen TV", "Mini Bar", "Room Service", "Safe", "Hair Dryer", "Premium Toiletries", "Daily Housekeeping"].map(a => (
                  <div key={a} className="flex items-center gap-2 font-body text-sm text-stone-600">
                    <span className="text-amber-500">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-stone-100 rounded-sm p-6 sticky top-24 shadow-sm">
              <h2 className="font-display text-xl text-stone-900 mb-5">Book This Room</h2>

              {room.status === "Available" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block font-body text-xs text-stone-500 mb-1.5 uppercase tracking-wide">Check-in Date</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={booking.checkIn}
                      onChange={e => setBooking(p => ({ ...p, checkIn: e.target.value }))}
                      className="w-full border border-stone-200 rounded-sm px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-xs text-stone-500 mb-1.5 uppercase tracking-wide">Check-out Date</label>
                    <input
                      type="date"
                      min={booking.checkIn || new Date().toISOString().split("T")[0]}
                      value={booking.checkOut}
                      onChange={e => setBooking(p => ({ ...p, checkOut: e.target.value }))}
                      className="w-full border border-stone-200 rounded-sm px-4 py-2.5 font-body text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>

                  {nights > 0 && (
                    <div className="bg-stone-50 border border-stone-100 rounded-sm p-4 space-y-2">
                      <div className="flex justify-between font-body text-sm text-stone-600">
                        <span>${room.pricePerNight} × {nights} night{nights !== 1 ? "s" : ""}</span>
                        <span>${room.pricePerNight * nights}</span>
                      </div>
                      <hr className="border-stone-200" />
                      <div className="flex justify-between font-body font-medium text-stone-900">
                        <span>Total</span>
                        <span>${room.pricePerNight * nights}</span>
                      </div>
                    </div>
                  )}

                  <Button fullWidth onClick={handleBook} loading={submitting} variant="primary" size="lg">
                    {user ? "Book Now" : "Sign In to Book"}
                  </Button>

                  {!user && (
                    <p className="font-body text-xs text-stone-400 text-center">
                      <Link to="/login" className="text-amber-600 hover:underline">Login</Link> or{" "}
                      <Link to="/register" className="text-amber-600 hover:underline">register</Link> to book
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">🚫</p>
                  <p className="font-body text-stone-600 text-sm">This room is currently not available.</p>
                  <Link to="/rooms" className="mt-4 inline-block font-body text-sm text-amber-600 hover:underline">View other rooms →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
