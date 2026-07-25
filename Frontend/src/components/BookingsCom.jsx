// 'use client';
// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Search, Plus, Pencil, Trash2, X, Calendar, Clock, DollarSign,
//   ChevronLeft, ChevronRight, MapPin, User, CheckCircle, XCircle, Clock as PendingIcon,
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

// /* ── Small building blocks ───────────────────────────────────────────── */

// const StatusPill = ({ status }) => {
//   const config = {
//     confirmed: { bg: '#EAF4EA', color: '#3D7A45', border: 'rgba(61,122,69,0.18)', icon: CheckCircle },
//     pending: { bg: '#FEF7E6', color: '#B8860B', border: 'rgba(184,134,11,0.18)', icon: PendingIcon },
//     cancelled: { bg: '#FBEAEA', color: '#B23B3B', border: 'rgba(178,59,59,0.18)', icon: XCircle },
//   };
//   const c = config[status?.toLowerCase()] || config.pending;
//   const Icon = c.icon;
  
//   return (
//     <span
//       style={{
//         display: 'inline-flex', alignItems: 'center', gap: 6,
//         padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
//         letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
//         background: c.bg, color: c.color, border: `1px solid ${c.border}`,
//       }}
//     >
//       <Icon size={12} />
//       {status || 'Pending'}
//     </span>
//   );
// };

// const FormGroup = ({ label, required, children, hint }) => (
//   <div style={{ marginBottom: 16 }}>
//     <label style={{
//       fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
//       color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600, fontFamily: bodyFont,
//     }}>
//       {label}{required && <span style={{ color: gold }}> *</span>}
//     </label>
//     {children}
//     {hint && <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 5, fontFamily: bodyFont }}>{hint}</div>}
//   </div>
// );

// const inputStyle = {
//   width: '100%', background: ivory, border: `1px solid ${line}`,
//   borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontFamily: bodyFont,
//   outline: 'none', color: ink, boxSizing: 'border-box', transition: 'border-color 0.15s',
// };

// function TextField({ value, onChange, ...rest }) {
//   const [focused, setFocused] = useState(false);
//   return (
//     <input
//       style={{ ...inputStyle, borderColor: focused ? gold : line }}
//       value={value || ''}
//       onChange={onChange}
//       onFocus={() => setFocused(true)}
//       onBlur={() => setFocused(false)}
//       {...rest}
//     />
//   );
// }

// /* ── Modal shell ──────────────────────────────────────────────────────── */

// function Modal({ title, subtitle, onClose, children, wide }) {
//   return (
//     <div
//       style={{
//         position: 'fixed', inset: 0, background: 'rgba(38,35,29,0.45)',
//         backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex',
//         alignItems: 'center', justifyContent: 'center', padding: 16,
//       }}
//       onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
//     >
//       <div style={{
//         background: '#FFFFFF', borderRadius: 22, width: '100%',
//         maxWidth: wide ? 720 : 500, maxHeight: '88vh', overflowY: 'auto',
//         boxShadow: '0 30px 60px -15px rgba(38,35,29,0.35)',
//         border: `1px solid ${line}`,
//       }}>
//         <div style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
//           padding: '22px 26px', borderBottom: `1px solid ${lineSoft}`,
//           position: 'sticky', top: 0, background: '#FFFFFF', borderRadius: '22px 22px 0 0',
//         }}>
//           <div>
//             <div style={{ fontFamily: displayFont, fontSize: 23, color: ink, fontWeight: 600 }}>{title}</div>
//             {subtitle && <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: '#A39C8A', marginTop: 3 }}>{subtitle}</div>}
//           </div>
//           <button
//             onClick={onClose}
//             style={{
//               cursor: 'pointer', width: 30, height: 30, borderRadius: '50%',
//               border: `1px solid ${line}`, background: ivory, color: '#8A8270',
//               display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//             }}
//           >
//             <X size={15} />
//           </button>
//         </div>
//         <div style={{ padding: 26 }}>{children}</div>
//       </div>
//     </div>
//   );
// }

