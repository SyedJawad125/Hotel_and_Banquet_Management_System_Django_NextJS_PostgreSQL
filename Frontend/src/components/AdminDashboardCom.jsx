// 'use client';
// import React, { useEffect, useState, useContext } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Calendar, Users, DoorOpen, DollarSign, TrendingUp,
//   Clock, CheckCircle, XCircle, AlertCircle, MapPin,
//   CreditCard, Building2, CalendarDays, ArrowUpRight, ArrowDownRight,
// } from 'lucide-react';

// /* ── Design tokens — Gulf Hotel gold-on-ivory ───────────────────────── */
// const gold = '#C6A43F';
// const goldDeep = '#9C7F2C';
// const ink = '#26231D';
// const ivory = '#FBF9F4';
// const line = 'rgba(198,164,63,0.22)';
// const lineSoft = 'rgba(198,164,63,0.12)';
// const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

// const displayFont = "'Cormorant Garamond', serif";
// const bodyFont = "'DM Sans', sans-serif";

// const AdminDashboardCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalBookings: 0,
//     totalRevenue: 0,
//     totalHalls: 0,
//     occupiedHalls: 0,
//     availableHalls: 0,
//     totalCustomers: 0,
//     totalPayments: 0,
//     pendingBookings: 0,
//     confirmedBookings: 0,
//     cancelledBookings: 0,
//   });
//   const [recentBookings, setRecentBookings] = useState([]);
//   const [hallOccupancy, setHallOccupancy] = useState([]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch bookings
//       const bookingsRes = await AxiosInstance.get('/api/hotel/v1/booking/', { params: { limit: 100 } });
//       const bookings = bookingsRes?.data?.data || bookingsRes?.data?.data?.data || [];

//       // Fetch halls
//       const hallsRes = await AxiosInstance.get('/api/hotel/v1/hall/', { params: { limit: 100 } });
//       const halls = hallsRes?.data?.data || hallsRes?.data?.data?.data || [];

//       // Fetch payments
//       const paymentsRes = await AxiosInstance.get('/api/hotel/v1/payment/', { params: { limit: 100 } });
//       const payments = paymentsRes?.data?.data || paymentsRes?.data?.data?.data || [];

//       // Calculate stats
//       const totalBookings = bookings.length;
//       const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total || 0), 0);
//       const totalHalls = halls.length;
//       const occupiedHalls = halls.filter(h => h.occupied).length;
//       const availableHalls = totalHalls - occupiedHalls;
//       const totalCustomers = new Set(bookings.map(b => b.customer)).size;
//       const totalPayments = payments.length;
//       const pendingBookings = bookings.filter(b => b.status === 'pending').length;
//       const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
//       const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

//       setStats({
//         totalBookings,
//         totalRevenue,
//         totalHalls,
//         occupiedHalls,
//         availableHalls,
//         totalCustomers,
//         totalPayments,
//         pendingBookings,
//         confirmedBookings,
//         cancelledBookings,
//       });

//       // Recent bookings (last 5)
//       setRecentBookings(bookings.slice(0, 5));

//       // Hall occupancy data
//       setHallOccupancy(halls.map(h => ({
//         name: h.name_en,
//         occupied: h.occupied,
//         occupiedDates: h.occupied_dates,
//         bookingCount: h.booking_count || 0,
//       })));

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Error loading dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       confirmed: { color: '#3D7A45', bg: '#EAF4EA', icon: CheckCircle, label: 'Confirmed' },
//       pending: { color: '#B8860B', bg: '#FEF7E6', icon: Clock, label: 'Pending' },
//       cancelled: { color: '#B23B3B', bg: '#FBEAEA', icon: XCircle, label: 'Cancelled' },
//     };
//     return configs[status] || configs.pending;
//   };

