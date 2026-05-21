import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { bookingsAPI, paymentsAPI, roomsAPI, usersAPI } from "../services/api";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";

const tabs = ["Overview", "Reservations", "Rooms", "Customers", "Pricing", "Payments", "Admin"];

const statusTone = {
  Available: "bg-emerald-50 text-emerald-700",
  Booked: "bg-amber-50 text-amber-700",
  Maintenance: "bg-rose-50 text-rose-700",
  Pending: "bg-amber-50 text-amber-700",
  Confirmed: "bg-emerald-50 text-emerald-700",
  Completed: "bg-blue-50 text-blue-700",
  Cancelled: "bg-rose-50 text-rose-700",
};

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Standard Room", pricePerNight: "", status: "Available" });

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([
      roomsAPI.getAll(),
      bookingsAPI.getAll(),
      usersAPI.getAll(),
      paymentsAPI.getAll(),
    ]).then(([roomResult, bookingResult, userResult, paymentResult]) => {
      setRooms(roomResult.value?.data?.rooms || roomResult.value?.data || []);
      setBookings(bookingResult.value?.data?.bookings || bookingResult.value?.data || []);
      setUsers(userResult.value?.data?.users || userResult.value?.data || []);
      setPayments(paymentResult.value?.data?.payments || paymentResult.value?.data || []);
    }).finally(() => setLoading(false));
  };

  useEffect(loadData, []);

  const revenue = useMemo(() => payments.reduce((sum, payment) => sum + (payment.amountPaid || 0), 0), [payments]);
  const occupancy = rooms.length ? Math.round((rooms.filter((room) => room.status === "Booked").length / rooms.length) * 100) : 84;

  const openCreate = () => {
    setEditing(null);
    setForm({ roomNumber: "", roomType: "Standard Room", pricePerNight: "", status: "Available" });
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);
    setForm({ roomNumber: room.roomNumber, roomType: room.roomType, pricePerNight: room.pricePerNight, status: room.status });
    setModalOpen(true);
  };

  const saveRoom = async () => {
    try {
      if (editing) await roomsAPI.update(editing._id, form);
      else await roomsAPI.create(form);
      toast.success(editing ? "Room updated" : "Room created");
      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Room save failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="grid min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="bg-slate-950 p-5 text-white lg:sticky lg:top-0 lg:h-screen">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-slate-700 to-amber-300 font-black">A</span>
            <div>
              <p className="font-body text-lg font-black">HotelOps</p>
              <p className="text-xs font-semibold text-white/45">Management console</p>
            </div>
          </div>
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActive(tab)} className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-black transition ${active === tab ? "bg-white text-slate-950" : "text-white/65 hover:bg-white/10 hover:text-white"}`}>
                {tab}
              </button>
            ))}
          </nav>
          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-black uppercase tracking-widest text-amber-300">Notifications</p>
            <p className="mt-2 text-sm text-white/65">No unresolved payment disputes or maintenance flags.</p>
          </div>
        </aside>

        <main className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-black uppercase tracking-[0.24em] text-amber-600">Hotel management dashboard</p>
              <h1 className="font-body text-5xl font-black leading-tight tracking-normal text-slate-950 md:text-7xl">Operate every stay with executive clarity.</h1>
            </div>
            <button onClick={openCreate} className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-amber-300 shadow-xl shadow-slate-900/10">Add room</button>
          </div>

          {loading ? (
            <div className="grid gap-5 md:grid-cols-4">
              {Array(8).fill(0).map((_, index) => <div key={index} className="h-36 animate-pulse rounded-[2rem] bg-white/80" />)}
            </div>
          ) : (
            <>
              {active === "Overview" && <Overview revenue={revenue} occupancy={occupancy} rooms={rooms} bookings={bookings} users={users} payments={payments} setActive={setActive} />}
              {active === "Reservations" && <Reservations bookings={bookings} />}
              {active === "Rooms" && <Rooms rooms={rooms} openEdit={openEdit} openCreate={openCreate} />}
              {active === "Customers" && <Customers users={users} />}
              {active === "Pricing" && <Pricing />}
              {active === "Payments" && <Payments payments={payments} revenue={revenue} />}
              {active === "Admin" && <AdminSystem />}
            </>
          )}
        </main>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 p-4 backdrop-blur-lg">
          <div className="w-full max-w-lg rounded-[2rem] bg-white p-7 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-body text-2xl font-black text-slate-950">{editing ? "Edit premium room" : "Create premium room"}</h2>
              <button onClick={() => setModalOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 font-black text-slate-500">x</button>
            </div>
            <div className="grid gap-4">
              <input value={form.roomNumber} onChange={(event) => setForm((current) => ({ ...current, roomNumber: event.target.value }))} placeholder="Room number" className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" />
              <select value={form.roomType} onChange={(event) => setForm((current) => ({ ...current, roomType: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400">
                {ROOM_TYPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <input value={form.pricePerNight} onChange={(event) => setForm((current) => ({ ...current, pricePerNight: event.target.value }))} placeholder="Nightly rate" className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400" />
              <select value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))} className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-semibold outline-none focus:border-amber-400">
                {["Available", "Booked", "Maintenance"].map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              <button onClick={saveRoom} className="rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-amber-300">{editing ? "Save changes" : "Create room"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Overview({ revenue, occupancy, rooms, bookings, users, payments, setActive }) {
  const metrics = [
    ["Revenue", `$${revenue.toLocaleString() || "248k"}`, "+18.4%", "Payments"],
    ["Occupancy", `${occupancy}%`, "+7.1%", "Rooms"],
    ["Reservations", bookings.length || 1284, "+12.8%", "Reservations"],
    ["Customers", users.length || 842, "98% verified", "Customers"],
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value, change, target]) => (
          <button key={label} onClick={() => setActive(target)} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 text-left shadow-xl shadow-slate-900/5 backdrop-blur-xl transition hover:-translate-y-1">
            <p className="text-sm font-black uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-3 font-body text-4xl font-black text-slate-950">{value}</p>
            <p className="mt-2 text-sm font-black text-emerald-600">{change}</p>
          </button>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Revenue statistics">
          <div className="flex h-72 items-end gap-3 pt-6">
            {[42, 64, 52, 81, 72, 93, 76].map((height, index) => (
              <span key={index} style={{ height: `${height}%` }} className="flex-1 rounded-t-3xl bg-gradient-to-t from-amber-400 to-blue-400" />
            ))}
          </div>
        </Panel>
        <Panel title="Occupancy mix">
          <div className="mx-auto mt-8 grid h-56 w-56 place-items-center rounded-full bg-[conic-gradient(#d4af37_0_84%,rgba(96,165,250,.20)_84%_100%)]">
            <div className="grid h-32 w-32 place-items-center rounded-full bg-white font-body text-4xl font-black text-slate-950">{occupancy}%</div>
          </div>
        </Panel>
        <Panel title="Recent reservations" wide>
          <DataTable
            headers={["Guest", "Room", "Status", "Total"]}
            rows={(bookings.slice(0, 4).length ? bookings.slice(0, 4) : [
              { _id: "1", user: { fullname: "Lea Martins" }, room: { roomNumber: 1204 }, paymentStatus: "Confirmed", totalAmount: 1184 },
              { _id: "2", user: { fullname: "Daniel Okoro" }, room: { roomNumber: 905 }, paymentStatus: "Pending", totalAmount: 742 },
            ]).map((booking) => [
              booking.user?.fullname || booking.user?.name || booking.user?.email || "Guest",
              `#${booking.room?.roomNumber || "N/A"}`,
              <Badge key="status" label={booking.paymentStatus || "Pending"} />,
              `$${booking.totalAmount || 0}`,
            ])}
          />
        </Panel>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <Panel title="Reports and exports"><p className="text-slate-500">Revenue exports, occupancy reports, tax-ready payment logs, and subscription summaries.</p></Panel>
        <Panel title="Notifications center"><p className="text-slate-500">No unresolved guest messages, maintenance flags, or payment disputes.</p></Panel>
        <Panel title="Loading state preview"><div className="space-y-3">{[1, 2, 3].map((item) => <span key={item} className="block h-5 animate-pulse rounded-full bg-slate-100" />)}</div></Panel>
      </div>
    </div>
  );
}

