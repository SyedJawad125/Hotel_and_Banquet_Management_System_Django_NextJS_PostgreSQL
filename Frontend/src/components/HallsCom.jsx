// 'use client';
// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Search, Plus, Pencil, Trash2, X, Users2, DoorOpen,
//   ImagePlus, BadgeCheck, CalendarClock, ChevronLeft, ChevronRight,
//   LayoutGrid, Table2, Download, MapPin, CalendarDays, CheckCircle2,
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

// const StatusPill = ({ occupied }) => (
//   <span
//     style={{
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
//       letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
//       background: occupied ? '#FBEAEA' : '#EAF4EA',
//       color: occupied ? '#B23B3B' : '#3D7A45',
//       border: `1px solid ${occupied ? 'rgba(178,59,59,0.18)' : 'rgba(61,122,69,0.18)'}`,
//     }}
//   >
//     <span style={{
//       width: 6, height: 6, borderRadius: '50%',
//       background: occupied ? '#B23B3B' : '#3D7A45',
//     }} />
//     {occupied ? 'Occupied' : 'Available'}
//   </span>
// );

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
//       value={value}
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
//         maxWidth: wide ? 640 : 520, maxHeight: '88vh', overflowY: 'auto',
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

// const HallsVenuesCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [records, setRecords] = useState([]);
//   const [count, setCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 10;
//   const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingHall, setEditingHall] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

//   const emptyForm = {
//     name_en: '', name_ar: '', code_name: '', capacity: '', capacity_count: '',
//     badge: '', occupied: false, occupied_dates: '',
//   };
//   const [form, setForm] = useState(emptyForm);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchHalls();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   const fetchHalls = async () => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/hall/', {
//         params: {
//           limit: recordsPerPage,
//           offset: (currentPage - 1) * recordsPerPage,
//         },
//       });

//       const payload = res?.data;
//       // Backend returns { message, count, data: [...] } — data is the array directly.
//       // Some endpoints nest it one level deeper as { data: { count, data: [...] } },
//       // so we check both shapes to be safe.
//       const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
//       const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

//       if (Array.isArray(list)) {
//         setRecords(list);
//         setCount(total ?? list.length);
//       } else {
//         console.error('Unexpected response structure:', res);
//         toast.error('Could not load halls');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       toast.error('Error fetching halls');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredRecords = useMemo(() => {
//     if (!Array.isArray(records)) return [];
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return records;
//     return records.filter((h) => {
//       const idMatch = h.id?.toString() === q;
//       const nameMatch = `${h.name_en || ''} ${h.name_ar || ''}`.toLowerCase().includes(q);
//       const codeMatch = h.code_name?.toLowerCase().includes(q);
//       const badgeMatch = h.badge?.toLowerCase().includes(q);
//       return idMatch || nameMatch || codeMatch || badgeMatch;
//     });
//   }, [records, searchTerm]);

//   const totalHalls = count;
//   const occupiedCount = records.filter((h) => h.occupied).length;
//   const availableCount = records.filter((h) => !h.occupied).length;
//   const totalBookings = records.reduce((sum, h) => sum + (h.booking_count || 0), 0);

//   /* ── Modal handlers ── */

//   const openCreate = () => {
//     setEditingHall(null);
//     setForm(emptyForm);
//     setImageFile(null);
//     setImagePreview(null);
//     setModalOpen(true);
//   };

//   const openEdit = (hall) => {
//     setEditingHall(hall);
//     setForm({
//       name_en: hall.name_en || '',
//       name_ar: hall.name_ar || '',
//       code_name: hall.code_name || '',
//       capacity: hall.capacity || '',
//       capacity_count: hall.capacity_count ?? '',
//       badge: hall.badge || '',
//       occupied: !!hall.occupied,
//       occupied_dates: hall.occupied_dates || '',
//     });
//     setImageFile(null);
//     setImagePreview(hall.image || null);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0] || null;
//     setImageFile(file);
//     if (file) setImagePreview(URL.createObjectURL(file));
//   };

//   const saveHall = async (e) => {
//     e.preventDefault();
//     if (!form.name_en.trim() || !form.code_name.trim() || !form.capacity.trim()) {
//       toast.error('Name (English), code name, and capacity are required');
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append('name_en', form.name_en);
//       formData.append('name_ar', form.name_ar);
//       formData.append('code_name', form.code_name);
//       formData.append('capacity', form.capacity);
//       if (form.capacity_count !== '') formData.append('capacity_count', form.capacity_count);
//       formData.append('badge', form.badge);
//       formData.append('occupied', form.occupied);
//       formData.append('occupied_dates', form.occupied_dates);
//       if (imageFile) formData.append('image', imageFile);

//       if (editingHall) {
//         await AxiosInstance.patch(`/api/hotel/v1/hall/?id=${editingHall.id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('Hall updated successfully');
//       } else {
//         await AxiosInstance.post('/api/hotel/v1/hall/', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('Hall created successfully');
//       }
//       setModalOpen(false);
//       setCurrentPage(1);
//       fetchHalls();
//     } catch (error) {
//       console.error('Error saving hall:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving hall';
//       toast.error(typeof msg === 'string' ? msg : 'Error saving hall');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteHall = async (hall) => {
//     if (!window.confirm(`Remove "${hall.name_en}"? This cannot be undone.`)) return;
//     try {
//       const res = await AxiosInstance.delete(`/api/hotel/v1/hall/?id=${hall.id}`);
//       if (res) {
//         toast.success('Hall deleted successfully');
//         setCurrentPage(1);
//         fetchHalls();
//       }
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : 'This hall has active bookings and cannot be deleted');
//     }
//   };

//   const exportCSV = () => {
//     if (!filteredRecords.length) {
//       toast.error('No halls to export');
//       return;
//     }
//     const headers = ['ID', 'Name (EN)', 'Name (AR)', 'Code Name', 'Capacity', 'Capacity Count', 'Badge', 'Status', 'Occupied Dates', 'Booking Count'];
//     const escape = (val) => {
//       const s = val === null || val === undefined ? '' : String(val);
//       return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
//     };
//     const rows = filteredRecords.map((h) => [
//       h.id, h.name_en, h.name_ar, h.code_name, h.capacity, h.capacity_count,
//       h.badge, h.occupied ? 'Occupied' : 'Available', h.occupied_dates, h.booking_count ?? 0,
//     ]);
//     const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     const stamp = new Date().toISOString().slice(0, 10);
//     link.href = url;
//     link.download = `halls-export-${stamp}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success('CSV exported');
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
//               Venue Management
//             </div>
//             <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//               Halls &amp; Venues
//             </h1>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <button
//               onClick={exportCSV}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
//                 padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', letterSpacing: '0.02em', boxShadow: shadowCard,
//               }}
//             >
//               <Download size={15} color={goldDeep} />
//               Export CSV
//             </button>