//   const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
//     <div style={{
//       background: '#FFFFFF',
//       border: `1px solid ${line}`,
//       borderRadius: 16,
//       padding: '20px 24px',
//       boxShadow: shadowCard,
//       transition: 'all 0.2s',
//     }}>
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//           <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
//             {title}
//           </span>
//         </div>
//         <div style={{
//           width: 40, height: 40, borderRadius: 10,
//           background: color ? `${color}15` : `${gold}15`,
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//         }}>
//           <Icon size={20} color={color || gold} />
//         </div>
//       </div>
//       <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
//         <div style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: ink }}>
//           {typeof value === 'number' ? value.toLocaleString() : value}
//         </div>
//         {trend && (
//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 4,
//             fontSize: 12, fontWeight: 600,
//             color: trendUp ? '#3D7A45' : '#B23B3B',
//           }}>
//             {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
//             {trend}
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div style={{ width: '100%', minHeight: '100vh', background: '#F6F3EC', fontFamily: bodyFont, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//           <div style={{
//             width: 48, height: 48, border: `3px solid ${line}`, borderTopColor: gold,
//             borderRadius: '50%', animation: 'spin 0.8s linear infinite',
//           }} />
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//           <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 14 }}>Loading dashboard…</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
//       <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

//       <div style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px 60px' }}>

//         {/* Header */}
//         <div style={{ marginBottom: 36 }}>
//           <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
//             Overview
//           </div>
//           <h1 style={{ fontFamily: displayFont, fontSize: 42, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//             Hotel Management Dashboard
//           </h1>
//           <p style={{ color: '#A39C8A', fontSize: 14, marginTop: 8 }}>
//             Real-time insights into your hotel operations
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 32 }}>
//           <StatCard
//             title="Total Bookings"
//             value={stats.totalBookings}
//             icon={Calendar}
//             color="#3B82F6"
//             trend="+12%"
//             trendUp={true}
//           />
//           <StatCard
//             title="Total Revenue"
//             value={`SAR ${stats.totalRevenue.toLocaleString()}`}
//             icon={DollarSign}
//             color="#3D7A45"
//             trend="+18%"
//             trendUp={true}
//           />
//           <StatCard
//             title="Total Halls"
//             value={stats.totalHalls}
//             icon={DoorOpen}
//             color={gold}
//           />
//           <StatCard
//             title="Occupied Halls"
//             value={stats.occupiedHalls}
//             icon={MapPin}
//             color="#B23B3B"
//           />
//           <StatCard
//             title="Available Halls"
//             value={stats.availableHalls}
//             icon={CheckCircle}
//             color="#3D7A45"
//           />
//           <StatCard
//             title="Total Customers"
//             value={stats.totalCustomers}
//             icon={Users}
//             color="#8B5CF6"
//           />
//           <StatCard
//             title="Total Payments"
//             value={stats.totalPayments}
//             icon={CreditCard}
//             color="#06B6D4"
//           />
//           <StatCard
//             title="Pending Bookings"
//             value={stats.pendingBookings}
//             icon={Clock}
//             color="#B8860B"
//           />
//         </div>

//         {/* Booking Status Overview */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//             padding: 24, boxShadow: shadowCard,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
//               <div style={{
//                 width: 44, height: 44, borderRadius: 12,
//                 background: '#EAF4EA', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <CheckCircle size={22} color="#3D7A45" />
//               </div>
//               <div>
//                 <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
//                   Confirmed
//                 </div>
//                 <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#3D7A45' }}>
//                   {stats.confirmedBookings}
//                 </div>
//               </div>
//             </div>
//             <div style={{ height: 8, background: '#EAF4EA', borderRadius: 4, overflow: 'hidden' }}>
//               <div style={{
//                 height: '100%', width: `${(stats.confirmedBookings / stats.totalBookings) * 100 || 0}%`,
//                 background: '#3D7A45', borderRadius: 4, transition: 'width 0.3s',
//               }} />
//             </div>
//           </div>

//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//             padding: 24, boxShadow: shadowCard,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
//               <div style={{
//                 width: 44, height: 44, borderRadius: 12,
//                 background: '#FEF7E6', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <Clock size={22} color="#B8860B" />
//               </div>
//               <div>
//                 <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
//                   Pending
//                 </div>
//                 <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#B8860B' }}>
//                   {stats.pendingBookings}
//                 </div>
//               </div>
//             </div>
//             <div style={{ height: 8, background: '#FEF7E6', borderRadius: 4, overflow: 'hidden' }}>
//               <div style={{
//                 height: '100%', width: `${(stats.pendingBookings / stats.totalBookings) * 100 || 0}%`,
//                 background: '#B8860B', borderRadius: 4, transition: 'width 0.3s',
//               }} />
//             </div>
//           </div>

