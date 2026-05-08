import { useState, useEffect } from "react";
import { roomsAPI } from "../services/api";
import { RoomCard } from "../components/common/RoomCard";
import { SkeletonCard, EmptyState } from "../components/common";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ type: "", available: false, maxPrice: "" });

  useEffect(() => {
    roomsAPI.getAll()
      .then(({ data }) => {
        const list = data.rooms || data;
        setRooms(list);
        setFiltered(list);
      })
      .catch(() => setError("Failed to load rooms. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = [...rooms];
    if (filters.type) result = result.filter(r => r.roomType === filters.type);
    if (filters.available) result = result.filter(r => r.status === "Available");
    if (filters.maxPrice) result = result.filter(r => r.pricePerNight <= Number(filters.maxPrice));
    setFiltered(result);
  }, [filters, rooms]);

  const handleFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const clearFilters = () => setFilters({ type: "", available: false, maxPrice: "" });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Banner */}
      <div className="bg-stone-900 text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-body text-amber-400 text-sm tracking-widest uppercase mb-2">Discover</p>
          <h1 className="font-display text-4xl md:text-5xl">Our Rooms & Suites</h1>
          <p className="font-body text-stone-400 mt-3 max-w-xl">Every room is designed to make your stay unforgettable — from our cosy singles to our premium suites.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="bg-white border border-stone-100 rounded-sm p-5 mb-8 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block font-body text-xs text-stone-500 mb-1.5 uppercase tracking-wide">Room Type</label>
            <select
              value={filters.type}
              onChange={e => handleFilter("type", e.target.value)}
              className="px-4 py-2.5 border border-stone-200 rounded-sm font-body text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
            >
              <option value="">All types</option>
              {ROOM_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-body text-xs text-stone-500 mb-1.5 uppercase tracking-wide">Max Price/Night</label>
            <input
              type="number" placeholder="e.g. 200"
              value={filters.maxPrice}
              onChange={e => handleFilter("maxPrice", e.target.value)}
              className="px-4 py-2.5 border border-stone-200 rounded-sm font-body text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 w-36"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" checked={filters.available}
              onChange={e => handleFilter("available", e.target.checked)}
              className="rounded"
            />
            <span className="font-body text-sm text-stone-700">Available only</span>
          </label>
          {(filters.type || filters.available || filters.maxPrice) && (
            <button onClick={clearFilters} className="font-body text-sm text-stone-500 hover:text-stone-800 underline">Clear filters</button>
          )}
          <div className="ml-auto font-body text-sm text-stone-400">
            {filtered.length} room{filtered.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 font-body">{error}</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🏨"
            title="No rooms found"
            description="Try adjusting your filters or check back later."
            action={<button onClick={clearFilters} className="bg-stone-900 text-amber-400 font-body text-sm px-5 py-2.5 rounded-sm">Clear Filters</button>}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filtered.map(room => <RoomCard key={room._id} room={room} />)}
          </div>
        )}
      </div>
    </div>
  );
}