//             {permissions.create_hall && (
//               <button
//                 onClick={openCreate}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 8,
//                   background: ink, color: '#FBF6E8', border: 'none',
//                   padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
//                   cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
//                   transition: 'transform 0.15s, box-shadow 0.15s',
//                 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
//               >
//                 <Plus size={16} color={gold} />
//                 New Hall
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stat strip */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
//           {[
//             { label: 'Total Halls', value: totalHalls, icon: DoorOpen },
//             { label: 'Available', value: availableCount, icon: BadgeCheck, accent: '#3D7A45' },
//             { label: 'Occupied', value: occupiedCount, icon: CalendarClock, accent: '#B23B3B' },
//             { label: 'Total Bookings', value: totalBookings, icon: Users2 },
//           ].map(({ label, value, icon: Icon, accent }) => (
//             <div key={label} style={{
//               background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//               padding: '18px 20px', boxShadow: shadowCard,
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//                 <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
//                 <Icon size={16} color={accent || gold} />
//               </div>
//               <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 600, color: accent || ink }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Search + view toggle */}
//         <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
//           <div style={{
//             flex: '1 1 280px',
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
//             padding: 14, boxShadow: shadowCard,
//           }}>
//             <div style={{ position: 'relative' }}>
//               <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
//               <input
//                 type="text"
//                 placeholder="Search by name, code, or badge…"
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//                 style={{
//                   width: '100%', padding: '11px 14px 11px 42px', background: ivory,
//                   border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
//                   color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 2,
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
//             padding: 6, boxShadow: shadowCard, flexShrink: 0,
//           }}>
//             <button
//               onClick={() => setViewMode('table')}
//               title="Table view"
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
//                 fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
//                 background: viewMode === 'table' ? ink : 'transparent',
//                 color: viewMode === 'table' ? '#FBF6E8' : '#A39C8A',
//                 transition: 'all 0.15s',
//               }}
//             >
//               <Table2 size={15} color={viewMode === 'table' ? gold : '#A39C8A'} />
//               Table
//             </button>
//             <button
//               onClick={() => setViewMode('cards')}
//               title="Card view"
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
//                 fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
//                 background: viewMode === 'cards' ? ink : 'transparent',
//                 color: viewMode === 'cards' ? '#FBF6E8' : '#A39C8A',
//                 transition: 'all 0.15s',
//               }}
//             >
//               <LayoutGrid size={15} color={viewMode === 'cards' ? gold : '#A39C8A'} />
//               Cards
//             </button>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
//             <div style={{
//               width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
//               borderRadius: '50%', animation: 'hv-spin 0.8s linear infinite',
//             }} />
//             <style>{`@keyframes hv-spin { to { transform: rotate(360deg); } }`}</style>
//             <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading halls…</p>
//           </div>
//         )}

//         {/* Table or Cards */}
//         {!loading && filteredRecords.length > 0 && viewMode === 'table' && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             overflow: 'hidden', boxShadow: shadowCard,
//           }}>
//               <div style={{ overflowX: 'auto' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
//                   <thead>
//                     <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
//                       {['Hall', 'Code', 'Capacity', 'Badge', 'Status', 'Bookings', ''].map((h, i) => (
//                         <th key={i} style={{
//                           textAlign: i === 6 ? 'right' : 'left', padding: '14px 18px',
//                           fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
//                           color: '#8A8270', fontWeight: 700,
//                         }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRecords.map((h, idx) => (
//                       <tr
//                         key={h.id}
//                         style={{
//                           borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
//                           transition: 'background 0.15s',
//                         }}
//                         onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
//                         onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//                       >
//                         <td style={{ padding: '14px 18px' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                             {h.image ? (
//                               <img
//                                 src={h.image}
//                                 alt={h.name_en}
//                                 style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: `1px solid ${line}`, flexShrink: 0 }}
//                               />
//                             ) : (
//                               <div style={{
//                                 width: 44, height: 44, borderRadius: 10, flexShrink: 0,
//                                 background: ivory, border: `1px solid ${line}`,
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                               }}>
//                                 <DoorOpen size={18} color={gold} />
//                               </div>
//                             )}
//                             <div>
//                               <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>{h.name_en}</div>
//                               {h.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{h.name_ar}</div>}
//                             </div>
//                           </div>
//                         </td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <span style={{
//                             fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
//                             background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
//                           }}>{h.code_name}</span>
//                         </td>
//                         <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>{h.capacity}</td>
//                         <td style={{ padding: '14px 18px' }}>
//                           {h.badge ? (
//                             <span style={{
//                               fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
//                               border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
//                             }}>{h.badge}</span>
//                           ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
//                         </td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <StatusPill occupied={h.occupied} />
//                           {h.occupied && h.occupied_dates && (
//                             <div style={{ 
//                               marginTop: 6, 
//                               fontSize: 11.5, 
//                               color: '#B23B3B', 
//                               fontWeight: 500,
//                               background: 'rgba(178,59,59,0.06)',
//                               padding: '4px 8px',
//                               borderRadius: 6,
//                               display: 'inline-flex',
//                               alignItems: 'center',
//                               gap: 4,
//                             }}>
//                               <CalendarDays size={11} color="#B23B3B" />
//                               {h.occupied_dates}
//                             </div>
//                           )}
//                         </td>
//                         <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 600 }}>{h.booking_count ?? 0}</td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                             {permissions.update_hall && (
//                               <button
//                                 onClick={() => openEdit(h)}
//                                 title="Update"
//                                 style={{
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                   width: 34, height: 34, borderRadius: 9,
//                                   background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                                   color: goldDeep, cursor: 'pointer',
//                                 }}
//                               >
//                                 <Pencil size={14} />
//                               </button>
//                             )}
//                             {permissions.delete_hall && (
//                               <button
//                                 onClick={() => deleteHall(h)}
//                                 title="Delete"
//                                 style={{
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                   width: 34, height: 34, borderRadius: 9,
//                                   background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
//                                   color: '#B23B3B', cursor: 'pointer',
//                                 }}
//                               >
//                                 <Trash2 size={14} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div style={{
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
//                 }}>
//                   <span style={{ fontSize: 12, color: '#A39C8A' }}>
//                     Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
//                   </span>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                       disabled={currentPage === 1}
//                       style={{
//                         width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         border: `1px solid ${line}`, background: '#FFFFFF',
//                         color: currentPage === 1 ? '#D8D2C0' : ink,
//                         cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//                       }}
//                     >
//                       <ChevronLeft size={15} />
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                       disabled={currentPage === totalPages}
//                       style={{
//                         width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         border: `1px solid ${line}`, background: '#FFFFFF',
//                         color: currentPage === totalPages ? '#D8D2C0' : ink,
//                         cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//                       }}
//                     >
//                       <ChevronRight size={15} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//         )}

//         {/* Cards view */}
//         {!loading && filteredRecords.length > 0 && viewMode === 'cards' && (
//           <>
//             <div style={{
//               display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20,
//             }}>
//               {filteredRecords.map((h) => (
//                 <div
//                   key={h.id}
//                   style={{
//                     background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 20,
//                     padding: 20, boxShadow: shadowCard, transition: 'all 0.2s',
//                   }}
//                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = line; e.currentTarget.style.transform = ''; }}
//                 >
//                   <StatusPill occupied={h.occupied} />

//                   <div style={{ fontFamily: displayFont, fontSize: 15, color: gold, marginTop: 14, marginBottom: 2 }}>
//                     {h.name_en}
//                   </div>
//                   {h.name_ar && (
//                     <div style={{ fontSize: 21, fontWeight: 700, color: ink, marginBottom: 8 }}>{h.name_ar}</div>
//                   )}

//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#A39C8A', marginBottom: 10 }}>
//                     <MapPin size={13} color={gold} />
//                     {h.capacity}
//                   </div>

//                   {h.badge && (
//                     <div style={{
//                       display: 'inline-block', background: 'rgba(198,164,63,0.14)',
//                       padding: '4px 13px', borderRadius: 999, fontSize: 11.5, color: goldDeep,
//                       fontWeight: 600, marginBottom: 10,
//                     }}>
//                       {h.badge}
//                     </div>
//                   )}

