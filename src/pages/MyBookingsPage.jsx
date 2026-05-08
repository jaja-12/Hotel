import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { bookingsAPI } from "../services/api";
import { Badge, Button, EmptyState, Spinner } from "../components/common";
import toast from "react-hot-toast";

const statusVariant = { Pending: "warning", Confirmed: "success", Cancelled: "danger", Completed: "info", Paid: "success" };

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  const load = () => {
    setLoading(true);
    bookingsAPI.getMine()
      .then(({ data }) => setBookings(data.bookings || data))
      .catch(() => toast.error("Failed to load bookings"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    setCancelling(id);
    try {
      await bookingsAPI.cancel(id);
      toast.success("Booking cancelled");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <div className="flex justify-center py-32"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="bg-stone-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-amber-400 text-sm tracking-widest uppercase mb-2">Your Account</p>
          <h1 className="font-display text-4xl">My Bookings</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {bookings.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No bookings yet"
            description="You haven't made any bookings. Explore our rooms and make your first reservation."
            action={<Link to="/rooms" className="bg-stone-900 text-amber-400 font-body text-sm px-5 py-2.5 rounded-sm">Explore Rooms</Link>}
          />
        ) : (
          <div className="space-y-4 animate-fade-in">
            {bookings.map(b => {
              const nights = Math.round((new Date(b.checkOutDate) - new Date(b.checkInDate)) / (1000 * 60 * 60 * 24));
              return (
                <div key={b._id} className="bg-white border border-stone-100 rounded-sm p-6 flex flex-col md:flex-row gap-4 justify-between">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 bg-stone-900 text-amber-400 rounded-sm flex items-center justify-center font-display text-lg flex-shrink-0">
                      🛏
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-body font-medium text-stone-900">
                          {b.room?.roomType ? `${b.room.roomType} Room` : "Room Booking"}
                          {b.room?.roomNumber ? ` #${b.room.roomNumber}` : ""}
                        </h3>
                        <Badge variant={statusVariant[b.paymentStatus] || "default"}>{b.paymentStatus || "Pending"}</Badge>
                      </div>
                      <p className="font-body text-sm text-stone-500">
                        {new Date(b.checkInDate).toLocaleDateString()} → {new Date(b.checkOutDate).toLocaleDateString()} · {nights} night{nights !== 1 ? "s" : ""}
                      </p>
                      <p className="font-mono text-xs text-stone-300 mt-1">ID: {b._id?.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {b.totalAmount && (
                      <p className="font-display text-xl text-stone-900">${b.totalAmount}</p>
                    )}
                    <div className="flex gap-2">
                      {b.paymentStatus === "Pending" && (
                        <>
                          <Link to={`/payment/${b._id}`}>
                            <Button variant="secondary" size="sm">Pay Now</Button>
                          </Link>
                          <Button
                            variant="outline" size="sm"
                            loading={cancelling === b._id}
                            onClick={() => cancel(b._id)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      {b.paymentStatus === "Confirmed" && (
                        <Button variant="outline" size="sm" onClick={() => cancel(b._id)} loading={cancelling === b._id}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
