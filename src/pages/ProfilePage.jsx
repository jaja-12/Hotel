import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usersAPI } from "../services/api";
import { Button, Input, PageHeader } from "../components/common";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: user?.name || user?.fullname || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await usersAPI.updateMe(form);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-xl mx-auto px-4">
        <PageHeader title="My Profile" subtitle="Manage your account details" />
        <div className="bg-white border border-stone-100 rounded-sm p-8">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-stone-100">
            <div className="w-16 h-16 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center font-display text-2xl uppercase">
              {user?.name?.[0] || user?.email?.[0]}
            </div>
            <div>
              <p className="font-display text-xl text-stone-900">{user?.name || user?.fullname}</p>
              <p className="font-body text-sm text-stone-500">{user?.email}</p>
              <span className="inline-block mt-1 text-xs font-body bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{user?.role || "guest"}</span>
            </div>
          </div>
          <div className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="Email Address" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <Button onClick={handleSave} loading={saving} className="mt-6">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