// /* ── Main component ──────────────────────────────────────────────────── */

// const BookingsCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [records, setRecords] = useState([]);
//   const [count, setCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 10;
//   const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingBooking, setEditingBooking] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [halls, setHalls] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   const emptyForm = {
//     hall: '', customer: '', event_type_en: '', event_type_ar: '',
//     date: '', time_slot: 'morning', status: 'pending', total: '',
//   };
//   const [form, setForm] = useState(emptyForm);

//   useEffect(() => {
//     fetchBookings();
//     fetchHalls();
//     fetchCustomers();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   const fetchBookings = async () => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/booking/', {
//         params: {
//           limit: recordsPerPage,
//           offset: (currentPage - 1) * recordsPerPage,
//         },
//       });

//       const payload = res?.data;
//       const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
//       const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

//       if (Array.isArray(list)) {
//         setRecords(list);
//         setCount(total ?? list.length);
//       } else {
//         console.error('Unexpected response structure:', res);
//         toast.error('Could not load bookings');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       toast.error('Error fetching bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchHalls = async () => {
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/hall/', { params: { limit: 100 } });
//       const list = res?.data?.data || res?.data?.data?.data || [];
//       setHalls(Array.isArray(list) ? list : []);
//     } catch (error) {
//       console.error('Error fetching halls:', error);
//     }
//   };

//   const fetchCustomers = async () => {
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/customer/', { params: { limit: 100 } });
//       const list = res?.data?.data || res?.data?.data?.data || [];
//       setCustomers(Array.isArray(list) ? list : []);
//     } catch (error) {
//       console.error('Error fetching customers:', error);
//     }
//   };

//   const filteredRecords = useMemo(() => {
//     if (!Array.isArray(records)) return [];
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return records;
//     return records.filter((b) => {
//       const idMatch = b.id?.toString() === q;
//       const codeMatch = b.booking_code?.toLowerCase().includes(q);
//       const eventMatch = `${b.event_type_en || ''} ${b.event_type_ar || ''}`.toLowerCase().includes(q);
//       const hallMatch = (b.hall_name_en || b.hall?.name_en)?.toLowerCase().includes(q);
//       const customerMatch = (b.customer_name || b.customer?.name_en)?.toLowerCase().includes(q);
//       return idMatch || codeMatch || eventMatch || hallMatch || customerMatch;
//     });
//   }, [records, searchTerm]);

//   const totalBookings = count;
//   const totalRevenue = records.reduce((sum, b) => sum + Number(b.total || 0), 0);
//   const confirmedCount = records.filter((b) => b.status === 'confirmed').length;
//   const pendingCount = records.filter((b) => b.status === 'pending').length;

//   /* ── Modal handlers ── */

//   const openCreate = () => {
//     setEditingBooking(null);
//     setForm({ ...emptyForm });
//     setModalOpen(true);
//   };

//   const openEdit = (booking) => {
//     setEditingBooking(booking);
//     setForm({
//       hall: booking.hall || '',
//       customer: booking.customer || '',
//       event_type_en: booking.event_type_en || '',
//       event_type_ar: booking.event_type_ar || '',
//       date: booking.date || '',
//       time_slot: booking.time_slot || 'morning',
//       status: booking.status || 'pending',
//       total: booking.total || '',
//     });
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//     // Reset form when closing
//     setForm({ ...emptyForm });
//     setEditingBooking(null);
//   };

//   const saveBooking = async (e) => {
//     e.preventDefault();
//     if (!form.hall || !form.customer || !form.event_type_en.trim() || !form.date || !form.total) {
//       toast.error('Hall, customer, event type, date, and total are required');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         hall: form.hall,
//         customer: form.customer,
//         event_type_en: form.event_type_en,
//         event_type_ar: form.event_type_ar,
//         date: form.date,
//         time_slot: form.time_slot,
//         status: form.status,
//         total: form.total,
//       };

