import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roomsAPI } from "../services/api";
import { RoomCard } from "../components/common/RoomCard";
import { SkeletonCard } from "../components/common";
import { BrandLogo } from "../components/common/BrandLogo";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";

export default function LandingPage() {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    roomsAPI.getAvailable()
      .then(({ data }) => setFeaturedRooms((data.rooms || data).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-stone-900">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 25% 50%, #f59e0b 0%, transparent 50%), radial-gradient(circle at 75% 20%, #78716c 0%, transparent 50%)" }}
        />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <p className="font-body text-amber-400 text-sm tracking-[0.3em] uppercase mb-4">Welcome to</p>
                 <h1 className="text-4xl sm:text-5xl font-semibold tracking-wide mb-4">
                         Aurum<span className="text-amber-400">Stay</span>
                 </h1>

            <p className="font-body text-stone-300 text-lg leading-relaxed mb-10 max-w-md">
              Where luxury meets comfort. Every stay is a curated experience designed to make you feel at home.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rooms" className="bg-amber-400 text-stone-900 font-body font-medium px-8 py-3.5 rounded-sm hover:bg-amber-300 transition-colors text-sm">
                Explore Rooms
              </Link>
              <Link to="/register" className="border border-stone-600 text-white font-body text-sm px-8 py-3.5 rounded-sm hover:border-amber-400 hover:text-amber-400 transition-colors">
                Create Account
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 border-t border-stone-800 pt-10">
              {[["500+", "Happy Guests"], ["50+", "Room Types"], ["4.9★", "Rating"]].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-2xl text-amber-400">{n}</p>
                  <p className="font-body text-stone-400 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero card */}
          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-sm p-8">
              <p className="font-body text-amber-400 text-xs tracking-widest uppercase mb-4">Quick Check Availability</p>
              <div className="space-y-4">
                <div>
                  <label className="block font-body text-stone-400 text-xs mb-1.5">Check-in</label>
                  <input type="date" className="w-full bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block font-body text-stone-400 text-xs mb-1.5">Check-out</label>
                  <input type="date" className="w-full bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <div>
                  <label className="block font-body text-stone-400 text-xs mb-1.5">Room Type</label>
                  <select className="w-full bg-white/10 border border-white/20 rounded-sm px-4 py-2.5 text-white font-body text-sm focus:outline-none focus:border-amber-400">
                    <option value="">Any type</option>
                    {ROOM_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <button onClick={() => navigate("/rooms")} className="w-full bg-amber-400 text-stone-900 font-body font-medium py-3 rounded-sm hover:bg-amber-300 transition-colors text-sm mt-2">
                  Search Rooms →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="font-body text-amber-600 text-sm tracking-widest uppercase mb-2">Everything You Need</p>
            <h2 className="font-display text-4xl text-stone-900">World-Class Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["🏊", "Swimming Pool", "Open year-round"],
              ["🍽", "Fine Dining", "Award-winning cuisine"],
              ["💆", "Spa & Wellness", "Daily treatments"],
              ["🔒", "24/7 Security", "Always protected"],
              ["🚗", "Valet Parking", "Complimentary"],
              ["📶", "High-Speed WiFi", "1Gbps throughout"],
              ["🧹", "Daily Housekeeping", "Immaculate service"],
              ["🎰", "Concierge", "At your beck & call"],
            ].map(([icon, title, desc]) => (
              <div key={title} className="text-center p-6 border border-stone-100 rounded-sm hover:border-amber-200 hover:bg-amber-50/50 transition-colors">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-body font-medium text-stone-800 text-sm">{title}</h3>
                <p className="font-body text-stone-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-amber-600 text-sm tracking-widest uppercase mb-2">Our Selection</p>
              <h2 className="font-display text-4xl text-stone-900">Available Rooms</h2>
            </div>
            <Link to="/rooms" className="font-body text-sm text-stone-600 hover:text-stone-900 border-b border-stone-300 pb-0.5">View all →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              : featuredRooms.map(room => <RoomCard key={room._id} room={room} />)
            }
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-stone-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <p className="font-body text-amber-400 text-sm tracking-widest uppercase mb-3">Ready?</p>
          <h2 className="font-display text-4xl mb-5">Book Your Perfect Stay</h2>
          <p className="font-body text-stone-400 mb-10">Join thousands of happy guests who've made AurumStay their home away from home.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/rooms" className="bg-amber-400 text-stone-900 font-body font-medium px-8 py-3.5 rounded-sm hover:bg-amber-300 transition-colors text-sm">Book Now</Link>
            <Link to="/register" className="border border-stone-700 text-white font-body text-sm px-8 py-3.5 rounded-sm hover:border-amber-400 hover:text-amber-400 transition-colors">Register Free</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