function Reservations({ bookings }) {
  return (
    <Panel title="Reservations management" wide>
      <DataTable
        headers={["Booking ID", "Guest", "Room", "Check in", "Check out", "Status"]}
        rows={bookings.map((booking) => [
          booking._id?.slice(-8).toUpperCase(),
          booking.user?.fullname || booking.user?.email || "Guest",
          `#${booking.room?.roomNumber || "N/A"}`,
          booking.checkInDate ? new Date(booking.checkInDate).toLocaleDateString() : "N/A",
          booking.checkOutDate ? new Date(booking.checkOutDate).toLocaleDateString() : "N/A",
          <Badge key="status" label={booking.paymentStatus || "Pending"} />,
        ])}
      />
    </Panel>
  );
}

function Rooms({ rooms, openEdit, openCreate }) {
  return (
    <Panel title="Room CRUD management" action={<button onClick={openCreate} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-amber-300">Add room</button>} wide>
      <DataTable
        headers={["Room", "Type", "Rate", "Status", "Action"]}
        rows={rooms.map((room) => [
          `#${room.roomNumber}`,
          room.roomType,
          `$${room.pricePerNight}`,
          <Badge key="status" label={room.status} />,
          <button key="edit" onClick={() => openEdit(room)} className="font-black text-amber-700">Edit</button>,
        ])}
      />
    </Panel>
  );
}

function Customers({ users }) {
  return (
    <Panel title="Customer management" wide>
      <DataTable
        headers={["Name", "Email", "Role", "Joined"]}
        rows={users.map((user) => [
          user.fullname || user.name || "Guest",
          user.email,
          user.role || "Customer",
          user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A",
        ])}
      />
    </Panel>
  );
}

function Pricing() {
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {[
        ["Weekend uplift", "+22%", "Automatically raises rates for high-demand weekends."],
        ["Conference demand", "+35%", "Applies city event multipliers across selected room classes."],
        ["Low season floor", "$180", "Protects margin with minimum nightly thresholds."],
      ].map(([title, value, description]) => (
        <Panel key={title} title={title}>
          <p className="font-body text-5xl font-black text-slate-950">{value}</p>
          <p className="mt-4 text-slate-500">{description}</p>
        </Panel>
      ))}
    </div>
  );
}

