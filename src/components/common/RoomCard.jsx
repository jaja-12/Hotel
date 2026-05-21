import { Link } from "react-router-dom";

const images = {
  "Presidential Suite": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
  "Executive Room": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
  Deluxe: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=900&q=80",
  default: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
};

export const RoomCard = ({ room }) => {
  const available = room.status === "Available";

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative h-72 overflow-hidden">
        <img src={images[room.roomType] || images.default} alt={`${room.roomType} room`} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black ${available ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
            {room.status}
          </span>
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 backdrop-blur-xl">#{room.roomNumber}</span>
        </div>
        <button className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-amber-700 backdrop-blur-xl">Save</button>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs font-black uppercase tracking-widest text-amber-200">4.9 rating</p>
          <h3 className="mt-1 font-body text-2xl font-black">{room.roomType}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-sm leading-6 text-slate-500">Premium linens, quiet climate control, smart workspace, secure booking, and polished guest arrival flow.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Wi-Fi", "Breakfast", "Pay later"].map((item) => (
            <span key={item} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">{item}</span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-3xl font-black text-slate-950">${room.pricePerNight}</p>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">per night</p>
          </div>
          {available ? (
            <Link to={`/rooms/${room._id}`} className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-amber-300 transition hover:bg-slate-800">View room</Link>
          ) : (
            <button disabled className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-400">Unavailable</button>
          )}
        </div>
      </div>
    </article>
  );
};
