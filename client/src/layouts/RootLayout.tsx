import Header from "@/components/general/Header"
import { Outlet } from "react-router-dom"

function RootLayout() {
  return (
    <main className="w-screen min-h-screen overflow-y-hidden">
      <Header />
      <Outlet />
    </main>
  )
}

export default RootLayout