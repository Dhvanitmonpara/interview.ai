import { useAuth, UserButton } from "@clerk/clerk-react"
import { Link, NavLink } from "react-router-dom"
import ThemeToggler from "./ThemeToggler"
import { Loader } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
];

function Header() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader className="w-5 h-5 animate-spin" />
  }

  return (
    <>
      <nav className="fixed h-16 z-50 bg-zinc-100 dark:bg-zinc-900 border-b-2 border-gray-200 dark:border-gray-800 px-32 top-0 left-0 w-full flex justify-between items-center p-4">
        <Link to="/">
          <img className="h-14 w-14" src="/Logo.png" alt="logo" />
        </Link>
        <ul className="flex gap-4">
          {navLinks.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-500 dark:text-zinc-600"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>
        <div className="flex gap-4">
          <ThemeToggler />
          <UserButton />
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  )
}

export default Header