//       if (editingBooking) {
//         await AxiosInstance.patch(`/api/hotel/v1/booking/?id=${editingBooking.id}`, payload);
//         toast.success('Booking updated successfully');
//       } else {
//         await AxiosInstance.post('/api/hotel/v1/booking/', payload);
//         toast.success('Booking created successfully');
//       }
//       setModalOpen(false);
//       setForm({ ...emptyForm });
//       setEditingBooking(null);
//       setCurrentPage(1);
//       fetchBookings();
//     } catch (error) {
//       console.error('Error saving booking:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving booking';
//       toast.error(typeof msg === 'string' ? msg : 'Error saving booking');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteBooking = async (booking) => {
//     if (!window.confirm(`Remove booking "${booking.booking_code}"? This cannot be undone.`)) return;
//     try {
//       const res = await AxiosInstance.delete(`/api/hotel/v1/booking/?id=${booking.id}`);
//       if (res) {
//         toast.success('Booking deleted successfully');
//         setCurrentPage(1);
//         fetchBookings();
//       }
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : 'Error deleting booking');
//     }
//   };

//   /* ── Render ── */

//   return (
//     <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
//       <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

//       <div style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

//         {/* Header */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
//           <div>
//             <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
//               Event Management
//             </div>
//             <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//               Event Bookings
//             </h1>
//           </div>

//           {permissions.create_booking && (
//             <button
//               onClick={openCreate}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: ink, color: '#FBF6E8', border: 'none',
//                 padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
//                 transition: 'transform 0.15s, box-shadow 0.15s',
//               }}
//               onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
//               onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
//             >
//               <Plus size={16} color={gold} />
//               New Booking
//             </button>
//           )}
//         </div>

