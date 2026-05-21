import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { roomsAPI } from "../services/api";
import { SkeletonCard, EmptyState } from "../components/common";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";

const demoRooms = [
  { _id: "demo-aurora", roomNumber: 1204, roomType: "Presidential Suite", pricePerNight: 520, status: "Available" },
  { _id: "demo-maison", roomNumber: 905, roomType: "Executive Room", pricePerNight: 342, status: "Available" },
  { _id: "demo-bleu", roomNumber: 711, roomType: "Deluxe", pricePerNight: 245, status: "Available" },
  { _id: "demo-terrace", roomNumber: 330, roomType: "Junior Suite", pricePerNight: 390, status: "Maintenance" },
];

const roomImages = [
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
];

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", available: true, maxPrice: "", sort: "recommended" });
  const [wishlist, setWishlist] = useState(["demo-maison"]);

  useEffect(() => {
    roomsAPI.getAll()
      .then(({ data }) => {
        const list = data.rooms || data;
        setRooms(list.length ? list : demoRooms);
      })
      .catch(() => {
        setRooms(demoRooms);
        setError("Live room inventory is unavailable, showing premium demo inventory.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...rooms];
    if (filters.type) result = result.filter((room) => room.roomType === filters.type);
    if (filters.available) result = result.filter((room) => room.status === "Available");
    if (filters.maxPrice) result = result.filter((room) => room.pricePerNight <= Number(filters.maxPrice));
    if (filters.sort === "price-low") result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (filters.sort === "price-high") result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    return result;
  }, [filters, rooms]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const clearFilters = () => setFilters({ type: "", available: true, maxPrice: "", sort: "recommended" });
  const toggleWishlist = (id) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <section className="relative overflow-hidden bg-slate-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(109,168,255,.24),transparent_34%),radial-gradient(circle_at_80%_0%,rgba(201,162,77,.22),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300">Customer booking experience</p>
          <div className="grid gap-8 lg:grid-cols-[1fr_24rem] lg:items-end">
            <div>
              <h1 className="font-body text-5xl font-black leading-tight tracking-normal md:text-7xl">Find the stay that makes conversion effortless.</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">Advanced filtering, comparison cards, live availability, wishlist actions, and a map-first discovery flow.</p>
            </div>
            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur-xl">
              <p className="text-sm font-bold text-white/65">Search results</p>
              <p className="mt-2 font-body text-4xl font-black">{filtered.length} rooms</p>
              <p className="mt-1 text-sm text-white/55">Kigali, June 12-16, 2 adults</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[20rem_1fr] lg:px-8">
        <aside className="h-fit rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-xl lg:sticky lg:top-24">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-body text-xl font-black text-slate-950">Refine stay</h2>
            <button onClick={clearFilters} className="text-sm font-bold text-slate-500 hover:text-slate-950">Reset</button>
          </div>
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Room type</span>
              <select value={filters.type} onChange={(event) => updateFilter("type", event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-amber-400">
                <option value="">All room types</option>
                {ROOM_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Max price</span>
              <input type="number" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} placeholder="Example 400" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-amber-400" />
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700">
              <input type="checkbox" checked={filters.available} onChange={(event) => updateFilter("available", event.target.checked)} className="h-4 w-4 rounded border-slate-300 text-amber-500" />
              Available only
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Sort</span>
              <select value={filters.sort} onChange={(event) => updateFilter("sort", event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-amber-400">
                <option value="recommended">Recommended</option>
                <option value="price-low">Lowest price</option>
                <option value="price-high">Highest price</option>
              </select>
            </label>
          </div>
        </aside>

        <section className="space-y-5">
          <div className="relative min-h-56 overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-900/5">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(109,168,255,.20),rgba(201,162,77,.12)),repeating-linear-gradient(45deg,transparent_0_24px,rgba(8,21,38,.05)_25px_26px)]" />
            <div className="absolute right-[18%] top-[28%] h-5 w-5 rounded-full bg-amber-400 shadow-[0_0_0_12px_rgba(251,191,36,.20)]" />
            <div className="absolute bottom-[24%] right-[44%] h-5 w-5 rounded-full bg-blue-400 shadow-[0_0_0_12px_rgba(96,165,250,.18)]" />
            <div className="absolute left-[30%] top-[45%] h-5 w-5 rounded-full bg-slate-950 shadow-[0_0_0_12px_rgba(15,23,42,.14)]" />
            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Map integration</p>
              <h2 className="mt-3 font-body text-3xl font-black text-slate-950">12 premium hotels near your selected dates.</h2>
              <p className="mt-2 max-w-xl text-sm font-semibold text-slate-500">Pinned rates, room availability, and distance-based discovery for high-intent guests.</p>
            </div>
          </div>

          {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">{error}</div>}

          {loading ? (
            <div className="grid gap-5">
              {Array(4).fill(0).map((_, index) => <SkeletonCard key={index} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon="Hotel"
              title="No rooms found"
              description="Try adjusting your filters or choose a wider price range."
              action={<button onClick={clearFilters} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-amber-300">Clear filters</button>}
            />
          ) : (
            <div className="grid gap-5">
              {filtered.map((room, index) => (
                <article key={room._id} className="grid gap-5 overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl md:grid-cols-[14rem_1fr_auto] md:items-center">
                  <img src={roomImages[index % roomImages.length]} alt={`${room.roomType} room`} className="h-56 w-full rounded-[1.35rem] object-cover md:h-44" />
                  <div>
                    <div className="mb-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-black text-amber-800">4.9 rating</span>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">Instant confirmation</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">Room #{room.roomNumber}</span>
                    </div>
                    <h3 className="font-body text-2xl font-black text-slate-950">{room.roomType}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Executive comfort, refined materials, flexible cancellation, secure payment, availability calendar, and guest-ready booking flow.</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Breakfast", "Pay later", "Gallery", "Calendar open"].map((item) => (
                        <span key={item} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500">{item}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-end">
                    <button onClick={() => toggleWishlist(room._id)} className={`rounded-full border px-4 py-2 text-sm font-black ${wishlist.includes(room._id) ? "border-amber-300 bg-amber-100 text-amber-800" : "border-slate-200 bg-white text-slate-500"}`}>
                      {wishlist.includes(room._id) ? "Saved" : "Save"}
                    </button>
                    <div className="text-right">
                      <p className="font-body text-3xl font-black text-slate-950">${room.pricePerNight}</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">per night</p>
                    </div>
                    <Link to={`/rooms/${room._id}`} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-amber-300 transition hover:bg-slate-800">
                      Reserve
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