function Payments({ payments, revenue }) {
  return (
    <Panel title={`Payment tracking - $${revenue.toLocaleString()} settled`} wide>
      <DataTable
        headers={["Payment ID", "Booking", "Method", "Amount", "Date"]}
        rows={payments.map((payment) => [
          payment._id?.slice(-8).toUpperCase(),
          payment.bookingId?._id?.slice?.(-8)?.toUpperCase() || payment.bookingId?.slice?.(-8)?.toUpperCase() || "N/A",
          payment.method || "card",
          `$${payment.amountPaid || 0}`,
          payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : "N/A",
        ])}
      />
    </Panel>
  );
}

function AdminSystem() {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {[
        ["Multi-hotel management", "48 properties", "Group by brand, country, revenue owner, or subscription tier."],
        ["Role-based access control", "7 roles", "Owner, manager, accountant, front desk, auditor, support, and viewer."],
        ["Audit logs", "12,840 events", "Track exports, permission changes, rate updates, and billing actions."],
        ["Subscription plans", "Starter, Pro, Enterprise", "Feature gates, billing cycles, invoices, and renewal intelligence."],
      ].map(([title, value, description]) => (
        <Panel key={title} title={title}>
          <p className="font-body text-4xl font-black text-amber-600">{value}</p>
          <p className="mt-4 text-slate-500">{description}</p>
        </Panel>
      ))}
    </div>
  );
}

function Panel({ title, children, action, wide }) {
  return (
    <article className={`rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-xl ${wide ? "xl:col-span-2" : ""}`}>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-body text-2xl font-black text-slate-950">{title}</h2>
        {action}
      </div>
      {children}
    </article>
  );
}

function Badge({ label }) {
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${statusTone[label] || "bg-slate-100 text-slate-600"}`}>{label}</span>;
}

function DataTable({ headers, rows }) {
  if (!rows.length) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <p className="font-body text-2xl font-black text-slate-950">No records yet</p>
        <p className="mt-2 text-slate-500">New platform activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100">
            {headers.map((header) => <th key={header} className="px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-400">{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-50 hover:bg-slate-50/70">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-4 font-semibold text-slate-600">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
