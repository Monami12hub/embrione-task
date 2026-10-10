export default function MemberCard({ member }) {
  const {
    name, domain, position, srn, branch, semester,
    bio, photo_url, linkedin_url, github_url,
  } = member;

  return (
    <div className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/10">
      <div className="flex items-center gap-4">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name || "Profile"}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-purple-500/50"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800 text-3xl text-neutral-500 ring-2 ring-white/10">
            👤
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold">{name || "Your Name"}</h3>
          <p className="truncate text-sm text-purple-400">{position || "Position"}</p>
          <p className="truncate text-xs text-neutral-400">{domain || "Domain"}</p>
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm text-neutral-300">
        {bio || "Your short bio will appear here..."}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-neutral-400">
        <span className="rounded-full bg-white/10 px-2 py-1">{branch || "Branch"}</span>
        <span className="rounded-full bg-white/10 px-2 py-1">Sem {semester || "-"}</span>
        <span className="truncate rounded-full bg-white/10 px-2 py-1">{srn || "SRN"}</span>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        {linkedin_url && (
          <a href={linkedin_url} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-purple-400">
            LinkedIn
          </a>
        )}
        {github_url && (
          <a href={github_url} target="_blank" rel="noreferrer" className="text-neutral-300 hover:text-purple-400">
            GitHub
          </a>
        )}
      </div>
    </div>
  );
}