//                   <div style={{
//                     display: 'flex', alignItems: 'center', gap: 8,
//                     background: h.occupied ? '#FBEAEA' : '#EAF4EA',
//                     padding: '10px 12px', borderRadius: 12, fontSize: 12.5, margin: '10px 0',
//                     color: h.occupied ? '#B23B3B' : '#3D7A45', fontWeight: 600,
//                   }}>
//                     {h.occupied ? (
//                       <>
//                         <CalendarDays size={14} />
//                         {h.occupied_dates ? h.occupied_dates : 'Currently occupied'}
//                       </>
//                     ) : (
//                       <>
//                         <CheckCircle2 size={14} />
//                         Available for booking
//                       </>
//                     )}
//                   </div>

//                   <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
//                     {permissions.update_hall && (
//                       <button
//                         onClick={() => openEdit(h)}
//                         style={{
//                           display: 'flex', alignItems: 'center', gap: 6,
//                           background: 'transparent', color: goldDeep, border: `1px solid ${line}`,
//                           borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                         }}
//                       >
//                         <Pencil size={12} /> Update
//                       </button>
//                     )}
//                     {permissions.delete_hall && (
//                       <button
//                         onClick={() => deleteHall(h)}
//                         style={{
//                           display: 'flex', alignItems: 'center', gap: 6,
//                           background: 'transparent', color: '#D9534F', border: '1px solid rgba(217,83,79,0.3)',
//                           borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                         }}
//                       >
//                         <Trash2 size={12} /> Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination (cards) */}
//             {totalPages > 1 && (
//               <div style={{
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 marginTop: 20, padding: '14px 20px', borderRadius: 14,
//                 border: `1px solid ${line}`, background: '#FFFFFF', boxShadow: shadowCard,
//               }}>
//                 <span style={{ fontSize: 12, color: '#A39C8A' }}>
//                   Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
//                 </span>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     style={{
//                       width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       border: `1px solid ${line}`, background: ivory,
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
//                       border: `1px solid ${line}`, background: ivory,
//                       color: currentPage === totalPages ? '#D8D2C0' : ink,
//                       cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//                     }}
//                   >
//                     <ChevronRight size={15} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Empty state */}
//         {!loading && filteredRecords.length === 0 && (
//             <div style={{
//               background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//               padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
//             }}>
//               <div style={{
//                 width: 64, height: 64, borderRadius: '50%', background: ivory,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
//               }}>
//                 <DoorOpen size={28} color={gold} />
//               </div>
//               <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No halls found</h3>
//               <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
//                 {searchTerm ? 'Try a different search term' : 'Add your first hall to get started'}
//               </p>
//               {permissions.create_hall && !searchTerm && (
//                 <button
//                   onClick={openCreate}
//                   style={{
//                     display: 'inline-flex', alignItems: 'center', gap: 8,
//                     background: ink, color: '#FBF6E8', border: 'none',
//                     padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                   }}
//                 >
//                   <Plus size={16} color={gold} />
//                   New Hall
//                 </button>
//               )}
//             </div>
//         )}
//       </div>

//       {/* Create / Edit modal */}
//       {modalOpen && (
//         <Modal
//           title={editingHall ? 'Update Hall' : 'New Hall'}
//           subtitle={editingHall ? `Editing "${editingHall.name_en}"` : 'Add a venue to your property'}
//           onClose={closeModal}
//           wide
//         >
//           <form onSubmit={saveHall}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Name (English)" required>
//                 <TextField
//                   value={form.name_en}
//                   onChange={(e) => setForm({ ...form, name_en: e.target.value })}
//                   placeholder="Gulf Hall"
//                 />
//               </FormGroup>
//               <FormGroup label="Name (Arabic)">
//                 <TextField
//                   value={form.name_ar}
//                   onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
//                   placeholder="القاعة"
//                   dir="rtl"
//                 />
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Code Name" required hint="Unique identifier, e.g. GULF-01">
//                 <TextField
//                   value={form.code_name}
//                   onChange={(e) => setForm({ ...form, code_name: e.target.value })}
//                   placeholder="GULF-01"
//                 />
//               </FormGroup>
//               <FormGroup label="Badge">
//                 <TextField
//                   value={form.badge}
//                   onChange={(e) => setForm({ ...form, badge: e.target.value })}
//                   placeholder="Most Popular"
//                 />
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Capacity" required hint='Display text, e.g. "700 Guests"'>
//                 <TextField
//                   value={form.capacity}
//                   onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//                   placeholder="700 Guests"
//                 />
//               </FormGroup>
//               <FormGroup label="Capacity (count)" hint="Numeric value, optional">
//                 <TextField
//                   type="number"
//                   min="0"
//                   value={form.capacity_count}
//                   onChange={(e) => setForm({ ...form, capacity_count: e.target.value })}
//                   placeholder="700"
//                 />
//               </FormGroup>
//             </div>

//             {editingHall && (
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//                 <FormGroup label="Status">
//                   <select
//                     style={inputStyle}
//                     value={form.occupied ? 'true' : 'false'}
//                     onChange={(e) => setForm({ ...form, occupied: e.target.value === 'true' })}
//                   >
//                     <option value="false">Available</option>
//                     <option value="true">Occupied</option>
//                   </select>
//                 </FormGroup>
//                 <FormGroup label="Occupied Dates">
//                   <TextField
//                     value={form.occupied_dates}
//                     onChange={(e) => setForm({ ...form, occupied_dates: e.target.value })}
//                     placeholder="Jan 15–18, 2026"
//                     disabled={!form.occupied}
//                   />
//                 </FormGroup>
//               </div>
//             )}

//             <FormGroup label="Hall Image">
//               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//                 <div style={{
//                   width: 64, height: 64, borderRadius: 12, flexShrink: 0,
//                   border: `1px dashed ${line}`, background: ivory,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
//                 }}>
//                   {imagePreview ? (
//                     <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : (
//                     <ImagePlus size={20} color="#C8C0AC" />
//                   )}
//                 </div>
//                 <label style={{
//                   cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: goldDeep,
//                   background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                   borderRadius: 9, padding: '9px 16px',
//                 }}>
//                   {imagePreview ? 'Change Image' : 'Upload Image'}
//                   <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
//                 </label>
//               </div>
//             </FormGroup>

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
//               {saving ? 'Saving…' : editingHall ? 'Save Changes' : 'Create Hall'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default HallsVenuesCom;






// 'use client';
// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Search, Plus, Pencil, Trash2, X, Users2, DoorOpen,
//   ImagePlus, BadgeCheck, CalendarClock, ChevronLeft, ChevronRight,
//   LayoutGrid, Table2, Download, MapPin, CalendarDays, CheckCircle2,
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

// const StatusPill = ({ occupied }) => (
//   <span
//     style={{
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
//       letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
//       background: occupied ? '#FBEAEA' : '#EAF4EA',
//       color: occupied ? '#B23B3B' : '#3D7A45',
//       border: `1px solid ${occupied ? 'rgba(178,59,59,0.18)' : 'rgba(61,122,69,0.18)'}`,
//     }}
//   >
//     <span style={{
//       width: 6, height: 6, borderRadius: '50%',
//       background: occupied ? '#B23B3B' : '#3D7A45',
//     }} />
//     {occupied ? 'Occupied' : 'Available'}
//   </span>
// );

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
//       value={value}
//       onChange={onChange}
//       onFocus={() => setFocused(true)}
//       onBlur={() => setFocused(false)}
//       {...rest}
//     />
//   );
// }

