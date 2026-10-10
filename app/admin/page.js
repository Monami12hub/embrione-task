"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

const ADMIN_EMAIL = "admin@embrione.pes.edu";
const ADMIN_PASSWORD = "EmbrioneAdmin@2026";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-purple-500";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setLoggedIn(sessionStorage.getItem("embrione_admin") === "yes");
    setReady(true);
  }, []);

  const login = (e) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem("embrione_admin", "yes");
      setLoggedIn(true);
      toast.success("Welcome, admin!");
    } else {
      toast.error("Invalid email or password");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("embrione_admin");
    setLoggedIn(false);
  };

  const load = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setMembers(data);
  };

  useEffect(() => {
    if (loggedIn) load();
  }, [loggedIn]);

  const setStatus = async (id, status) => {
    const { error } = await supabase.from("members").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked as ${status}`);
    load();
  };

  const remove = async (id) => {
    if (!confirm("Delete this profile permanently?")) return;
    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  if (!ready) return null;

  if (!loggedIn) {
    return (
      <form
        onSubmit={login}
        className="mx-auto mt-10 max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} required />
        <button className="w-full rounded-lg bg-purple-600 py-2 font-semibold hover:bg-purple-500">Log in</button>
      </form>
    );
  }

  const pending = members.filter((m) => m.status === "pending");
  const approved = members.filter((m) => m.status === "approved");

  const counter = (label, value) => (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-neutral-400">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Moderation Dashboard</h1>
        <button onClick={logout} className="text-sm text-neutral-400 hover:text-white">Log out</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {counter("Total Submissions", members.length)}
        {counter("Pending", pending.length)}
        {counter("Approved", approved.length)}
      </div>

      <h2 className="text-lg font-semibold">Pending approvals</h2>
      {pending.length === 0 ? (
        <p className="text-neutral-400">Nothing waiting. 🎉</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pending.map((m) => (
            <div key={m.id} className="space-y-3">
              <MemberCard member={m} />
              <div className="flex gap-2">
                <button onClick={() => setStatus(m.id, "approved")} className="flex-1 rounded-lg bg-green-600 py-2 text-sm font-semibold hover:bg-green-500">Approve</button>
                <button onClick={() => setStatus(m.id, "rejected")} className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold hover:bg-red-500">Reject</button>
                <button onClick={() => remove(m.id)} className="rounded-lg border border-white/20 px-3 py-2 text-sm hover:bg-white/10">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}