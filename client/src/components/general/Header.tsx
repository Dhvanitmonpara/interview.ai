import { UserButton } from "@clerk/clerk-react"
import { Input } from "../ui/input"
import { Link, NavLink } from "react-router-dom"
import ThemeToggler from "./ThemeToggler"

function Header() {
  return (
    <>
      <nav className="fixed h-16 border-b-2 border-gray-200 dark:border-gray-800 px-32 top-0 left-0 w-full flex justify-between items-center p-4">
        <Link to="/">
          <img className="h-14 w-14" src="/Logo.png" alt="logo" />
        </Link>
        <ul className="flex gap-4">
          <NavLink to="/" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-500 dark:text-zinc-600"}`)}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-500 dark:text-zinc-600"}`)}>Dashboard</NavLink>
          <NavLink to="/about" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950 dark:text-zinc-100" : "text-gray-500 dark:text-zinc-600"}`)}>About</NavLink>
        </ul>
        <div className="flex gap-4">
          <Input placeholder="Search" />
          <ThemeToggler />
          <UserButton />
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  )
}

export default Header