import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roomsAPI } from "../services/api";
import { RoomCard } from "../components/common/RoomCard";
import { SkeletonCard } from "../components/common";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";

const destinations = [
  {
    name: "Kigali",
    stays: "318 premium stays",
    image: "https://images.unsplash.com/photo-1538970272646-f61fabb3a8a2?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Dubai",
    stays: "1,240 luxury stays",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Paris",
    stays: "982 boutique stays",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Santorini",
    stays: "421 resort stays",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80",
  },
];

const trustStats = [
  ["4.96", "average guest rating"],
  ["31%", "direct booking lift"],
  ["99.9%", "platform uptime"],
];

export default function LandingPage() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    roomsAPI.getAvailable()
      .then(({ data }) => setFeaturedRooms((data.rooms || data).slice(0, 3)))
      .catch(() => setFeaturedRooms([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in bg-[#f7f5f0] text-slate-950">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 scale-[1.03] bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2200&q=85')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,21,38,.92),rgba(8,21,38,.54)_52%,rgba(8,21,38,.14)),linear-gradient(0deg,rgba(8,21,38,.9),transparent_58%)]" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-end px-4 pb-40 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.26em] text-amber-300">Premium room booking management system</p>
            <h1 className="max-w-5xl font-body text-5xl font-black leading-[0.95] tracking-normal sm:text-6xl lg:text-8xl">
              Luxury booking and hotel operations in one elegant SaaS.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/80">
              A conversion-first hospitality platform for hotels, resorts, serviced apartments, and multi-property groups that need trust, speed, and executive-grade visibility.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {["PCI-ready checkout", "Multi-hotel scale", "Real-time inventory"].map((item) => (
                <span key={item} className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-xl">{item}</span>
              ))}
            </div>
          </div>
        </div>

        <form className="absolute bottom-6 left-4 right-4 mx-auto grid max-w-7xl gap-3 rounded-[2rem] border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-2xl md:grid-cols-[1.2fr_repeat(3,1fr)_auto]">
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Destination</span>
            <input className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-amber-400" defaultValue="Kigali, Rwanda" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Check in</span>
            <input type="date" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-amber-400" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Check out</span>
            <input type="date" className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-amber-400" />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Room type</span>
            <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-amber-400">
              <option>Any luxury stay</option>
              {ROOM_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <button type="button" onClick={() => navigate("/rooms")} className="h-12 self-end rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-200 px-7 text-sm font-black text-slate-950 shadow-xl shadow-amber-900/20 transition hover:-translate-y-0.5">
            Search stays
          </button>
        </form>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        {trustStats.map(([value, label]) => (
          <div key={label} className="rounded-[2rem] border border-white/70 bg-white/70 p-7 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
            <p className="font-body text-4xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500">{label}</p>
          </div>
        ))}
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Featured inventory</p>
              <h2 className="max-w-3xl font-body text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl">Premium rooms built for instant confidence.</h2>
            </div>
            <Link to="/rooms" className="font-bold text-slate-700 underline decoration-amber-400 underline-offset-8 hover:text-slate-950">View all rooms</Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(3).fill(0).map((_, index) => <SkeletonCard key={index} />)
              : featuredRooms.length > 0
                ? featuredRooms.map((room) => <RoomCard key={room._id} room={room} />)
                : [
                    { _id: "demo-1", roomNumber: 1204, roomType: "Presidential Suite", pricePerNight: 520, status: "Available" },
                    { _id: "demo-2", roomNumber: 905, roomType: "Executive Room", pricePerNight: 286, status: "Available" },
                    { _id: "demo-3", roomNumber: 311, roomType: "Deluxe", pricePerNight: 245, status: "Available" },
                  ].map((room) => <RoomCard key={room._id} room={room} />)
            }
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Popular destinations</p>
          <h2 className="font-body text-4xl font-black leading-tight text-slate-950 md:text-5xl">City, resort, and business travel experiences that sell themselves.</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {destinations.map((destination) => (
            <article key={destination.name} className="relative flex min-h-64 overflow-hidden rounded-[2rem] p-6 shadow-2xl shadow-slate-900/10">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${destination.image}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="relative mt-auto text-white">
                <h3 className="font-body text-3xl font-black">{destination.name}</h3>
                <p className="text-sm font-bold text-white/75">{destination.stays}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-slate-950 px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl md:p-12">
            <p className="text-2xl font-bold leading-relaxed text-white/90">
              "AuroraStay feels like the rare booking platform that executives, front-desk teams, and guests all enjoy using. We increased direct bookings by 31% in one quarter."
            </p>
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="font-black">Amara Hotels Group</p>
              <p className="text-sm text-white/55">Rated 4.9/5 across 18,000 stays</p>
            </div>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-[#17385f] to-slate-900 p-8 shadow-2xl md:p-12">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-300">Launch offer</p>
            <h2 className="font-body text-4xl font-black leading-tight md:text-5xl">Launch with 0% platform fees for your first 60 days.</h2>
            <form className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input type="email" placeholder="work@email.com" className="h-12 flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none placeholder:text-white/45 focus:border-amber-300" />
              <Link to="/register" className="inline-flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-200 px-6 text-sm font-black text-slate-950">Request demo</Link>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
