'use client'
import Dashboard from "@/components/dashboard"
import Navbar from "@/components/navbar"

export default function Home() {

  return (
    <div className="py-4 flex w-full justify-center h-screen bg-slate-100">
    <div className="flex flex-col w-full max-w-2xl justify-start items-center h-screen border rounded-lg bg-white">
      <Navbar />
      <Dashboard />
    </div>
    </div>
  )

}
