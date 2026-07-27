'use client'
import React from 'react'
import AdminSideNavbarCom from "@/components/AdminSideNavbarCom";
import Roombookingscom  from "@/components/Roombookingscom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-0 lg:w-[18%] lg:min-w-[280px] lg:max-w-[320px] flex-shrink-0 overflow-visible bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AdminSideNavbarCom />
      </div>

      <div className="flex-1 w-full min-w-0 bg-black overflow-auto">
        <div className="w-full h-full p-4 lg:p-6">
          <Roombookingscom/>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;