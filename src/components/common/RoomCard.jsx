import { Link } from "react-router-dom";
import { Badge } from "../common";
import { ROOM_TYPE_ICONS } from "../../constants/roomTypes";

export const RoomCard = ({ room }) => (
  <div className="group bg-white border border-stone-100 rounded-sm overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
    {/* Image placeholder */}
    <div className="h-52 bg-gradient-to-br from-stone-100 to-stone-200 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl opacity-20">{ROOM_TYPE_ICONS[room.roomType] || "🏨"}</span>
      </div>
      <div className="absolute top-3 left-3">
        <Badge variant={room.status === "Available" ? "success" : "danger"}>
          {room.status === "Available" ? "Available" : room.status}
        </Badge>
      </div>
      <div className="absolute top-3 right-3">
        <span className="bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-body font-medium px-2.5 py-1 rounded-full">
          #{room.roomNumber}
        </span>
      </div>
    </div>

    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg text-stone-900">{room.roomType}</h3>
          <p className="font-body text-sm text-stone-500">Room {room.roomNumber}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-stone-900">${room.pricePerNight}</p>
          <p className="font-body text-xs text-stone-400">per night</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["Wi-Fi", "AC", "TV"].map(f => (
          <span key={f} className="text-xs font-body text-stone-500 bg-stone-50 px-2 py-1 rounded">✓ {f}</span>
        ))}
      </div>

      {room.status === "Available" ? (
        <Link
          to={`/rooms/${room._id}`}
          className="block w-full text-center bg-stone-900 text-amber-400 font-body text-sm py-2.5 rounded-sm hover:bg-stone-800 transition-colors"
        >
          View & Book
        </Link>
      ) : (
        <button disabled className="w-full bg-stone-100 text-stone-400 font-body text-sm py-2.5 rounded-sm cursor-not-allowed">
          Not Available
        </button>
      )}
    </div>
  </div>
);