// /* Renders up to 2 upcoming non-cancelled bookings for a hall.
//    Backend now computes this live (see Hall.get_upcoming_bookings),
//    so it auto-clears once a booking's date has passed or it's cancelled. */
// function UpcomingDates({ bookings, size = 11.5 }) {
//   if (!bookings || bookings.length === 0) return null;
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
//       {bookings.map((b, i) => (
//         <div
//           key={i}
//           style={{
//             fontSize: size,
//             color: '#B23B3B',
//             fontWeight: 500,
//             background: 'rgba(178,59,59,0.06)',
//             padding: '4px 8px',
//             borderRadius: 6,
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: 4,
//             width: 'fit-content',
//           }}
//         >
//           <CalendarDays size={size} color="#B23B3B" />
//           {b.date} ({b.time_slot_display})
//         </div>
//       ))}
//     </div>
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
//         maxWidth: wide ? 640 : 520, maxHeight: '88vh', overflowY: 'auto',
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

// const HallsVenuesCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [records, setRecords] = useState([]);
//   const [count, setCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 10;
//   const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingHall, setEditingHall] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

//   // occupied / occupied_dates removed — status is now computed live on the
//   // backend from actual bookings (Hall.is_occupied_today / get_upcoming_bookings),
//   // so it's no longer something a user sets manually here.
//   const emptyForm = {
//     name_en: '', name_ar: '', code_name: '', capacity: '', capacity_count: '', badge: '',
//   };
//   const [form, setForm] = useState(emptyForm);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchHalls();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   const fetchHalls = async () => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/hall/', {
//         params: {
//           limit: recordsPerPage,
//           offset: (currentPage - 1) * recordsPerPage,
//         },
//       });

//       const payload = res?.data;
//       // Backend returns { message, count, data: [...] } — data is the array directly.
//       // Some endpoints nest it one level deeper as { data: { count, data: [...] } },
//       // so we check both shapes to be safe.
//       const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
//       const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

//       if (Array.isArray(list)) {
//         setRecords(list);
//         setCount(total ?? list.length);
//       } else {
//         console.error('Unexpected response structure:', res);
//         toast.error('Could not load halls');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       toast.error('Error fetching halls');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredRecords = useMemo(() => {
//     if (!Array.isArray(records)) return [];
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return records;
//     return records.filter((h) => {
//       const idMatch = h.id?.toString() === q;
//       const nameMatch = `${h.name_en || ''} ${h.name_ar || ''}`.toLowerCase().includes(q);
//       const codeMatch = h.code_name?.toLowerCase().includes(q);
//       const badgeMatch = h.badge?.toLowerCase().includes(q);
//       return idMatch || nameMatch || codeMatch || badgeMatch;
//     });
//   }, [records, searchTerm]);

//   const totalHalls = count;
//   const occupiedCount = records.filter((h) => h.occupied).length;
//   const availableCount = records.filter((h) => !h.occupied).length;
//   const totalBookings = records.reduce((sum, h) => sum + (h.booking_count || 0), 0);

//   /* ── Modal handlers ── */

//   const openCreate = () => {
//     setEditingHall(null);
//     setForm(emptyForm);
//     setImageFile(null);
//     setImagePreview(null);
//     setModalOpen(true);
//   };

//   const openEdit = (hall) => {
//     setEditingHall(hall);
//     setForm({
//       name_en: hall.name_en || '',
//       name_ar: hall.name_ar || '',
//       code_name: hall.code_name || '',
//       capacity: hall.capacity || '',
//       capacity_count: hall.capacity_count ?? '',
//       badge: hall.badge || '',
//     });
//     setImageFile(null);
//     setImagePreview(hall.image || null);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0] || null;
//     setImageFile(file);
//     if (file) setImagePreview(URL.createObjectURL(file));
//   };

//   const saveHall = async (e) => {
//     e.preventDefault();
//     if (!form.name_en.trim() || !form.code_name.trim() || !form.capacity.trim()) {
//       toast.error('Name (English), code name, and capacity are required');
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append('name_en', form.name_en);
//       formData.append('name_ar', form.name_ar);
//       formData.append('code_name', form.code_name);
//       formData.append('capacity', form.capacity);
//       if (form.capacity_count !== '') formData.append('capacity_count', form.capacity_count);
//       formData.append('badge', form.badge);
//       if (imageFile) formData.append('image', imageFile);

//       if (editingHall) {
//         await AxiosInstance.patch(`/api/hotel/v1/hall/?id=${editingHall.id}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('Hall updated successfully');
//       } else {
//         await AxiosInstance.post('/api/hotel/v1/hall/', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         toast.success('Hall created successfully');
//       }
//       setModalOpen(false);
//       setCurrentPage(1);
//       fetchHalls();
//     } catch (error) {
//       console.error('Error saving hall:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving hall';
//       toast.error(typeof msg === 'string' ? msg : 'Error saving hall');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteHall = async (hall) => {
//     if (!window.confirm(`Remove "${hall.name_en}"? This cannot be undone.`)) return;
//     try {
//       const res = await AxiosInstance.delete(`/api/hotel/v1/hall/?id=${hall.id}`);
//       if (res) {
//         toast.success('Hall deleted successfully');
//         setCurrentPage(1);
//         fetchHalls();
//       }
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : 'This hall has active bookings and cannot be deleted');
//     }
//   };

//   const exportCSV = () => {
//     if (!filteredRecords.length) {
//       toast.error('No halls to export');
//       return;
//     }
//     const headers = ['ID', 'Name (EN)', 'Name (AR)', 'Code Name', 'Capacity', 'Capacity Count', 'Badge', 'Status', 'Upcoming Dates', 'Booking Count'];
//     const escape = (val) => {
//       const s = val === null || val === undefined ? '' : String(val);
//       return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
//     };
//     const formatUpcoming = (h) =>
//       (h.upcoming_occupied_dates || [])
//         .map((b) => `${b.date} (${b.time_slot_display})`)
//         .join(' | ');
//     const rows = filteredRecords.map((h) => [
//       h.id, h.name_en, h.name_ar, h.code_name, h.capacity, h.capacity_count,
//       h.badge, h.occupied ? 'Occupied' : 'Available', formatUpcoming(h), h.booking_count ?? 0,
//     ]);
//     const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     const stamp = new Date().toISOString().slice(0, 10);
//     link.href = url;
//     link.download = `halls-export-${stamp}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success('CSV exported');
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
//               Venue Management
//             </div>
//             <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//               Halls &amp; Venues
//             </h1>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <button
//               onClick={exportCSV}
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 8,
//                 background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
//                 padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
//                 cursor: 'pointer', letterSpacing: '0.02em', boxShadow: shadowCard,
//               }}
//             >
//               <Download size={15} color={goldDeep} />
//               Export CSV
//             </button>