//         {/* Stat strip */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
//           {[
//             { label: 'Total Bookings', value: totalBookings, icon: Calendar },
//             { label: 'Confirmed', value: confirmedCount, icon: CheckCircle, accent: '#3D7A45' },
//             { label: 'Pending', value: pendingCount, icon: Clock, accent: '#B8860B' },
//             { label: 'Total Revenue', value: `SAR ${totalRevenue.toLocaleString()}`, icon: DollarSign, accent: goldDeep },
//           ].map(({ label, value, icon: Icon, accent }) => (
//             <div key={label} style={{
//               background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//               padding: '18px 20px', boxShadow: shadowCard,
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//                 <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
//                 <Icon size={16} color={accent || gold} />
//               </div>
//               <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Search */}
//         <div style={{
//           background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
//           padding: 14, marginBottom: 22, boxShadow: shadowCard,
//         }}>
//           <div style={{ position: 'relative' }}>
//             <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
//             <input
//               type="text"
//               placeholder="Search by booking code, event, hall, or customer…"
//               value={searchTerm}
//               onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//               style={{
//                 width: '100%', padding: '11px 14px 11px 42px', background: ivory,
//                 border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
//                 color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
//               }}
//             />
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
//             <div style={{
//               width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
//               borderRadius: '50%', animation: 'cc-spin 0.8s linear infinite',
//             }} />
//             <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
//             <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading bookings…</p>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && filteredRecords.length > 0 && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             overflow: 'hidden', boxShadow: shadowCard,
//           }}>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
//                 <thead>
//                   <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
//                     {['ID', 'Booking', 'Hall', 'Customer', 'Event', 'Date & Time', 'Status', 'Total', ''].map((h, i) => (
//                       <th key={i} style={{
//                         textAlign: i === 8 ? 'right' : 'left', padding: '14px 18px',
//                         fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
//                         color: '#8A8270', fontWeight: 700,
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRecords.map((b, idx) => (
//                     <tr
//                       key={b.id}
//                       style={{
//                         borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
//                         transition: 'background 0.15s',
//                       }}
//                       onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//                     >
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
//                         #{b.id}
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <span style={{
//                           fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
//                           background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
//                           fontWeight: 600,
//                         }}>{b.booking_code || `B${1000 + b.id}`}</span>
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
//                         {b.hall_name_en || b.hall?.name_en || '—'}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
//                         {b.customer_name || b.customer?.name_en || '—'}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
//                         {b.event_type_en || '—'}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
//                           <Calendar size={13} color="#A39C8A" />
//                           {b.date || '—'}
//                         </div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                           <Clock size={13} color="#A39C8A" />
//                           <span style={{ textTransform: 'capitalize' }}>{b.time_slot || 'morning'}</span>
//                         </div>
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <StatusPill status={b.status} />
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: goldDeep, fontWeight: 600 }}>
//                         SAR {Number(b.total || 0).toLocaleString()}
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                           {permissions.update_booking && (
//                             <button
//                               onClick={() => openEdit(b)}
//                               title="Update"
//                               style={{
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                 width: 34, height: 34, borderRadius: 9,
//                                 background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                                 color: goldDeep, cursor: 'pointer',
//                               }}
//                             >
//                               <Pencil size={14} />
//                             </button>
//                           )}
//                           {permissions.delete_booking && (
//                             <button
//                               onClick={() => deleteBooking(b)}
//                               title="Delete"
//                               style={{
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                 width: 34, height: 34, borderRadius: 9,
//                                 background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
//                                 color: '#B23B3B', cursor: 'pointer',
//                               }}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div style={{
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
//               }}>
//                 <span style={{ fontSize: 12, color: '#A39C8A' }}>
//                   Page {currentPage} of {totalPages} · {count} booking{count !== 1 ? 's' : ''}
//                 </span>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     style={{
//                       width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       border: `1px solid ${line}`, background: '#FFFFFF',
//                       color: currentPage === 1 ? '#D8D2C0' : ink,
//                       cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//                     }}
//                   >
//                     <ChevronLeft size={15} />
//                   </button>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                     disabled={currentPage === totalPages}
//                     style={{
//                       width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       border: `1px solid ${line}`, background: '#FFFFFF',
//                       color: currentPage === totalPages ? '#D8D2C0' : ink,
//                       cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//                     }}
//                   >
//                     <ChevronRight size={15} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Empty state */}
//         {!loading && filteredRecords.length === 0 && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
//           }}>
//             <div style={{
//               width: 64, height: 64, borderRadius: '50%', background: ivory,
//               display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
//             }}>
//               <Calendar size={28} color={gold} />
//             </div>
//             <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No bookings found</h3>
//             <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
//               {searchTerm ? 'Try a different search term' : 'Create your first booking to get started'}
//             </p>
//             {permissions.create_booking && !searchTerm && (
//               <button
//                 onClick={openCreate}
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   background: ink, color: '#FBF6E8', border: 'none',
//                   padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                 }}
//               >
//                 <Plus size={16} color={gold} />
//                 New Booking
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Create / Edit modal */}
//       {modalOpen && (
//         <Modal
//           title={editingBooking ? 'Update Booking' : 'New Booking'}
//           subtitle={editingBooking ? `Editing "${editingBooking.booking_code}"` : 'Create a new event booking'}
//           onClose={closeModal}
//           wide
//         >
//           <form onSubmit={saveBooking}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Hall" required>
//                 <select
//                   style={inputStyle}
//                   value={form.hall || ''}
//                   onChange={(e) => setForm({ ...form, hall: e.target.value })}
//                 >
//                   <option value="">Select Hall</option>
//                   {halls.map((h) => (
//                     <option key={h.id} value={h.id}>
//                       {h.name_en || h.name || `Hall ${h.id}`}
//                     </option>
//                   ))}
//                 </select>
//                 {/* Debug info - remove in production */}
//                 {form.hall && (
//                   <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
//                     Selected Hall ID: {form.hall}
//                   </div>
//                 )}
//               </FormGroup>
//               <FormGroup label="Customer" required>
//                 <select
//                   style={inputStyle}
//                   value={form.customer || ''}
//                   onChange={(e) => setForm({ ...form, customer: e.target.value })}
//                 >
//                   <option value="">Select Customer</option>
//                   {customers.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.name_en || c.name || `Customer ${c.id}`}
//                     </option>
//                   ))}
//                 </select>
//                 {/* Debug info - remove in production */}
//                 {form.customer && (
//                   <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
//                     Selected Customer ID: {form.customer}
//                   </div>
//                 )}
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Event Type (English)" required>
//                 <TextField
//                   value={form.event_type_en || ''}
//                   onChange={(e) => setForm({ ...form, event_type_en: e.target.value })}
//                   placeholder="Wedding"
//                 />
//               </FormGroup>
//               <FormGroup label="Event Type (Arabic)">
//                 <TextField
//                   value={form.event_type_ar || ''}
//                   onChange={(e) => setForm({ ...form, event_type_ar: e.target.value })}
//                   placeholder="زفاف"
//                   dir="rtl"
//                 />
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Date" required>
//                 <TextField
//                   type="date"
//                   value={form.date || ''}
//                   onChange={(e) => setForm({ ...form, date: e.target.value })}
//                 />
//               </FormGroup>
//               <FormGroup label="Time Slot" required>
//                 <select
//                   style={inputStyle}
//                   value={form.time_slot || 'morning'}
//                   onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
//                 >
//                   <option value="morning">Morning Shift</option>
//                   <option value="afternoon">Afternoon Shift</option>
//                   <option value="night">Night Shift</option>
//                 </select>
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Status" required>
//                 <select
//                   style={inputStyle}
//                   value={form.status || 'pending'}
//                   onChange={(e) => setForm({ ...form, status: e.target.value })}
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="confirmed">Confirmed</option>
//                   <option value="cancelled">Cancelled</option>
//                 </select>
//               </FormGroup>
//               <FormGroup label="Total (SAR)" required>
//                 <TextField
//                   type="number"
//                   min="0"
//                   step="0.01"
//                   value={form.total || ''}
//                   onChange={(e) => setForm({ ...form, total: e.target.value })}
//                   placeholder="0.00"
//                 />
//               </FormGroup>
//             </div>

//             <button
//               type="submit"
//               disabled={saving}
//               style={{
//                 width: '100%', background: ink, color: '#FBF6E8', border: 'none',
//                 borderRadius: 12, padding: '14px', fontSize: 13.5, fontWeight: 600,
//                 cursor: saving ? 'not-allowed' : 'pointer', marginTop: 6, opacity: saving ? 0.6 : 1,
//                 letterSpacing: '0.02em',
//               }}
//             >
//               {saving ? 'Saving…' : editingBooking ? 'Save Changes' : 'Create Booking'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default BookingsCom;







// Mobile Responsive Version
'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, Calendar, Clock, DollarSign,
  ChevronLeft, ChevronRight, MapPin, User, CheckCircle, XCircle, Clock as PendingIcon,
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

/* Mobile-only overrides. Desktop (>768px) layout is untouched.
   NOTE: avoid '>' and '"' characters inside this string — Next.js can
   escape them differently on server vs client inside <style> text
   content, causing a hydration mismatch. Use plain class selectors
   instead of child combinators or attribute-quote selectors. */
const responsiveStyles = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .bk-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .bk-header { flex-direction: column !important; align-items: flex-start !important; }
    .bk-title { font-size: 28px !important; }
    .bk-header button { width: 100% !important; justify-content: center !important; }

    .bk-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
    .bk-stat-value { font-size: 20px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .bk-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; padding: 0 !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .bk-table thead { display: none !important; }
    .bk-table, .bk-table tbody, .bk-table tr, .bk-table td {
      display: block !important; width: 100% !important;
    }
    .bk-table { min-width: 0 !important; }
    .bk-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .bk-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .bk-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .bk-table td[data-label='Date & Time'] { align-items: flex-start !important; }
    .bk-table td[data-label='Date & Time'] .bk-datetime-col { align-items: flex-end !important; }
    .bk-table td[data-label=''] { justify-content: flex-end !important; }
    .bk-table td[data-label='']::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .bk-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

const StatusPill = ({ status }) => {
  const config = {
    confirmed: { bg: '#EAF4EA', color: '#3D7A45', border: 'rgba(61,122,69,0.18)', icon: CheckCircle },
    pending: { bg: '#FEF7E6', color: '#B8860B', border: 'rgba(184,134,11,0.18)', icon: PendingIcon },
    cancelled: { bg: '#FBEAEA', color: '#B23B3B', border: 'rgba(178,59,59,0.18)', icon: XCircle },
  };
  const c = config[status?.toLowerCase()] || config.pending;
  const Icon = c.icon;

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
        letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      }}
    >
      <Icon size={12} />
      {status || 'Pending'}
    </span>
  );
};

const FormGroup = ({ label, required, children, hint }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{
      fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase',
      color: '#8A8270', marginBottom: 7, display: 'block', fontWeight: 600, fontFamily: bodyFont,
    }}>
      {label}{required && <span style={{ color: gold }}> *</span>}
    </label>
    {children}
    {hint && <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 5, fontFamily: bodyFont }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: '100%', background: ivory, border: `1px solid ${line}`,
  borderRadius: 10, padding: '11px 14px', fontSize: 13.5, fontFamily: bodyFont,
  outline: 'none', color: ink, boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function TextField({ value, onChange, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      style={{ ...inputStyle, borderColor: focused ? gold : line }}
      value={value || ''}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

/* ── Modal shell ──────────────────────────────────────────────────────── */

function Modal({ title, subtitle, onClose, children, wide }) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(38,35,29,0.45)',
        backdropFilter: 'blur(6px)', zIndex: 2000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#FFFFFF', borderRadius: 22, width: '100%',
        maxWidth: wide ? 720 : 500, maxHeight: '88vh', overflowY: 'auto',
        boxShadow: '0 30px 60px -15px rgba(38,35,29,0.35)',
        border: `1px solid ${line}`,
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          padding: '22px 26px', borderBottom: `1px solid ${lineSoft}`,
          position: 'sticky', top: 0, background: '#FFFFFF', borderRadius: '22px 22px 0 0',
        }}>
          <div>
            <div style={{ fontFamily: displayFont, fontSize: 23, color: ink, fontWeight: 600 }}>{title}</div>
            {subtitle && <div style={{ fontFamily: bodyFont, fontSize: 12.5, color: '#A39C8A', marginTop: 3 }}>{subtitle}</div>}
          </div>
          <button
            onClick={onClose}
            style={{
              cursor: 'pointer', width: 30, height: 30, borderRadius: '50%',
              border: `1px solid ${line}`, background: ivory, color: '#8A8270',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>
        <div style={{ padding: 26 }}>{children}</div>
      </div>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────── */

const BookingsCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [saving, setSaving] = useState(false);

  const [halls, setHalls] = useState([]);
  const [customers, setCustomers] = useState([]);

  const emptyForm = {
    hall: '', customer: '', event_type_en: '', event_type_ar: '',
    date: '', time_slot: 'morning', status: 'pending', total: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchBookings();
    fetchHalls();
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/booking/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
      const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

      if (Array.isArray(list)) {
        setRecords(list);
        setCount(total ?? list.length);
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Could not load bookings');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchHalls = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/hall/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setHalls(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching halls:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/customer/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setCustomers(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((b) => {
      const idMatch = b.id?.toString() === q;
      const codeMatch = b.booking_code?.toLowerCase().includes(q);
      const eventMatch = `${b.event_type_en || ''} ${b.event_type_ar || ''}`.toLowerCase().includes(q);
      const hallMatch = (b.hall_name_en || b.hall?.name_en)?.toLowerCase().includes(q);
      const customerMatch = (b.customer_name || b.customer?.name_en)?.toLowerCase().includes(q);
      return idMatch || codeMatch || eventMatch || hallMatch || customerMatch;
    });
  }, [records, searchTerm]);

  const totalBookings = count;
  const totalRevenue = records.reduce((sum, b) => sum + Number(b.total || 0), 0);
  const confirmedCount = records.filter((b) => b.status === 'confirmed').length;
  const pendingCount = records.filter((b) => b.status === 'pending').length;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingBooking(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (booking) => {
    setEditingBooking(booking);
    setForm({
      hall: booking.hall || '',
      customer: booking.customer || '',
      event_type_en: booking.event_type_en || '',
      event_type_ar: booking.event_type_ar || '',
      date: booking.date || '',
      time_slot: booking.time_slot || 'morning',
      status: booking.status || 'pending',
      total: booking.total || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    // Reset form when closing
    setForm({ ...emptyForm });
    setEditingBooking(null);
  };

  const saveBooking = async (e) => {
    e.preventDefault();
    if (!form.hall || !form.customer || !form.event_type_en.trim() || !form.date || !form.total) {
      toast.error('Hall, customer, event type, date, and total are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        hall: form.hall,
        customer: form.customer,
        event_type_en: form.event_type_en,
        event_type_ar: form.event_type_ar,
        date: form.date,
        time_slot: form.time_slot,
        status: form.status,
        total: form.total,
      };

      if (editingBooking) {
        await AxiosInstance.patch(`/api/hotel/v1/booking/?id=${editingBooking.id}`, payload);
        toast.success('Booking updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/booking/', payload);
        toast.success('Booking created successfully');
      }
      setModalOpen(false);
      setForm({ ...emptyForm });
      setEditingBooking(null);
      setCurrentPage(1);
      fetchBookings();
    } catch (error) {
      console.error('Error saving booking:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving booking';
      toast.error(typeof msg === 'string' ? msg : 'Error saving booking');
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (booking) => {
    if (!window.confirm(`Remove booking "${booking.booking_code}"? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/booking/?id=${booking.id}`);
      if (res) {
        toast.success('Booking deleted successfully');
        setCurrentPage(1);
        fetchBookings();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting booking');
    }
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', maxWidth: '100vw', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />
      <style>{responsiveStyles}</style>

      <div className="bk-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="bk-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Event Management
            </div>
            <h1 className="bk-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Event Bookings
            </h1>
          </div>

          {permissions.create_booking && (
            <button
              onClick={openCreate}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: ink, color: '#FBF6E8', border: 'none',
                padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
            >
              <Plus size={16} color={gold} />
              New Booking
            </button>
          )}
        </div>

        {/* Stat strip */}
        <div className="bk-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Bookings', value: totalBookings, icon: Calendar },
            { label: 'Confirmed', value: confirmedCount, icon: CheckCircle, accent: '#3D7A45' },
            { label: 'Pending', value: pendingCount, icon: Clock, accent: '#B8860B' },
            { label: 'Total Revenue', value: `SAR ${totalRevenue.toLocaleString()}`, icon: DollarSign, accent: goldDeep },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div className="bk-stat-value" style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{
          background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
          padding: 14, marginBottom: 22, boxShadow: shadowCard,
        }}>
          <div style={{ position: 'relative' }}>
            <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by booking code, event, hall, or customer…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%', padding: '11px 14px 11px 42px', background: ivory,
                border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
              borderRadius: '50%', animation: 'cc-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes cc-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading bookings…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="bk-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="bk-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Booking', 'Hall', 'Customer', 'Event', 'Date & Time', 'Status', 'Total', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 8 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((b, idx) => (
                    <tr
                      key={b.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        #{b.id}
                      </td>
                      <td data-label="Booking" style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                          background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          fontWeight: 600,
                        }}>{b.booking_code || `B${1000 + b.id}`}</span>
                      </td>
                      <td data-label="Hall" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        {b.hall_name_en || b.hall?.name_en || '—'}
                      </td>
                      <td data-label="Customer" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {b.customer_name || b.customer?.name_en || '—'}
                      </td>
                      <td data-label="Event" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {b.event_type_en || '—'}
                      </td>
                      <td data-label="Date & Time" style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
                        <div className="bk-datetime-col" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Calendar size={13} color="#A39C8A" />
                            {b.date || '—'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Clock size={13} color="#A39C8A" />
                            <span style={{ textTransform: 'capitalize' }}>{b.time_slot || 'morning'}</span>
                          </div>
                        </div>
                      </td>
                      <td data-label="Status" style={{ padding: '14px 18px' }}>
                        <StatusPill status={b.status} />
                      </td>
                      <td data-label="Total" style={{ padding: '14px 18px', fontSize: 13.5, color: goldDeep, fontWeight: 600 }}>
                        SAR {Number(b.total || 0).toLocaleString()}
                      </td>
                      <td data-label="" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {permissions.update_booking && (
                            <button
                              onClick={() => openEdit(b)}
                              title="Update"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
                                color: goldDeep, cursor: 'pointer',
                              }}
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                          {permissions.delete_booking && (
                            <button
                              onClick={() => deleteBooking(b)}
                              title="Delete"
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 34, height: 34, borderRadius: 9,
                                background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
                                color: '#B23B3B', cursor: 'pointer',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bk-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} booking{count !== 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === 1 ? '#D8D2C0' : ink,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronLeft size={15} />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: '#FFFFFF',
                      color: currentPage === totalPages ? '#D8D2C0' : ink,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredRecords.length === 0 && (
          <div style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%', background: ivory,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
            }}>
              <Calendar size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No bookings found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first booking to get started'}
            </p>
            {permissions.create_booking && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                New Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingBooking ? 'Update Booking' : 'New Booking'}
          subtitle={editingBooking ? `Editing "${editingBooking.booking_code}"` : 'Create a new event booking'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveBooking}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Hall" required>
                <select
                  style={inputStyle}
                  value={form.hall || ''}
                  onChange={(e) => setForm({ ...form, hall: e.target.value })}
                >
                  <option value="">Select Hall</option>
                  {halls.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name_en || h.name || `Hall ${h.id}`}
                    </option>
                  ))}
                </select>
                {/* Debug info - remove in production */}
                {form.hall && (
                  <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
                    Selected Hall ID: {form.hall}
                  </div>
                )}
              </FormGroup>
              <FormGroup label="Customer" required>
                <select
                  style={inputStyle}
                  value={form.customer || ''}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                >
                  <option value="">Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en || c.name || `Customer ${c.id}`}
                    </option>
                  ))}
                </select>
                {/* Debug info - remove in production */}
                {form.customer && (
                  <div style={{ fontSize: 11, color: '#A39C8A', marginTop: 4 }}>
                    Selected Customer ID: {form.customer}
                  </div>
                )}
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Event Type (English)" required>
                <TextField
                  value={form.event_type_en || ''}
                  onChange={(e) => setForm({ ...form, event_type_en: e.target.value })}
                  placeholder="Wedding"
                />
              </FormGroup>
              <FormGroup label="Event Type (Arabic)">
                <TextField
                  value={form.event_type_ar || ''}
                  onChange={(e) => setForm({ ...form, event_type_ar: e.target.value })}
                  placeholder="زفاف"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Date" required>
                <TextField
                  type="date"
                  value={form.date || ''}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Time Slot" required>
                <select
                  style={inputStyle}
                  value={form.time_slot || 'morning'}
                  onChange={(e) => setForm({ ...form, time_slot: e.target.value })}
                >
                  <option value="morning">Morning Shift</option>
                  <option value="afternoon">Afternoon Shift</option>
                  <option value="night">Night Shift</option>
                </select>
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Status" required>
                <select
                  style={inputStyle}
                  value={form.status || 'pending'}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </FormGroup>
              <FormGroup label="Total (SAR)" required>
                <TextField
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.total || ''}
                  onChange={(e) => setForm({ ...form, total: e.target.value })}
                  placeholder="0.00"
                />
              </FormGroup>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', background: ink, color: '#FBF6E8', border: 'none',
                borderRadius: 12, padding: '14px', fontSize: 13.5, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', marginTop: 6, opacity: saving ? 0.6 : 1,
                letterSpacing: '0.02em',
              }}
            >
              {saving ? 'Saving…' : editingBooking ? 'Save Changes' : 'Create Booking'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BookingsCom;