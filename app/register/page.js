"use client";
import { useState } from "react";
import MemberCard from "@/components/MemberCard";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { convertToWebp } from "@/lib/convertToWebp";

const DOMAINS = ["Web Development","Design","Logistics","Operations","Sponsorship","Hospitality","Social Media","Event Management"];
const POSITIONS = ["Head","Vice-Head","Core Member","Member"];
const BRANCHES = ["CSE","AIML","ECE","EEE","ME","Biotech","Civil","Other"];
const SEMESTERS = [1,2,3,4,5,6,7,8];

const empty = {
  name: "", domain: "", position: "", srn: "", email: "",
  linkedin_url: "", github_url: "", branch: "", semester: "", bio: "",
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-neutral-900 px-3 py-2 text-sm outline-none focus:border-purple-500";

export default function RegisterPage() {
  const [form, setForm] = useState(empty);
const [file, setFile] = useState(null);
const [previewUrl, setPreviewUrl] = useState("");
const [loading, setLoading] = useState(false);
const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
const onFile = (e) => {
  const f = e.target.files[0];
  if (!f) return;
  if (!["image/png", "image/jpeg"].includes(f.type)) {
    toast.error("Please choose a .png, .jpg or .jpeg image");
    return;
  }
  setFile(f);
  setPreviewUrl(URL.createObjectURL(f)); // local preview only, no upload yet
};
const onSubmit = async (e) => {
  e.preventDefault();
  if (!file) return toast.error("Please upload a profile picture");
  if (form.bio.length < 150 || form.bio.length > 200)
    return toast.error("Bio must be between 150 and 200 characters");

  setLoading(true);
  try {
    const srn = form.srn.trim().toUpperCase();

    // 1. duplicate SRN check
    const { data: existing, error: checkError } = await supabase
      .from("members").select("id").eq("srn", srn).limit(1);
    if (checkError) throw checkError;
    if (existing.length > 0) {
      toast.error("This SRN has already been submitted");
      return;
    }

    // 2. convert to WebP and upload
    const webp = await convertToWebp(file);
    const path = `${srn}-${Date.now()}.webp`;
    const { error: uploadError } = await supabase.storage
      .from("member-photos")
      .upload(path, webp, { contentType: "image/webp" });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("member-photos").getPublicUrl(path);

    // 3. save the row with status pending
    const { error: insertError } = await supabase.from("members").insert({
      ...form,
      srn,
      semester: Number(form.semester),
      photo_url: data.publicUrl,
      status: "pending",
    });
    if (insertError) throw insertError;

    toast.success("Submitted! Your profile is waiting for admin approval.");
    setForm(empty);
    setFile(null);
    setPreviewUrl("");
  } catch (err) {
    toast.error(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
  

  const select = (name, label, options) => (
    <label className="block text-sm">
      <span className="mb-1 block text-neutral-400">{label}</span>
      <select name={name} value={form[name]} onChange={update} required className={inputCls}>
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );

  const text = (name, label, props = {}) => (
    <label className="block text-sm">
      <span className="mb-1 block text-neutral-400">{label}</span>
      <input name={name} value={form[name]} onChange={update} className={inputCls} {...props} />
    </label>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2">
<form onSubmit={onSubmit} className="space-y-4">
        <h1 className="text-2xl font-bold">Join the team</h1>
        {text("name", "Full Name", { required: true })}
        <div className="grid gap-4 sm:grid-cols-2">
          {select("domain", "Domain", DOMAINS)}
          {select("position", "Position", POSITIONS)}
        </div>
        {text("srn", "SRN (e.g. PES1UG23CS001)", { required: true })}
        {text("email", "Email", { required: true, type: "email" })}
        {text("linkedin_url", "LinkedIn URL", { type: "url", placeholder: "https://linkedin.com/in/..." })}
        {text("github_url", "GitHub URL", { type: "url", placeholder: "https://github.com/..." })}
        <div className="grid gap-4 sm:grid-cols-2">
          {select("branch", "Branch", BRANCHES)}
          {select("semester", "Semester", SEMESTERS)}
        </div>

        <label className="block text-sm">
          <span className="mb-1 block text-neutral-400">
            Short Bio ({form.bio.length}/200, minimum 150)
          </span>
          <textarea name="bio" value={form.bio} onChange={update} maxLength={200} rows={4} required className={inputCls} />
        </label>
                <label className="block text-sm">
          <span className="mb-1 block text-neutral-400">Profile Picture (PNG / JPG)</span>
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={onFile}
            className="w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-purple-600 file:px-3 file:py-2 file:text-white"
          />
        </label>
                <button
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 py-3 font-semibold transition hover:bg-purple-500 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for approval"}
        </button>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 text-sm text-neutral-400">Live preview</p>
        <MemberCard member={{ ...form, photo_url: previewUrl }} />
      </div>
    </div>
  );
}