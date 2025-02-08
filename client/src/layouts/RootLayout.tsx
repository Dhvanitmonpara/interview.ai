import Header from "@/components/general/Header"
import { Toaster } from "@/components/ui/toaster"
import { Outlet } from "react-router-dom"

function RootLayout() {
  return (
    <main className="w-screen min-h-screen overflow-y-hidden">
      <Header />
      <Outlet />
      <Toaster />
    </main>
  )
}

export default RootLayout