//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//             padding: 24, boxShadow: shadowCard,
//           }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
//               <div style={{
//                 width: 44, height: 44, borderRadius: 12,
//                 background: '#FBEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <XCircle size={22} color="#B23B3B" />
//               </div>
//               <div>
//                 <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
//                   Cancelled
//                 </div>
//                 <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#B23B3B' }}>
//                   {stats.cancelledBookings}
//                 </div>
//               </div>
//             </div>
//             <div style={{ height: 8, background: '#FBEAEA', borderRadius: 4, overflow: 'hidden' }}>
//               <div style={{
//                 height: '100%', width: `${(stats.cancelledBookings / stats.totalBookings) * 100 || 0}%`,
//                 background: '#B23B3B', borderRadius: 4, transition: 'width 0.3s',
//               }} />
//             </div>
//           </div>
//         </div>

//         {/* Main Content Grid */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 32 }}>
//           {/* Recent Bookings */}
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             padding: 24, boxShadow: shadowCard,
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <div>
//                 <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
//                   Recent Bookings
//                 </h2>
//                 <p style={{ fontSize: 13, color: '#A39C8A' }}>Latest reservations</p>
//               </div>
//               <div style={{
//                 width: 40, height: 40, borderRadius: 10,
//                 background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <CalendarDays size={20} color={gold} />
//               </div>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {recentBookings.length > 0 ? recentBookings.map((booking) => {
//                 const statusConfig = getStatusConfig(booking.status);
//                 const StatusIcon = statusConfig.icon;
//                 return (
//                   <div
//                     key={booking.id}
//                     style={{
//                       background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 12,
//                       padding: 16, transition: 'all 0.2s',
//                     }}
//                   >
//                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//                         <div style={{
//                           width: 44, height: 44, borderRadius: 10,
//                           background: statusConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         }}>
//                           <StatusIcon size={20} color={statusConfig.color} />
//                         </div>
//                         <div>
//                           <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 600, color: ink }}>
//                             {booking.hall_name_en || booking.hall?.name_en || 'Unknown Hall'}
//                           </div>
//                           <div style={{ fontSize: 12, color: '#A39C8A', marginTop: 2 }}>
//                             {booking.customer_name || booking.customer?.name_en || 'Unknown Customer'}
//                           </div>
//                         </div>
//                       </div>
//                       <div style={{ textAlign: 'right' }}>
//                         <div style={{ fontSize: 14, fontWeight: 600, color: ink }}>
//                           SAR {Number(booking.total || 0).toLocaleString()}
//                         </div>
//                         <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 2 }}>
//                           {booking.date || '—'}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               }) : (
//                 <div style={{ textAlign: 'center', padding: 40, color: '#A39C8A' }}>
//                   No recent bookings
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Hall Occupancy */}
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             padding: 24, boxShadow: shadowCard,
//           }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
//               <div>
//                 <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
//                   Hall Occupancy
//                 </h2>
//                 <p style={{ fontSize: 13, color: '#A39C8A' }}>Current hall status</p>
//               </div>
//               <div style={{
//                 width: 40, height: 40, borderRadius: 10,
//                 background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>
//                 <Building2 size={20} color={gold} />
//               </div>
//             </div>

