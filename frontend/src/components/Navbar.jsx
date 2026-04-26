import { Link, useLocation } from "react-router-dom";

const links = [
  { path: "/",       label: "Dashboard" },
  { path: "/log",    label: "Log cycle" },
  { path: "/chat",   label: "Luna AI" },
  { path: "/report", label: "Report" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="border-b border-purple-900/40 px-6 py-4 flex items-center gap-8">
      <span className="text-xl font-semibold tracking-wide text-purple-300">
        Lunara
      </span>
      <div className="flex gap-6 text-sm">
        {links.map(l => (
          <Link key={l.path} to={l.path}
            className={pathname === l.path
              ? "text-teal-400 font-medium"
              : "text-purple-200/60 hover:text-purple-200 transition"}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}