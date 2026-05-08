import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { roomsAPI, bookingsAPI, usersAPI, paymentsAPI } from "../services/api";
import { Button, Badge, Modal, Input, Select, PageHeader, Spinner } from "../components/common";
import { ROOM_TYPE_OPTIONS } from "../constants/roomTypes";
import toast from "react-hot-toast";

const statusVariant = { Pending: "warning", Confirmed: "success", Cancelled: "danger", Completed: "info", Paid: "success" };

// ─── ADMIN LAYOUT ────────────────────────────────────────────────────────────
const tabs = ["Overview", "Rooms", "Bookings", "Users", "Payments"];

export default function AdminDashboard() {
  const [active, setActive] = useState("Overview");
  const [stats, setStats] = useState({ rooms: 0, bookings: 0, users: 0, payments: 0 });

  useEffect(() => {
    Promise.allSettled([
      roomsAPI.getAll(),
      bookingsAPI.getAll(),
      usersAPI.getAll(),
      paymentsAPI.getAll(),
    ]).then(([r, b, u, p]) => {
      setStats({
        rooms: (r.value?.data?.rooms || r.value?.data || []).length,
        bookings: (b.value?.data?.bookings || b.value?.data || []).length,
        users: (u.value?.data?.users || u.value?.data || []).length,
        payments: (p.value?.data?.payments || p.value?.data || []).length,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <div className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <p className="font-body text-amber-400 text-xs tracking-widest uppercase mb-1">Management Console</p>
            <h1 className="font-display text-3xl">Admin Dashboard</h1>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`font-body text-sm px-5 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  active === t ? "border-amber-400 text-amber-400" : "border-transparent text-stone-400 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {active === "Overview" && <OverviewTab stats={stats} onNavigate={setActive} />}
        {active === "Rooms" && <RoomsTab />}
        {active === "Bookings" && <BookingsTab />}
        {active === "Users" && <UsersTab />}
        {active === "Payments" && <PaymentsTab />}
      </div>
    </div>
  );
}

// ─── OVERVIEW ────────────────────────────────────────────────────────────────
function OverviewTab({ stats, onNavigate }) {
  const cards = [
    { label: "Total Rooms", value: stats.rooms, icon: "🏨", tab: "Rooms" },
    { label: "Total Bookings", value: stats.bookings, icon: "📅", tab: "Bookings" },
    { label: "Registered Users", value: stats.users, icon: "👥", tab: "Users" },
    { label: "Payments", value: stats.payments, icon: "💳", tab: "Payments" },
  ];
  return (
    <div className="animate-fade-in">
      <PageHeader title="Overview" subtitle="Your hotel at a glance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(c => (
          <button key={c.label} onClick={() => onNavigate(c.tab)} className="bg-white border border-stone-100 rounded-sm p-6 text-left hover:border-amber-200 hover:shadow transition-all">
            <div className="text-3xl mb-3">{c.icon}</div>
            <p className="font-display text-3xl text-stone-900">{c.value}</p>
            <p className="font-body text-sm text-stone-500 mt-1">{c.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ROOMS ────────────────────────────────────────────────────────────────────
function RoomsTab() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ roomNumber: "", roomType: "Standard Room", pricePerNight: "", status: "Available" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    roomsAPI.getAll().then(({ data }) => setRooms(data.rooms || data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm({ roomNumber: "", roomType: "Standard Room", pricePerNight: "", status: "Available" }); setModal(true); };
  const openEdit = (r) => { setEditing(r); setForm({ roomNumber: r.roomNumber, roomType: r.roomType, pricePerNight: r.pricePerNight, status: r.status }); setModal(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) await roomsAPI.update(editing._id, form);
      else await roomsAPI.create(form);
      toast.success(editing ? "Room updated" : "Room created");
      setModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Rooms" subtitle={`${rooms.length} total rooms`} action={<Button onClick={openCreate} variant="secondary">+ Add Room</Button>} />
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>{["Room #", "Type", "Price/Night", "Status", "Actions"].map(h => <th key={h} className="text-left px-5 py-3.5 text-stone-500 text-xs uppercase tracking-wide font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {rooms.map(r => (
              <tr key={r._id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-4 font-medium text-stone-800">#{r.roomNumber}</td>
                <td className="px-5 py-4 text-stone-600">{r.roomType}</td>
                <td className="px-5 py-4 font-display text-stone-800">${r.pricePerNight}</td>
                <td className="px-5 py-4"><Badge variant={r.status === "Available" ? "success" : "danger"}>{r.status}</Badge></td>
                <td className="px-5 py-4">
                  <button onClick={() => openEdit(r)} className="text-amber-600 hover:text-amber-700 text-xs font-medium mr-3">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Room" : "Add Room"}>
        <div className="space-y-4">
          <Input label="Room Number" type="number" value={form.roomNumber} onChange={e => setForm(p => ({ ...p, roomNumber: e.target.value }))} />
          <Select label="Type" value={form.roomType} onChange={e => setForm(p => ({ ...p, roomType: e.target.value }))} options={ROOM_TYPE_OPTIONS} />
          <Input label="Price Per Night ($)" type="number" value={form.pricePerNight} onChange={e => setForm(p => ({ ...p, pricePerNight: e.target.value }))} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.status === "Available"} onChange={e => setForm(p => ({ ...p, status: e.target.checked ? "Available" : "Booked" }))} />
            <span className="font-body text-sm text-stone-700">Available for booking</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={save} loading={saving} variant="primary">{editing ? "Update" : "Create"}</Button>
            <Button onClick={() => setModal(false)} variant="outline">Cancel</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
function BookingsTab() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingsAPI.getAll().then(({ data }) => setBookings(data.bookings || data)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await bookingsAPI.updateStatus(id, { paymentStatus: status });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, paymentStatus: status } : b));
      toast.success("Status updated");
    } catch { toast.error("Failed to update"); }
  };

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="All Bookings" subtitle={`${bookings.length} bookings`} />
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>{["Booking ID", "Guest", "Room", "Check-in", "Check-out", "Status", "Update"].map(h => <th key={h} className="text-left px-5 py-3.5 text-stone-500 text-xs uppercase tracking-wide font-medium whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {bookings.map(b => (
                <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-stone-400">{b._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4 text-stone-700">{b.user?.name || b.user?.email || "—"}</td>
                  <td className="px-5 py-4 text-stone-600">#{b.room?.roomNumber || "—"}</td>
                  <td className="px-5 py-4 text-stone-600">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-stone-600">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-5 py-4"><Badge variant={statusVariant[b.paymentStatus] || "default"}>{b.paymentStatus || "Pending"}</Badge></td>
                  <td className="px-5 py-4">
                    <select
                      value={b.paymentStatus} onChange={e => updateStatus(b._id, e.target.value)}
                      className="text-xs border border-stone-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      {["Pending", "Confirmed", "Completed", "Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── USERS ────────────────────────────────────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getAll().then(({ data }) => setUsers(data.users || data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-20" />;

  return (
    <div className="animate-fade-in">
      <PageHeader title="Users" subtitle={`${users.length} registered users`} />
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>{["Name", "Email", "Role", "Joined"].map(h => <th key={h} className="text-left px-5 py-3.5 text-stone-500 text-xs uppercase tracking-wide font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-stone-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-xs uppercase">{u.fullname?.[0] || u.email?.[0]}</div>
                    <span className="font-medium text-stone-800">{u.fullname || "—"}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-stone-600">{u.email}</td>
                <td className="px-5 py-4"><Badge variant={u.role === "Admin" ? "warning" : "default"}>{u.role || "Guest"}</Badge></td>
                <td className="px-5 py-4 text-stone-400">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PAYMENTS ────────────────────────────────────────────────────────────────
function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentsAPI.getAll().then(({ data }) => setPayments(data.payments || data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="py-20" />;

  const total = payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} transactions · $${total.toLocaleString()} total`}
      />
      <div className="bg-white border border-stone-100 rounded-sm overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>{["Payment ID", "Booking ID", "Method", "Amount", "Date"].map(h => <th key={h} className="text-left px-5 py-3.5 text-stone-500 text-xs uppercase tracking-wide font-medium">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {payments.map(p => (
              <tr key={p._id} className="hover:bg-stone-50">
                <td className="px-5 py-4 font-mono text-xs text-stone-400">{p._id?.slice(-8).toUpperCase()}</td>
                <td className="px-5 py-4 font-mono text-xs text-stone-400">{p.bookingId?._id?.slice?.(-8)?.toUpperCase() || p.bookingId?.slice?.(-8)?.toUpperCase() || "—"}</td>
                <td className="px-5 py-4 capitalize"><Badge>{p.method || "—"}</Badge></td>
                <td className="px-5 py-4 font-display text-stone-800">{p.amountPaid ? `$${p.amountPaid}` : "—"}</td>
                <td className="px-5 py-4 text-stone-400">{p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