//             {permissions.create_hall && (
//               <button
//                 onClick={openCreate}
//                 style={{
//                   display: 'flex', alignItems: 'center', gap: 8,
//                   background: ink, color: '#FBF6E8', border: 'none',
//                   padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
//                   cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
//                   transition: 'transform 0.15s, box-shadow 0.15s',
//                 }}
//                 onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
//                 onMouseLeave={(e) => { e.currentTarget.style.transform = ''; }}
//               >
//                 <Plus size={16} color={gold} />
//                 New Hall
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stat strip */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
//           {[
//             { label: 'Total Halls', value: totalHalls, icon: DoorOpen },
//             { label: 'Available', value: availableCount, icon: BadgeCheck, accent: '#3D7A45' },
//             { label: 'Occupied', value: occupiedCount, icon: CalendarClock, accent: '#B23B3B' },
//             { label: 'Total Bookings', value: totalBookings, icon: Users2 },
//           ].map(({ label, value, icon: Icon, accent }) => (
//             <div key={label} style={{
//               background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
//               padding: '18px 20px', boxShadow: shadowCard,
//             }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
//                 <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
//                 <Icon size={16} color={accent || gold} />
//               </div>
//               <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 600, color: accent || ink }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Search + view toggle */}
//         <div style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
//           <div style={{
//             flex: '1 1 280px',
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
//             padding: 14, boxShadow: shadowCard,
//           }}>
//             <div style={{ position: 'relative' }}>
//               <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
//               <input
//                 type="text"
//                 placeholder="Search by name, code, or badge…"
//                 value={searchTerm}
//                 onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
//                 style={{
//                   width: '100%', padding: '11px 14px 11px 42px', background: ivory,
//                   border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
//                   color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{
//             display: 'flex', alignItems: 'center', gap: 2,
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
//             padding: 6, boxShadow: shadowCard, flexShrink: 0,
//           }}>
//             <button
//               onClick={() => setViewMode('table')}
//               title="Table view"
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
//                 fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
//                 background: viewMode === 'table' ? ink : 'transparent',
//                 color: viewMode === 'table' ? '#FBF6E8' : '#A39C8A',
//                 transition: 'all 0.15s',
//               }}
//             >
//               <Table2 size={15} color={viewMode === 'table' ? gold : '#A39C8A'} />
//               Table
//             </button>
//             <button
//               onClick={() => setViewMode('cards')}
//               title="Card view"
//               style={{
//                 display: 'flex', alignItems: 'center', gap: 7,
//                 padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
//                 fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
//                 background: viewMode === 'cards' ? ink : 'transparent',
//                 color: viewMode === 'cards' ? '#FBF6E8' : '#A39C8A',
//                 transition: 'all 0.15s',
//               }}
//             >
//               <LayoutGrid size={15} color={viewMode === 'cards' ? gold : '#A39C8A'} />
//               Cards
//             </button>
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
//             <div style={{
//               width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
//               borderRadius: '50%', animation: 'hv-spin 0.8s linear infinite',
//             }} />
//             <style>{`@keyframes hv-spin { to { transform: rotate(360deg); } }`}</style>
//             <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading halls…</p>
//           </div>
//         )}

//         {/* Table or Cards */}
//         {!loading && filteredRecords.length > 0 && viewMode === 'table' && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             overflow: 'hidden', boxShadow: shadowCard,
//           }}>
//               <div style={{ overflowX: 'auto' }}>
//                 <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
//                   <thead>
//                     <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
//                       {['ID', 'Hall', 'Code', 'Capacity', 'Badge', 'Status', 'Bookings', ''].map((h, i) => (
//                         <th key={i} style={{
//                           textAlign: i === 7 ? 'right' : 'left', padding: '14px 18px',
//                           fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
//                           color: '#8A8270', fontWeight: 700,
//                         }}>{h}</th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredRecords.map((h, idx) => (
//                       <tr
//                         key={h.id}
//                         style={{
//                           borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
//                           transition: 'background 0.15s',
//                         }}
//                         onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
//                         onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//                       >
//                       <td style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
//                         #{h.id}
//                       </td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                             {h.image ? (
//                               <img
//                                 src={h.image}
//                                 alt={h.name_en}
//                                 style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: `1px solid ${line}`, flexShrink: 0 }}
//                               />
//                             ) : (
//                               <div style={{
//                                 width: 44, height: 44, borderRadius: 10, flexShrink: 0,
//                                 background: ivory, border: `1px solid ${line}`,
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                               }}>
//                                 <DoorOpen size={18} color={gold} />
//                               </div>
//                             )}
//                             <div>
//                               <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>{h.name_en}</div>
//                               {h.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{h.name_ar}</div>}
//                             </div>
//                           </div>
//                         </td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <span style={{
//                             fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
//                             background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
//                           }}>{h.code_name}</span>
//                         </td>
//                         <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>{h.capacity}</td>
//                         <td style={{ padding: '14px 18px' }}>
//                           {h.badge ? (
//                             <span style={{
//                               fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
//                               border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
//                             }}>{h.badge}</span>
//                           ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
//                         </td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <StatusPill occupied={h.occupied} />
//                           <div style={{ marginTop: 6 }}>
//                             <UpcomingDates bookings={h.upcoming_occupied_dates} />
//                           </div>
//                         </td>
//                         <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 600 }}>{h.booking_count ?? 0}</td>
//                         <td style={{ padding: '14px 18px' }}>
//                           <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                             {permissions.update_hall && (
//                               <button
//                                 onClick={() => openEdit(h)}
//                                 title="Update"
//                                 style={{
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                   width: 34, height: 34, borderRadius: 9,
//                                   background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                                   color: goldDeep, cursor: 'pointer',
//                                 }}
//                               >
//                                 <Pencil size={14} />
//                               </button>
//                             )}
//                             {permissions.delete_hall && (
//                               <button
//                                 onClick={() => deleteHall(h)}
//                                 title="Delete"
//                                 style={{
//                                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                   width: 34, height: 34, borderRadius: 9,
//                                   background: 'rgba(178,59,59,0.08)', border: '1px solid rgba(178,59,59,0.22)',
//                                   color: '#B23B3B', cursor: 'pointer',
//                                 }}
//                               >
//                                 <Trash2 size={14} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination */}
//               {totalPages > 1 && (
//                 <div style={{
//                   display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                   padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
//                 }}>
//                   <span style={{ fontSize: 12, color: '#A39C8A' }}>
//                     Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
//                   </span>
//                   <div style={{ display: 'flex', gap: 6 }}>
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                       disabled={currentPage === 1}
//                       style={{
//                         width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         border: `1px solid ${line}`, background: '#FFFFFF',
//                         color: currentPage === 1 ? '#D8D2C0' : ink,
//                         cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
//                       }}
//                     >
//                       <ChevronLeft size={15} />
//                     </button>
//                     <button
//                       onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                       disabled={currentPage === totalPages}
//                       style={{
//                         width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         border: `1px solid ${line}`, background: '#FFFFFF',
//                         color: currentPage === totalPages ? '#D8D2C0' : ink,
//                         cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//                       }}
//                     >
//                       <ChevronRight size={15} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//         )}

//         {/* Cards view */}
//         {!loading && filteredRecords.length > 0 && viewMode === 'cards' && (
//           <>
//             <div style={{
//               display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20,
//             }}>
//               {filteredRecords.map((h) => (
//                 <div
//                   key={h.id}
//                   style={{
//                     background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 20,
//                     padding: 20, boxShadow: shadowCard, transition: 'all 0.2s',
//                   }}
//                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
//                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = line; e.currentTarget.style.transform = ''; }}
//                 >
//                   <StatusPill occupied={h.occupied} />

//                   <div style={{ fontFamily: displayFont, fontSize: 15, color: gold, marginTop: 14, marginBottom: 2 }}>
//                     {h.name_en}
//                   </div>
//                   {h.name_ar && (
//                     <div style={{ fontSize: 21, fontWeight: 700, color: ink, marginBottom: 8 }}>{h.name_ar}</div>
//                   )}

//                   <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#A39C8A', marginBottom: 10 }}>
//                     <MapPin size={13} color={gold} />
//                     {h.capacity}
//                   </div>

//                   {h.badge && (
//                     <div style={{
//                       display: 'inline-block', background: 'rgba(198,164,63,0.14)',
//                       padding: '4px 13px', borderRadius: 999, fontSize: 11.5, color: goldDeep,
//                       fontWeight: 600, marginBottom: 10,
//                     }}>
//                       {h.badge}
//                     </div>
//                   )}

