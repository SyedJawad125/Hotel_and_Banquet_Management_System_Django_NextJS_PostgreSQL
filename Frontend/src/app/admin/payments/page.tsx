// 'use client'
// import React from 'react'
// import AdminSideNavbarCom from "@/components/AdminSideNavbarCom";
// import PaymentsCom from "@/components/PaymentsCom";

// const AdminDashboard = () => {
//   return (
//     <div className="flex h-screen w-full overflow-hidden">
//       {/* Sidebar - Fixed percentage width with constraints */}
//       <div className="w-[18%] min-w-[280px] max-w-[320px] flex-shrink-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
//         <AdminSideNavbarCom />
//       </div>
      
//       {/* Main Content - Takes remaining space */}
//       <div className="flex-1 w-[82%] bg-black overflow-auto -ml-6 mr" >
//         <div className="w-full h-full p-6">
//           <PaymentsCom />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AdminDashboard;





'use client'
import React from 'react'
import AdminSideNavbarCom from "@/components/AdminSideNavbarCom";
import PaymentsCom from "@/components/PaymentsCom";

const AdminDashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="w-0 lg:w-[18%] lg:min-w-[280px] lg:max-w-[320px] flex-shrink-0 overflow-visible bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <AdminSideNavbarCom />
      </div>

      <div className="flex-1 w-full min-w-0 bg-black overflow-auto">
        <div className="w-full h-full p-4 lg:p-6">
          <PaymentsCom />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;