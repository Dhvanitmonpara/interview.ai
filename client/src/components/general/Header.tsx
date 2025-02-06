import { UserButton } from "@clerk/clerk-react"
import { Input } from "../ui/input"
import { Link, NavLink } from "react-router-dom"

function Header() {
  return (
    <>
      <nav className="fixed h-16 border-b-2 border-gray-200 px-32 top-0 left-0 w-full flex justify-between items-center p-4">
        <Link to="/">
          <img src="/logo.svg" alt="logo" />
        </Link>
        <ul className="flex gap-4">
          <NavLink to="/" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950" : "text-gray-500"}`)}>Home</NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950" : "text-gray-500"}`)}>Dashboard</NavLink>
          <NavLink to="/about" className={({ isActive }) => (`font-semibold ${isActive ? "text-zinc-950" : "text-gray-500"}`)}>About</NavLink>
        </ul>
        <div className="flex gap-4">
          <Input placeholder="Search" />
          <UserButton />
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  )
}

export default Header