//                   <div style={{
//                     display: 'flex', flexDirection: 'column', gap: 6,
//                     background: h.occupied ? '#FBEAEA' : '#EAF4EA',
//                     padding: '10px 12px', borderRadius: 12, fontSize: 12.5, margin: '10px 0',
//                     color: h.occupied ? '#B23B3B' : '#3D7A45', fontWeight: 600,
//                   }}>
//                     {h.upcoming_occupied_dates && h.upcoming_occupied_dates.length > 0 ? (
//                       h.upcoming_occupied_dates.map((b, i) => (
//                         <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                           <CalendarDays size={14} />
//                           {b.date} ({b.time_slot_display})
//                         </div>
//                       ))
//                     ) : (
//                       <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
//                         <CheckCircle2 size={14} />
//                         Available for booking
//                       </div>
//                     )}
//                   </div>

//                   <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
//                     {permissions.update_hall && (
//                       <button
//                         onClick={() => openEdit(h)}
//                         style={{
//                           display: 'flex', alignItems: 'center', gap: 6,
//                           background: 'transparent', color: goldDeep, border: `1px solid ${line}`,
//                           borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                         }}
//                       >
//                         <Pencil size={12} /> Update
//                       </button>
//                     )}
//                     {permissions.delete_hall && (
//                       <button
//                         onClick={() => deleteHall(h)}
//                         style={{
//                           display: 'flex', alignItems: 'center', gap: 6,
//                           background: 'transparent', color: '#D9534F', border: '1px solid rgba(217,83,79,0.3)',
//                           borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
//                         }}
//                       >
//                         <Trash2 size={12} /> Delete
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Pagination (cards) */}
//             {totalPages > 1 && (
//               <div style={{
//                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//                 marginTop: 20, padding: '14px 20px', borderRadius: 14,
//                 border: `1px solid ${line}`, background: '#FFFFFF', boxShadow: shadowCard,
//               }}>
//                 <span style={{ fontSize: 12, color: '#A39C8A' }}>
//                   Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
//                 </span>
//                 <div style={{ display: 'flex', gap: 6 }}>
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                     disabled={currentPage === 1}
//                     style={{
//                       width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       border: `1px solid ${line}`, background: ivory,
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
//                       border: `1px solid ${line}`, background: ivory,
//                       color: currentPage === totalPages ? '#D8D2C0' : ink,
//                       cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
//                     }}
//                   >
//                     <ChevronRight size={15} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Empty state */}
//         {!loading && filteredRecords.length === 0 && (
//             <div style={{
//               background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//               padding: '70px 20px', textAlign: 'center', boxShadow: shadowCard,
//             }}>
//               <div style={{
//                 width: 64, height: 64, borderRadius: '50%', background: ivory,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
//               }}>
//                 <DoorOpen size={28} color={gold} />
//               </div>
//               <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No halls found</h3>
//               <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
//                 {searchTerm ? 'Try a different search term' : 'Add your first hall to get started'}
//               </p>
//               {permissions.create_hall && !searchTerm && (
//                 <button
//                   onClick={openCreate}
//                   style={{
//                     display: 'inline-flex', alignItems: 'center', gap: 8,
//                     background: ink, color: '#FBF6E8', border: 'none',
//                     padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                   }}
//                 >
//                   <Plus size={16} color={gold} />
//                   New Hall
//                 </button>
//               )}
//             </div>
//         )}
//       </div>

//       {/* Create / Edit modal */}
//       {modalOpen && (
//         <Modal
//           title={editingHall ? 'Update Hall' : 'New Hall'}
//           subtitle={editingHall ? `Editing "${editingHall.name_en}"` : 'Add a venue to your property'}
//           onClose={closeModal}
//           wide
//         >
//           <form onSubmit={saveHall}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Name (English)" required>
//                 <TextField
//                   value={form.name_en}
//                   onChange={(e) => setForm({ ...form, name_en: e.target.value })}
//                   placeholder="Gulf Hall"
//                 />
//               </FormGroup>
//               <FormGroup label="Name (Arabic)">
//                 <TextField
//                   value={form.name_ar}
//                   onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
//                   placeholder="القاعة"
//                   dir="rtl"
//                 />
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Code Name" required hint="Unique identifier, e.g. GULF-01">
//                 <TextField
//                   value={form.code_name}
//                   onChange={(e) => setForm({ ...form, code_name: e.target.value })}
//                   placeholder="GULF-01"
//                 />
//               </FormGroup>
//               <FormGroup label="Badge">
//                 <TextField
//                   value={form.badge}
//                   onChange={(e) => setForm({ ...form, badge: e.target.value })}
//                   placeholder="Most Popular"
//                 />
//               </FormGroup>
//             </div>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Capacity" required hint='Display text, e.g. "700 Guests"'>
//                 <TextField
//                   value={form.capacity}
//                   onChange={(e) => setForm({ ...form, capacity: e.target.value })}
//                   placeholder="700 Guests"
//                 />
//               </FormGroup>
//               <FormGroup label="Capacity (count)" hint="Numeric value, optional">
//                 <TextField
//                   type="number"
//                   min="0"
//                   value={form.capacity_count}
//                   onChange={(e) => setForm({ ...form, capacity_count: e.target.value })}
//                   placeholder="700"
//                 />
//               </FormGroup>
//             </div>

//             {/* Status / Occupied Dates fields removed — occupancy is now computed
//                 live from Booking records on the backend and is read-only here.
//                 To change a hall's status, create/cancel a booking instead. */}
//             {editingHall && (
//               <FormGroup label="Current Status" hint="Computed from active bookings — create or cancel a booking to change this">
//                 <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                   <StatusPill occupied={!!editingHall.occupied} />
//                   <UpcomingDates bookings={editingHall.upcoming_occupied_dates} size={12} />
//                 </div>
//               </FormGroup>
//             )}

//             <FormGroup label="Hall Image">
//               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//                 <div style={{
//                   width: 64, height: 64, borderRadius: 12, flexShrink: 0,
//                   border: `1px dashed ${line}`, background: ivory,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
//                 }}>
//                   {imagePreview ? (
//                     <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : (
//                     <ImagePlus size={20} color="#C8C0AC" />
//                   )}
//                 </div>
//                 <label style={{
//                   cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: goldDeep,
//                   background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                   borderRadius: 9, padding: '9px 16px',
//                 }}>
//                   {imagePreview ? 'Change Image' : 'Upload Image'}
//                   <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
//                 </label>
//               </div>
//             </FormGroup>

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
//               {saving ? 'Saving…' : editingHall ? 'Save Changes' : 'Create Hall'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default HallsVenuesCom;






// Mobile Responsive Version
'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, Users2, DoorOpen,
  ImagePlus, BadgeCheck, CalendarClock, ChevronLeft, ChevronRight,
  LayoutGrid, Table2, Download, MapPin, CalendarDays, CheckCircle2,
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
    .hv-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .hv-header { flex-direction: column !important; align-items: flex-start !important; }
    .hv-title { font-size: 28px !important; }
    .hv-header-actions { width: 100% !important; }
    .hv-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .hv-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    .hv-searchbar-row { flex-direction: column !important; }
    .hv-viewtoggle { width: 100% !important; }
    .hv-viewtoggle button { flex: 1 1 50% !important; justify-content: center !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .hv-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .hv-table thead { display: none !important; }
    .hv-table, .hv-table tbody, .hv-table tr, .hv-table td {
      display: block !important; width: 100% !important;
    }
    .hv-table { min-width: 0 !important; }
    .hv-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .hv-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .hv-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .hv-table td[data-label='Hall'] { align-items: flex-start !important; }
    .hv-table td[data-label='Hall'] .hv-hall-col { justify-content: flex-end !important; text-align: right !important; }
    .hv-table td[data-label=''] { justify-content: flex-end !important; }
    .hv-table td[data-label='']::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .hv-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

const StatusPill = ({ occupied }) => (
  <span
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
      background: occupied ? '#FBEAEA' : '#EAF4EA',
      color: occupied ? '#B23B3B' : '#3D7A45',
      border: `1px solid ${occupied ? 'rgba(178,59,59,0.18)' : 'rgba(61,122,69,0.18)'}`,
    }}
  >
    <span style={{
      width: 6, height: 6, borderRadius: '50%',
      background: occupied ? '#B23B3B' : '#3D7A45',
    }} />
    {occupied ? 'Occupied' : 'Available'}
  </span>
);

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
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