//             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//               {hallOccupancy.length > 0 ? hallOccupancy.map((hall) => (
//                 <div
//                   key={hall.name}
//                   style={{
//                     background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 12,
//                     padding: 16, transition: 'all 0.2s',
//                   }}
//                 >
//                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                     <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//                       <div style={{
//                         width: 44, height: 44, borderRadius: 10,
//                         background: hall.occupied ? '#FBEAEA' : '#EAF4EA',
//                         display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       }}>
//                         <DoorOpen size={20} color={hall.occupied ? '#B23B3B' : '#3D7A45'} />
//                       </div>
//                       <div>
//                         <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 600, color: ink }}>
//                           {hall.name}
//                         </div>
//                         <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 2 }}>
//                           {hall.bookingCount} booking{hall.bookingCount !== 1 ? 's' : ''}
//                         </div>
//                       </div>
//                     </div>
//                     <div style={{ textAlign: 'right' }}>
//                       <div style={{
//                         fontSize: 11, fontWeight: 600,
//                         color: hall.occupied ? '#B23B3B' : '#3D7A45',
//                         background: hall.occupied ? '#FBEAEA' : '#EAF4EA',
//                         padding: '4px 10px', borderRadius: 999,
//                       }}>
//                         {hall.occupied ? 'Occupied' : 'Available'}
//                       </div>
//                       {hall.occupied && hall.occupiedDates && (
//                         <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
//                           {hall.occupiedDates}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )) : (
//                 <div style={{ textAlign: 'center', padding: 40, color: '#A39C8A' }}>
//                   No halls found
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div style={{
//           background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//           padding: 24, boxShadow: shadowCard,
//         }}>
//           <h2 style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 16 }}>
//             Quick Actions
//           </h2>
//           <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//             <button
//               onClick={() => window.location.href = '/admin/bookings'}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: ink, color: '#FBF6E8', border: 'none',
//                 padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', transition: 'all 0.2s',
//               }}
//             >
//               <Calendar size={16} color={gold} />
//               View Bookings
//             </button>
//             <button
//               onClick={() => window.location.href = '/admin/halls'}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
//                 padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', transition: 'all 0.2s',
//               }}
//             >
//               <DoorOpen size={16} color={gold} />
//               Manage Halls
//             </button>
//             <button
//               onClick={() => window.location.href = '/admin/payments'}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
//                 padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', transition: 'all 0.2s',
//               }}
//             >
//               <CreditCard size={16} color={gold} />
//               View Payments
//             </button>
//             <button
//               onClick={() => window.location.href = '/admin/customers'}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
//                 padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', transition: 'all 0.2s',
//               }}
//             >
//               <Users size={16} color={gold} />
//               Manage Customers
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default AdminDashboardCom;






// Mobile Responsive Code
'use client';
import React, { useEffect, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Calendar, Users, DoorOpen, DollarSign, TrendingUp,
  Clock, CheckCircle, XCircle, AlertCircle, MapPin,
  CreditCard, Building2, CalendarDays, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

/* ── Design tokens — Gulf Hotel gold-on-ivory ───────────────────────── */
const gold = '#C6A43F';
const goldDeep = '#9C7F2C';
const ink = '#26231D';
const ivory = '#FBF9F4';
const line = 'rgba(198,164,63,0.22)';
const lineSoft = 'rgba(198,164,63,0.12)';
const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

const displayFont = "'Cormorant Garamond', serif";
const bodyFont = "'DM Sans', sans-serif";

/* Mobile-only overrides. Everything here is scoped to max-width: 768px
   and uses !important solely to beat the inline styles below — the
   desktop/laptop layout (anything above 768px) is completely untouched. */
// const responsiveStyles = `
//   @media (max-width: 768px) {
//     .db-container { padding: 20px 16px 40px !important; }
//     .db-eyebrow { font-size: 10px !important; margin-bottom: 6px !important; }
//     .db-title { font-size: 26px !important; }
//     .db-subtitle { font-size: 12.5px !important; margin-top: 6px !important; }

//     .db-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; margin-bottom: 22px !important; }
//     .db-stat-card { padding: 14px 16px !important; border-radius: 12px !important; }
//     .db-stat-card .db-stat-icon { width: 32px !important; height: 32px !important; border-radius: 8px !important; }
//     .db-stat-card .db-stat-value { font-size: 22px !important; }
//     .db-stat-card .db-stat-title { font-size: 9.5px !important; }

//     .db-status-grid { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 22px !important; }
//     .db-status-card { padding: 16px !important; }

//     .db-main-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-bottom: 22px !important; }
//     .db-panel { padding: 16px !important; }
//     .db-panel-title { font-size: 18px !important; }

//     .db-item-row { flex-wrap: wrap !important; gap: 10px !important; }
//     .db-item-amount { text-align: left !important; }

//     .db-quick-actions { padding: 16px !important; }
//     .db-quick-actions-title { font-size: 18px !important; margin-bottom: 12px !important; }
//     .db-qa-buttons { gap: 10px !important; }
//     .db-qa-btn { flex: 1 1 calc(50% - 5px) !important; justify-content: center !important; padding: 12px 10px !important; }
//   }

//   @media (max-width: 420px) {
//     .db-stats-grid { grid-template-columns: 1fr 1fr !important; }
//     .db-qa-btn { flex: 1 1 100% !important; }
//   }
// `;




const responsiveStyles = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .db-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .db-eyebrow { font-size: 10px !important; margin-bottom: 6px !important; }
    .db-title { font-size: 24px !important; }
    .db-subtitle { font-size: 12.5px !important; margin-top: 6px !important; }

    .db-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; margin-bottom: 22px !important; }
    .db-stat-card { padding: 12px 12px !important; border-radius: 12px !important; min-width: 0 !important; }
    .db-stat-card .db-stat-icon { width: 28px !important; height: 28px !important; border-radius: 8px !important; }
    .db-stat-card .db-stat-value { font-size: 18px !important; }
    .db-stat-card .db-stat-title { font-size: 9px !important; }

    .db-status-grid { grid-template-columns: 1fr !important; gap: 12px !important; margin-bottom: 22px !important; }
    .db-status-card { padding: 16px !important; }

    .db-main-grid { grid-template-columns: 1fr !important; gap: 16px !important; margin-bottom: 22px !important; }
    .db-panel { padding: 16px !important; }
    .db-panel-title { font-size: 18px !important; }

    .db-item-row { flex-wrap: wrap !important; gap: 10px !important; }
    .db-item-amount { text-align: left !important; }

    .db-quick-actions { padding: 16px !important; }
    .db-quick-actions-title { font-size: 18px !important; margin-bottom: 12px !important; }
    .db-qa-buttons { gap: 10px !important; }
    .db-qa-btn { flex: 1 1 calc(50% - 5px) !important; justify-content: center !important; padding: 12px 10px !important; }
  }

  @media (max-width: 420px) {
    .db-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    .db-qa-btn { flex: 1 1 100% !important; }
  }
`;

const AdminDashboardCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalHalls: 0,
    occupiedHalls: 0,
    availableHalls: 0,
    totalCustomers: 0,
    totalPayments: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [hallOccupancy, setHallOccupancy] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const bookingsRes = await AxiosInstance.get('/api/hotel/v1/booking/', { params: { limit: 100 } });
      const bookings = bookingsRes?.data?.data || bookingsRes?.data?.data?.data || [];

      // Fetch halls
      const hallsRes = await AxiosInstance.get('/api/hotel/v1/hall/', { params: { limit: 100 } });
      const halls = hallsRes?.data?.data || hallsRes?.data?.data?.data || [];

      // Fetch payments
      const paymentsRes = await AxiosInstance.get('/api/hotel/v1/payment/', { params: { limit: 100 } });
      const payments = paymentsRes?.data?.data || paymentsRes?.data?.data?.data || [];

      // Calculate stats
      const totalBookings = bookings.length;
      const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total || 0), 0);
      const totalHalls = halls.length;
      const occupiedHalls = halls.filter(h => h.occupied).length;
      const availableHalls = totalHalls - occupiedHalls;
      const totalCustomers = new Set(bookings.map(b => b.customer)).size;
      const totalPayments = payments.length;
      const pendingBookings = bookings.filter(b => b.status === 'pending').length;
      const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
      const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

      setStats({
        totalBookings,
        totalRevenue,
        totalHalls,
        occupiedHalls,
        availableHalls,
        totalCustomers,
        totalPayments,
        pendingBookings,
        confirmedBookings,
        cancelledBookings,
      });

      // Recent bookings (last 5)
      setRecentBookings(bookings.slice(0, 5));

      // Hall occupancy data
      setHallOccupancy(halls.map(h => ({
        name: h.name_en,
        occupied: h.occupied,
        occupiedDates: h.occupied_dates,
        bookingCount: h.booking_count || 0,
      })));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      confirmed: { color: '#3D7A45', bg: '#EAF4EA', icon: CheckCircle, label: 'Confirmed' },
      pending: { color: '#B8860B', bg: '#FEF7E6', icon: Clock, label: 'Pending' },
      cancelled: { color: '#B23B3B', bg: '#FBEAEA', icon: XCircle, label: 'Cancelled' },
    };
    return configs[status] || configs.pending;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, trendUp }) => (
  <div className="db-stat-card" style={{
    background: '#FFFFFF',
    border: `1px solid ${line}`,
    borderRadius: 16,
    padding: '20px 24px',
    boxShadow: shadowCard,
    transition: 'all 0.2s',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span className="db-stat-title" style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
          {title}
        </span>
      </div>
      <div className="db-stat-icon" style={{
        width: 40, height: 40, borderRadius: 10,
        background: color ? `${color}15` : `${gold}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={20} color={color || gold} />
      </div>
    </div>

    {/* 👇 THIS is the line to change 👇 */}
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 2, marginBottom: 8, minWidth: 0 }}>
      <div className="db-stat-value" style={{ fontFamily: displayFont, fontSize: 32, fontWeight: 600, color: ink, minWidth: 0 }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      {trend && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          fontSize: 12, fontWeight: 600,
          color: trendUp ? '#3D7A45' : '#B23B3B',
          whiteSpace: 'nowrap',
        }}>
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trend}
        </div>
      )}
    </div>
  </div>
);

  if (loading) {
    return (
      <div style={{ width: '100%', minHeight: '100vh', background: '#F6F3EC', fontFamily: bodyFont, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{
            width: 48, height: 48, border: `3px solid ${line}`, borderTopColor: gold,
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 14 }}>Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    // <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
    <div style={{ width: '100%', maxWidth: '100vw', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />
      <style>{responsiveStyles}</style>

      <div className="db-container" style={{ maxWidth: 1400, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="db-header" style={{ marginBottom: 36 }}>
          <div className="db-eyebrow" style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
            Overview
          </div>
          <h1 className="db-title" style={{ fontFamily: displayFont, fontSize: 42, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
            Hotel Management Dashboard
          </h1>
          <p className="db-subtitle" style={{ color: '#A39C8A', fontSize: 14, marginTop: 8 }}>
            Real-time insights into your hotel operations
          </p>
        </div>

        {/* Stats Grid */}
        <div className="db-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginBottom: 32 }}>
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Calendar}
            color="#3B82F6"
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            title="Total Revenue"
            value={`SAR ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="#3D7A45"
            trend="+18%"
            trendUp={true}
          />
          <StatCard
            title="Total Halls"
            value={stats.totalHalls}
            icon={DoorOpen}
            color={gold}
          />
          <StatCard
            title="Occupied Halls"
            value={stats.occupiedHalls}
            icon={MapPin}
            color="#B23B3B"
          />
          <StatCard
            title="Available Halls"
            value={stats.availableHalls}
            icon={CheckCircle}
            color="#3D7A45"
          />
          <StatCard
            title="Total Customers"
            value={stats.totalCustomers}
            icon={Users}
            color="#8B5CF6"
          />
          <StatCard
            title="Total Payments"
            value={stats.totalPayments}
            icon={CreditCard}
            color="#06B6D4"
          />
          <StatCard
            title="Pending Bookings"
            value={stats.pendingBookings}
            icon={Clock}
            color="#B8860B"
          />
        </div>

        {/* Booking Status Overview */}
        <div className="db-status-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 32 }}>
          <div className="db-status-card" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#EAF4EA', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CheckCircle size={22} color="#3D7A45" />
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
                  Confirmed
                </div>
                <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#3D7A45' }}>
                  {stats.confirmedBookings}
                </div>
              </div>
            </div>
            <div style={{ height: 8, background: '#EAF4EA', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(stats.confirmedBookings / stats.totalBookings) * 100 || 0}%`,
                background: '#3D7A45', borderRadius: 4, transition: 'width 0.3s',
              }} />
            </div>
          </div>

          <div className="db-status-card" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#FEF7E6', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Clock size={22} color="#B8860B" />
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
                  Pending
                </div>
                <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#B8860B' }}>
                  {stats.pendingBookings}
                </div>
              </div>
            </div>
            <div style={{ height: 8, background: '#FEF7E6', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(stats.pendingBookings / stats.totalBookings) * 100 || 0}%`,
                background: '#B8860B', borderRadius: 4, transition: 'width 0.3s',
              }} />
            </div>
          </div>

          <div className="db-status-card" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: '#FBEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <XCircle size={22} color="#B23B3B" />
              </div>
              <div>
                <div style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>
                  Cancelled
                </div>
                <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: '#B23B3B' }}>
                  {stats.cancelledBookings}
                </div>
              </div>
            </div>
            <div style={{ height: 8, background: '#FBEAEA', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(stats.cancelledBookings / stats.totalBookings) * 100 || 0}%`,
                background: '#B23B3B', borderRadius: 4, transition: 'width 0.3s',
              }} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="db-main-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 24, marginBottom: 32 }}>
          {/* Recent Bookings */}
          <div className="db-panel" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 className="db-panel-title" style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
                  Recent Bookings
                </h2>
                <p style={{ fontSize: 13, color: '#A39C8A' }}>Latest reservations</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CalendarDays size={20} color={gold} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentBookings.length > 0 ? recentBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <div
                    key={booking.id}
                    style={{
                      background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 12,
                      padding: 16, transition: 'all 0.2s',
                    }}
                  >
                    <div className="db-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{
                          width: 44, height: 44, borderRadius: 10,
                          background: statusConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <StatusIcon size={20} color={statusConfig.color} />
                        </div>
                        <div>
                          <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 600, color: ink }}>
                            {booking.hall_name_en || booking.hall?.name_en || 'Unknown Hall'}
                          </div>
                          <div style={{ fontSize: 12, color: '#A39C8A', marginTop: 2 }}>
                            {booking.customer_name || booking.customer?.name_en || 'Unknown Customer'}
                          </div>
                        </div>
                      </div>
                      <div className="db-item-amount" style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: ink }}>
                          SAR {Number(booking.total || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 2 }}>
                          {booking.date || '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#A39C8A' }}>
                  No recent bookings
                </div>
              )}
            </div>
          </div>

          {/* Hall Occupancy */}
          <div className="db-panel" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: 24, boxShadow: shadowCard,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h2 className="db-panel-title" style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 4 }}>
                  Hall Occupancy
                </h2>
                <p style={{ fontSize: 13, color: '#A39C8A' }}>Current hall status</p>
              </div>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: `${gold}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Building2 size={20} color={gold} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {hallOccupancy.length > 0 ? hallOccupancy.map((hall) => (
                <div
                  key={hall.name}
                  style={{
                    background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 12,
                    padding: 16, transition: 'all 0.2s',
                  }}
                >
                  <div className="db-item-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: hall.occupied ? '#FBEAEA' : '#EAF4EA',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <DoorOpen size={20} color={hall.occupied ? '#B23B3B' : '#3D7A45'} />
                      </div>
                      <div>
                        <div style={{ fontFamily: displayFont, fontSize: 16, fontWeight: 600, color: ink }}>
                          {hall.name}
                        </div>
                        <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 2 }}>
                          {hall.bookingCount} booking{hall.bookingCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className="db-item-amount" style={{ textAlign: 'right' }}>
                      <div style={{
                        fontSize: 11, fontWeight: 600,
                        color: hall.occupied ? '#B23B3B' : '#3D7A45',
                        background: hall.occupied ? '#FBEAEA' : '#EAF4EA',
                        padding: '4px 10px', borderRadius: 999,
                      }}>
                        {hall.occupied ? 'Occupied' : 'Available'}
                      </div>
                      {hall.occupied && hall.occupiedDates && (
                        <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
                          {hall.occupiedDates}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: 40, color: '#A39C8A' }}>
                  No halls found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="db-quick-actions" style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
          padding: 24, boxShadow: shadowCard,
        }}>
          <h2 className="db-quick-actions-title" style={{ fontFamily: displayFont, fontSize: 22, color: ink, fontWeight: 600, marginBottom: 16 }}>
            Quick Actions
          </h2>
          <div className="db-qa-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button
              className="db-qa-btn"
              onClick={() => window.location.href = '/admin/bookings'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: ink, color: '#FBF6E8', border: 'none',
                padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Calendar size={16} color={gold} />
              View Bookings
            </button>
            <button
              className="db-qa-btn"
              onClick={() => window.location.href = '/admin/halls'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <DoorOpen size={16} color={gold} />
              Manage Halls
            </button>
            <button
              className="db-qa-btn"
              onClick={() => window.location.href = '/admin/payments'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <CreditCard size={16} color={gold} />
              View Payments
            </button>
            <button
              className="db-qa-btn"
              onClick={() => window.location.href = '/admin/customers'}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                padding: '12px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >
              <Users size={16} color={gold} />
              Manage Customers
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardCom;