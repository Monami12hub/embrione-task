"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

const DOMAINS = ["Web Development","Design","Logistics","Operations","Sponsorship","Hospitality","Social Media","Event Management"];
const POSITIONS = ["Head","Vice-Head","Core Member","Member"];

const selectCls =
  "rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-purple-500";

export default function TeamPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState("");
  const [position, setPosition] = useState("");

  useEffect(() => {
    supabase
      .from("members")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMembers(data || []);
        setLoading(false);
      });
  }, []);

  const shown = members.filter(
    (m) => (!domain || m.domain === domain) && (!position || m.position === position)
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur">
  <h1 className="text-4xl font-extrabold sm:text-5xl">
    Meet The <span className="text-purple-400">Team</span>
  </h1>
  <p className="mt-2 text-neutral-300">The people behind The Embrione.</p>
</div>

      <div className="flex flex-wrap gap-3">
        <select value={domain} onChange={(e) => setDomain(e.target.value)} className={selectCls}>
          <option value="">All Domains</option>
          {DOMAINS.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select value={position} onChange={(e) => setPosition(e.target.value)} className={selectCls}>
          <option value="">All Positions</option>
          {POSITIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>

      {loading ? (
        <p className="text-neutral-400">Loading...</p>
      ) : shown.length === 0 ? (
        <p className="text-neutral-400">No members found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((m) => <MemberCard key={m.id} member={m} />)}
        </div>
      )}
    </div>
  );
}