/* Renders up to 2 upcoming non-cancelled bookings for a hall.
   Backend now computes this live (see Hall.get_upcoming_bookings),
   so it auto-clears once a booking's date has passed or it's cancelled. */
function UpcomingDates({ bookings, size = 11.5 }) {
  if (!bookings || bookings.length === 0) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {bookings.map((b, i) => (
        <div
          key={i}
          style={{
            fontSize: size,
            color: '#B23B3B',
            fontWeight: 500,
            background: 'rgba(178,59,59,0.06)',
            padding: '4px 8px',
            borderRadius: 6,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            width: 'fit-content',
          }}
        >
          <CalendarDays size={size} color="#B23B3B" />
          {b.date} ({b.time_slot_display})
        </div>
      ))}
    </div>
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
        maxWidth: wide ? 640 : 520, maxHeight: '88vh', overflowY: 'auto',
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

const HallsVenuesCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // occupied / occupied_dates removed — status is now computed live on the
  // backend from actual bookings (Hall.is_occupied_today / get_upcoming_bookings),
  // so it's no longer something a user sets manually here.
  const emptyForm = {
    name_en: '', name_ar: '', code_name: '', capacity: '', capacity_count: '', badge: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchHalls = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/hall/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      // Backend returns { message, count, data: [...] } — data is the array directly.
      // Some endpoints nest it one level deeper as { data: { count, data: [...] } },
      // so we check both shapes to be safe.
      const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
      const total = Array.isArray(payload?.data) ? payload.count : payload?.data?.count;

      if (Array.isArray(list)) {
        setRecords(list);
        setCount(total ?? list.length);
      } else {
        console.error('Unexpected response structure:', res);
        toast.error('Could not load halls');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching halls');
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((h) => {
      const idMatch = h.id?.toString() === q;
      const nameMatch = `${h.name_en || ''} ${h.name_ar || ''}`.toLowerCase().includes(q);
      const codeMatch = h.code_name?.toLowerCase().includes(q);
      const badgeMatch = h.badge?.toLowerCase().includes(q);
      return idMatch || nameMatch || codeMatch || badgeMatch;
    });
  }, [records, searchTerm]);

  const totalHalls = count;
  const occupiedCount = records.filter((h) => h.occupied).length;
  const availableCount = records.filter((h) => !h.occupied).length;
  const totalBookings = records.reduce((sum, h) => sum + (h.booking_count || 0), 0);

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingHall(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (hall) => {
    setEditingHall(hall);
    setForm({
      name_en: hall.name_en || '',
      name_ar: hall.name_ar || '',
      code_name: hall.code_name || '',
      capacity: hall.capacity || '',
      capacity_count: hall.capacity_count ?? '',
      badge: hall.badge || '',
    });
    setImageFile(null);
    setImagePreview(hall.image || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const saveHall = async (e) => {
    e.preventDefault();
    if (!form.name_en.trim() || !form.code_name.trim() || !form.capacity.trim()) {
      toast.error('Name (English), code name, and capacity are required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name_en', form.name_en);
      formData.append('name_ar', form.name_ar);
      formData.append('code_name', form.code_name);
      formData.append('capacity', form.capacity);
      if (form.capacity_count !== '') formData.append('capacity_count', form.capacity_count);
      formData.append('badge', form.badge);
      if (imageFile) formData.append('image', imageFile);

      if (editingHall) {
        await AxiosInstance.patch(`/api/hotel/v1/hall/?id=${editingHall.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Hall updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/hall/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Hall created successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchHalls();
    } catch (error) {
      console.error('Error saving hall:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving hall';
      toast.error(typeof msg === 'string' ? msg : 'Error saving hall');
    } finally {
      setSaving(false);
    }
  };

  const deleteHall = async (hall) => {
    if (!window.confirm(`Remove "${hall.name_en}"? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/hall/?id=${hall.id}`);
      if (res) {
        toast.success('Hall deleted successfully');
        setCurrentPage(1);
        fetchHalls();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'This hall has active bookings and cannot be deleted');
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No halls to export');
      return;
    }
    const headers = ['ID', 'Name (EN)', 'Name (AR)', 'Code Name', 'Capacity', 'Capacity Count', 'Badge', 'Status', 'Upcoming Dates', 'Booking Count'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const formatUpcoming = (h) =>
      (h.upcoming_occupied_dates || [])
        .map((b) => `${b.date} (${b.time_slot_display})`)
        .join(' | ');
    const rows = filteredRecords.map((h) => [
      h.id, h.name_en, h.name_ar, h.code_name, h.capacity, h.capacity_count,
      h.badge, h.occupied ? 'Occupied' : 'Available', formatUpcoming(h), h.booking_count ?? 0,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `halls-export-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', maxWidth: '100vw', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont, overflowX: 'hidden', boxSizing: 'border-box' }}>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />
      <style>{responsiveStyles}</style>

      <div className="hv-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="hv-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Venue Management
            </div>
            <h1 className="hv-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Halls &amp; Venues
            </h1>
          </div>

          <div className="hv-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em', boxShadow: shadowCard,
              }}
            >
              <Download size={15} color={goldDeep} />
              Export CSV
            </button>

            {permissions.create_hall && (
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
                New Hall
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="hv-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Halls', value: totalHalls, icon: DoorOpen },
            { label: 'Available', value: availableCount, icon: BadgeCheck, accent: '#3D7A45' },
            { label: 'Occupied', value: occupiedCount, icon: CalendarClock, accent: '#B23B3B' },
            { label: 'Total Bookings', value: totalBookings, icon: Users2 },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div style={{ fontFamily: displayFont, fontSize: 30, fontWeight: 600, color: accent || ink }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Search + view toggle */}
        <div className="hv-searchbar-row" style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 280px',
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
            padding: 14, boxShadow: shadowCard,
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name, code, or badge…"
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

          <div className="hv-viewtoggle" style={{
            display: 'flex', alignItems: 'center', gap: 2,
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
            padding: 6, boxShadow: shadowCard, flexShrink: 0,
          }}>
            <button
              onClick={() => setViewMode('table')}
              title="Table view"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
                background: viewMode === 'table' ? ink : 'transparent',
                color: viewMode === 'table' ? '#FBF6E8' : '#A39C8A',
                transition: 'all 0.15s',
              }}
            >
              <Table2 size={15} color={viewMode === 'table' ? gold : '#A39C8A'} />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              title="Card view"
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '10px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                fontSize: 12.5, fontWeight: 600, fontFamily: bodyFont,
                background: viewMode === 'cards' ? ink : 'transparent',
                color: viewMode === 'cards' ? '#FBF6E8' : '#A39C8A',
                transition: 'all 0.15s',
              }}
            >
              <LayoutGrid size={15} color={viewMode === 'cards' ? gold : '#A39C8A'} />
              Cards
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
              borderRadius: '50%', animation: 'hv-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes hv-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading halls…</p>
          </div>
        )}

        {/* Table or Cards */}
        {!loading && filteredRecords.length > 0 && viewMode === 'table' && (
          <div className="hv-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="hv-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
                  <thead>
                    <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                      {['ID', 'Hall', 'Code', 'Capacity', 'Badge', 'Status', 'Bookings', ''].map((h, i) => (
                        <th key={i} style={{
                          textAlign: i === 7 ? 'right' : 'left', padding: '14px 18px',
                          fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: '#8A8270', fontWeight: 700,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((h, idx) => (
                      <tr
                        key={h.id}
                        style={{
                          borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{h.id}
                      </td>
                        <td data-label="Hall" style={{ padding: '14px 18px' }}>
                          <div className="hv-hall-col" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {h.image ? (
                              <img
                                src={h.image}
                                alt={h.name_en}
                                style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover', border: `1px solid ${line}`, flexShrink: 0 }}
                              />
                            ) : (
                              <div style={{
                                width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                                background: ivory, border: `1px solid ${line}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                <DoorOpen size={18} color={gold} />
                              </div>
                            )}
                            <div>
                              <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>{h.name_en}</div>
                              {h.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{h.name_ar}</div>}
                            </div>
                          </div>
                        </td>
                        <td data-label="Code" style={{ padding: '14px 18px' }}>
                          <span style={{
                            fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                            background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          }}>{h.code_name}</span>
                        </td>
                        <td data-label="Capacity" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>{h.capacity}</td>
                        <td data-label="Badge" style={{ padding: '14px 18px' }}>
                          {h.badge ? (
                            <span style={{
                              fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
                              border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
                            }}>{h.badge}</span>
                          ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
                        </td>
                        <td data-label="Status" style={{ padding: '14px 18px' }}>
                          <StatusPill occupied={h.occupied} />
                          <div style={{ marginTop: 6 }}>
                            <UpcomingDates bookings={h.upcoming_occupied_dates} />
                          </div>
                        </td>
                        <td data-label="Bookings" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 600 }}>{h.booking_count ?? 0}</td>
                        <td data-label="" style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            {permissions.update_hall && (
                              <button
                                onClick={() => openEdit(h)}
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
                            {permissions.delete_hall && (
                              <button
                                onClick={() => deleteHall(h)}
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
                <div className="hv-pagination" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
                }}>
                  <span style={{ fontSize: 12, color: '#A39C8A' }}>
                    Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
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

        {/* Cards view */}
        {!loading && filteredRecords.length > 0 && viewMode === 'cards' && (
          <>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20,
            }}>
              {filteredRecords.map((h) => (
                <div
                  key={h.id}
                  style={{
                    background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 20,
                    padding: 20, boxShadow: shadowCard, transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = line; e.currentTarget.style.transform = ''; }}
                >
                  <StatusPill occupied={h.occupied} />

                  <div style={{ fontFamily: displayFont, fontSize: 15, color: gold, marginTop: 14, marginBottom: 2 }}>
                    {h.name_en}
                  </div>
                  {h.name_ar && (
                    <div style={{ fontSize: 21, fontWeight: 700, color: ink, marginBottom: 8 }}>{h.name_ar}</div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#A39C8A', marginBottom: 10 }}>
                    <MapPin size={13} color={gold} />
                    {h.capacity}
                  </div>

                  {h.badge && (
                    <div style={{
                      display: 'inline-block', background: 'rgba(198,164,63,0.14)',
                      padding: '4px 13px', borderRadius: 999, fontSize: 11.5, color: goldDeep,
                      fontWeight: 600, marginBottom: 10,
                    }}>
                      {h.badge}
                    </div>
                  )}

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 6,
                    background: h.occupied ? '#FBEAEA' : '#EAF4EA',
                    padding: '10px 12px', borderRadius: 12, fontSize: 12.5, margin: '10px 0',
                    color: h.occupied ? '#B23B3B' : '#3D7A45', fontWeight: 600,
                  }}>
                    {h.upcoming_occupied_dates && h.upcoming_occupied_dates.length > 0 ? (
                      h.upcoming_occupied_dates.map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <CalendarDays size={14} />
                          {b.date} ({b.time_slot_display})
                        </div>
                      ))
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <CheckCircle2 size={14} />
                        Available for booking
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    {permissions.update_hall && (
                      <button
                        onClick={() => openEdit(h)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'transparent', color: goldDeep, border: `1px solid ${line}`,
                          borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        <Pencil size={12} /> Update
                      </button>
                    )}
                    {permissions.delete_hall && (
                      <button
                        onClick={() => deleteHall(h)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'transparent', color: '#D9534F', border: '1px solid rgba(217,83,79,0.3)',
                          borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination (cards) */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                marginTop: 20, padding: '14px 20px', borderRadius: 14,
                border: `1px solid ${line}`, background: '#FFFFFF', boxShadow: shadowCard,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} hall{count !== 1 ? 's' : ''}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${line}`, background: ivory,
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
                      border: `1px solid ${line}`, background: ivory,
                      color: currentPage === totalPages ? '#D8D2C0' : ink,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </>
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
                <DoorOpen size={28} color={gold} />
              </div>
              <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No halls found</h3>
              <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
                {searchTerm ? 'Try a different search term' : 'Add your first hall to get started'}
              </p>
              {permissions.create_hall && !searchTerm && (
                <button
                  onClick={openCreate}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: ink, color: '#FBF6E8', border: 'none',
                    padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <Plus size={16} color={gold} />
                  New Hall
                </button>
              )}
            </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingHall ? 'Update Hall' : 'New Hall'}
          subtitle={editingHall ? `Editing "${editingHall.name_en}"` : 'Add a venue to your property'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveHall}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Name (English)" required>
                <TextField
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  placeholder="Gulf Hall"
                />
              </FormGroup>
              <FormGroup label="Name (Arabic)">
                <TextField
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  placeholder="القاعة"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Code Name" required hint="Unique identifier, e.g. GULF-01">
                <TextField
                  value={form.code_name}
                  onChange={(e) => setForm({ ...form, code_name: e.target.value })}
                  placeholder="GULF-01"
                />
              </FormGroup>
              <FormGroup label="Badge">
                <TextField
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Most Popular"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Capacity" required hint='Display text, e.g. "700 Guests"'>
                <TextField
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="700 Guests"
                />
              </FormGroup>
              <FormGroup label="Capacity (count)" hint="Numeric value, optional">
                <TextField
                  type="number"
                  min="0"
                  value={form.capacity_count}
                  onChange={(e) => setForm({ ...form, capacity_count: e.target.value })}
                  placeholder="700"
                />
              </FormGroup>
            </div>

            {/* Status / Occupied Dates fields removed — occupancy is now computed
                live from Booking records on the backend and is read-only here.
                To change a hall's status, create/cancel a booking instead. */}
            {editingHall && (
              <FormGroup label="Current Status" hint="Computed from active bookings — create or cancel a booking to change this">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <StatusPill occupied={!!editingHall.occupied} />
                  <UpcomingDates bookings={editingHall.upcoming_occupied_dates} size={12} />
                </div>
              </FormGroup>
            )}

            <FormGroup label="Hall Image">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 12, flexShrink: 0,
                  border: `1px dashed ${line}`, background: ivory,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImagePlus size={20} color="#C8C0AC" />
                  )}
                </div>
                <label style={{
                  cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: goldDeep,
                  background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
                  borderRadius: 9, padding: '9px 16px',
                }}>
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
              </div>
            </FormGroup>

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
              {saving ? 'Saving…' : editingHall ? 'Save Changes' : 'Create Hall'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HallsVenuesCom;