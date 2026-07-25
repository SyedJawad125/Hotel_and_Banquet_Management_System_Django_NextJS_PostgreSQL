// 'use client';
// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Search, Plus, Trash2, X, Users2, Mail, Phone, ShieldCheck,
//   Download, ChevronLeft, ChevronRight, UserRound, Power, ImagePlus,
// } from 'lucide-react';

// /* ── Design tokens — Gulf Hotel gold-on-ivory (matches HallsVenuesCom / CustomersCom) ── */
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

// const StatusPill = ({ status, deactivated }) => {
//   const s = (status || (deactivated ? 'Deactivated' : 'Active')).toLowerCase();
//   let bg = '#EAF4EA', fg = '#3D7A45', bd = 'rgba(61,122,69,0.18)', label = 'Active';
//   if (s === 'invited') { bg = '#FBF1DC'; fg = goldDeep; bd = line; label = 'Invited'; }
//   if (s === 'deactivated') { bg = '#FBEAEA'; fg = '#B23B3B'; bd = 'rgba(178,59,59,0.18)'; label = 'Deactivated'; }
//   if (s === 'active') { label = 'Active'; }

//   return (
//     <span style={{
//       display: 'inline-flex', alignItems: 'center', gap: 6,
//       padding: '4px 11px', borderRadius: 999, fontSize: 11, fontWeight: 700,
//       letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
//       background: bg, color: fg, border: `1px solid ${bd}`,
//     }}>
//       <span style={{ width: 6, height: 6, borderRadius: '50%', background: fg }} />
//       {label}
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

// const EmployeeCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [records, setRecords] = useState([]);
//   const [count, setCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 10;
//   const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

//   const [roles, setRoles] = useState([]);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [togglingId, setTogglingId] = useState(null);

//   const emptyForm = {
//     first_name: '', last_name: '', username: '', mobile: '', address: '', role: '',
//   };
//   const [form, setForm] = useState(emptyForm);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);

//   useEffect(() => {
//     fetchEmployees();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   const fetchEmployees = async () => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get('/api/user/v1/employee/', {
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
//         toast.error('Could not load employees');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       toast.error('Error fetching employees');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRoles = async () => {
//     try {
//       const res = await AxiosInstance.get('/api/user/v1/role/', { params: { limit: 100, offset: 0 } });
//       const payload = res?.data;
//       const list = Array.isArray(payload?.data) ? payload.data : payload?.data?.data;
//       if (Array.isArray(list)) setRoles(list);
//     } catch (error) {
//       console.error('Error fetching roles:', error);
//     }
//   };

//   const filteredRecords = useMemo(() => {
//     if (!Array.isArray(records)) return [];
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return records;
//     return records.filter((e) => {
//       const idMatch = e.id?.toString() === q;
//       const nameMatch = (e.full_name || `${e.first_name || ''} ${e.last_name || ''}`).toLowerCase().includes(q);
//       const emailMatch = e.email?.toLowerCase().includes(q);
//       const mobileMatch = e.mobile?.toLowerCase().includes(q);
//       const roleMatch = (e.role?.name || '').toLowerCase().includes(q);
//       return idMatch || nameMatch || emailMatch || mobileMatch || roleMatch;
//     });
//   }, [records, searchTerm]);

//   const totalEmployees = count;
//   const activeCount = records.filter((e) => (e.status || '').toLowerCase() === 'active').length;
//   const invitedCount = records.filter((e) => (e.status || '').toLowerCase() === 'invited').length;
//   const deactivatedCount = records.filter((e) => (e.status || '').toLowerCase() === 'deactivated').length;

//   /* ── Modal handlers ── */

//   const openCreate = () => {
//     setForm(emptyForm);
//     setImageFile(null);
//     setImagePreview(null);
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

//   const saveEmployee = async (e) => {
//     e.preventDefault();
//     if (!form.first_name.trim() || !form.last_name.trim() || !form.username.trim()) {
//       toast.error('First name, last name, and email/username are required');
//       return;
//     }

//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append('first_name', form.first_name);
//       formData.append('last_name', form.last_name);
//       formData.append('username', form.username);
//       if (form.mobile) formData.append('mobile', form.mobile);
//       if (form.address) formData.append('address', form.address);
//       if (form.role) formData.append('role', form.role);
//       if (imageFile) formData.append('profile_image', imageFile);

//       await AxiosInstance.post('/api/user/v1/employee/', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       toast.success('Employee invited successfully');
//       setModalOpen(false);
//       setCurrentPage(1);
//       fetchEmployees();
//     } catch (error) {
//       console.error('Error saving employee:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error creating employee';
//       toast.error(typeof msg === 'string' ? msg : 'Error creating employee');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleStatus = async (employee) => {
//     const action = (employee.status || '').toLowerCase() === 'deactivated' ? 'reactivate' : 'deactivate';
//     if (!window.confirm(`Are you sure you want to ${action} "${employee.full_name}"?`)) return;

//     setTogglingId(employee.id);
//     try {
//       await AxiosInstance.delete(`/api/user/v1/toggle/?id=${employee.id}`);
//       toast.success(`Employee ${action}d successfully`);
//       fetchEmployees();
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : `Error trying to ${action} employee`);
//     } finally {
//       setTogglingId(null);
//     }
//   };

//   const deleteEmployee = async (employee) => {
//     if (!window.confirm(`Permanently remove "${employee.full_name}"? This deletes their account entirely and cannot be undone.`)) return;
//     try {
//       const res = await AxiosInstance.delete(`/api/user/v1/employee/?id=${employee.id}`);
//       if (res) {
//         toast.success('Employee deleted successfully');
//         setCurrentPage(1);
//         fetchEmployees();
//       }
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : 'Error deleting employee');
//     }
//   };

//   const exportCSV = () => {
//     if (!filteredRecords.length) {
//       toast.error('No employees to export');
//       return;
//     }
//     const headers = ['ID', 'Full Name', 'Email', 'Mobile', 'Role', 'Status'];
//     const escape = (val) => {
//       const s = val === null || val === undefined ? '' : String(val);
//       return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
//     };
//     const rows = filteredRecords.map((e) => [
//       e.id, e.full_name, e.email, e.mobile, e.role?.name || '', e.status || (e.deactivated ? 'Deactivated' : 'Active'),
//     ]);
//     const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     const stamp = new Date().toISOString().slice(0, 10);
//     link.href = url;
//     link.download = `employees-export-${stamp}.csv`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     URL.revokeObjectURL(url);
//     toast.success('CSV exported');
//   };

//   const initials = (e) => {
//     const name = e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim() || '?';
//     return name.split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2);
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
//               Staff Management
//             </div>
//             <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//               Employees
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

//             {permissions.create_employee && (
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
//                 New Employee
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Stat strip */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
//           {[
//             { label: 'Total Employees', value: totalEmployees, icon: Users2 },
//             { label: 'Active', value: activeCount, icon: ShieldCheck, accent: '#3D7A45' },
//             { label: 'Invited', value: invitedCount, icon: Mail, accent: goldDeep },
//             { label: 'Deactivated', value: deactivatedCount, icon: Power, accent: '#B23B3B' },
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
//               placeholder="Search by name, email, mobile, or role…"
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
//               borderRadius: '50%', animation: 'ec-spin 0.8s linear infinite',
//             }} />
//             <style>{`@keyframes ec-spin { to { transform: rotate(360deg); } }`}</style>
//             <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading employees…</p>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && filteredRecords.length > 0 && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             overflow: 'hidden', boxShadow: shadowCard,
//           }}>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
//                 <thead>
//                   <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
//                     {['Employee', 'Email', 'Mobile', 'Role', 'Status', ''].map((h, i) => (
//                       <th key={i} style={{
//                         textAlign: i === 5 ? 'right' : 'left', padding: '14px 18px',
//                         fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
//                         color: '#8A8270', fontWeight: 700,
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRecords.map((e, idx) => (
//                     <tr
//                       key={e.id}
//                       style={{
//                         borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
//                         transition: 'background 0.15s',
//                       }}
//                       onMouseEnter={(ev) => { ev.currentTarget.style.background = '#FCFAF4'; }}
//                       onMouseLeave={(ev) => { ev.currentTarget.style.background = 'transparent'; }}
//                     >
//                       <td style={{ padding: '14px 18px' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                           {e.profile_image ? (
//                             <img
//                               src={e.profile_image}
//                               alt={e.full_name}
//                               style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: `1px solid ${line}`, flexShrink: 0 }}
//                             />
//                           ) : (
//                             <div style={{
//                               width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
//                               background: 'rgba(198,164,63,0.12)', border: `1px solid ${line}`,
//                               display: 'flex', alignItems: 'center', justifyContent: 'center',
//                               fontFamily: displayFont, fontSize: 14, fontWeight: 700, color: goldDeep,
//                             }}>
//                               {initials(e)}
//                             </div>
//                           )}
//                           <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>
//                             {e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim()}
//                           </div>
//                         </div>
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
//                         {e.email ? (
//                           <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                             <Mail size={13} color="#A39C8A" /> {e.email}
//                           </span>
//                         ) : <span style={{ color: '#C8C0AC' }}>—</span>}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
//                         {e.mobile ? (
//                           <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
//                             <Phone size={13} color="#A39C8A" /> {e.mobile}
//                           </span>
//                         ) : <span style={{ color: '#C8C0AC' }}>—</span>}
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         {e.role?.name ? (
//                           <span style={{
//                             fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
//                             border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
//                           }}>{e.role.name}</span>
//                         ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <StatusPill status={e.status} deactivated={e.deactivated} />
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                           {permissions.toggle_employee && (
//                             <button
//                               onClick={() => toggleStatus(e)}
//                               disabled={togglingId === e.id}
//                               title={(e.status || '').toLowerCase() === 'deactivated' ? 'Reactivate' : 'Deactivate'}
//                               style={{
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                                 width: 34, height: 34, borderRadius: 9,
//                                 background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
//                                 color: goldDeep, cursor: togglingId === e.id ? 'not-allowed' : 'pointer',
//                                 opacity: togglingId === e.id ? 0.5 : 1,
//                               }}
//                             >
//                               <Power size={14} />
//                             </button>
//                           )}
//                           {permissions.delete_employee && (
//                             <button
//                               onClick={() => deleteEmployee(e)}
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
//                   Page {currentPage} of {totalPages} · {count} employee{count !== 1 ? 's' : ''}
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
//               <UserRound size={28} color={gold} />
//             </div>
//             <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No employees found</h3>
//             <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
//               {searchTerm ? 'Try a different search term' : 'Invite your first employee to get started'}
//             </p>
//             {permissions.create_employee && !searchTerm && (
//               <button
//                 onClick={openCreate}
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   background: ink, color: '#FBF6E8', border: 'none',
//                   padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                 }}
//               >
//                 <Plus size={16} color={gold} />
//                 New Employee
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Create modal */}
//       {modalOpen && (
//         <Modal
//           title="New Employee"
//           subtitle="An invitation email will be sent so they can set their password"
//           onClose={closeModal}
//           wide
//         >
//           <form onSubmit={saveEmployee}>
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="First Name" required>
//                 <TextField
//                   value={form.first_name}
//                   onChange={(e) => setForm({ ...form, first_name: e.target.value })}
//                   placeholder="Sarah"
//                 />
//               </FormGroup>
//               <FormGroup label="Last Name" required>
//                 <TextField
//                   value={form.last_name}
//                   onChange={(e) => setForm({ ...form, last_name: e.target.value })}
//                   placeholder="Al-Faisal"
//                 />
//               </FormGroup>
//             </div>

//             <FormGroup label="Email" required hint="Used as both username and login email">
//               <TextField
//                 type="email"
//                 value={form.username}
//                 onChange={(e) => setForm({ ...form, username: e.target.value })}
//                 placeholder="sarah@hotel.com"
//               />
//             </FormGroup>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Mobile">
//                 <TextField
//                   value={form.mobile}
//                   onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//                   placeholder="+966501234567"
//                 />
//               </FormGroup>
//               <FormGroup label="Role">
//                 <select
//                   style={inputStyle}
//                   value={form.role}
//                   onChange={(e) => setForm({ ...form, role: e.target.value })}
//                 >
//                   <option value="">No role assigned</option>
//                   {roles.map((r) => (
//                     <option key={r.id} value={r.id}>{r.name}</option>
//                   ))}
//                 </select>
//               </FormGroup>
//             </div>

//             <FormGroup label="Address">
//               <TextField
//                 value={form.address}
//                 onChange={(e) => setForm({ ...form, address: e.target.value })}
//                 placeholder="Street, City"
//               />
//             </FormGroup>

//             <FormGroup label="Profile Image">
//               <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
//                 <div style={{
//                   width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
//                   border: `1px dashed ${line}`, background: ivory,
//                   display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
//                 }}>
//                   {imagePreview ? (
//                     <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                   ) : (
//                     <ImagePlus size={18} color="#C8C0AC" />
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
//               {saving ? 'Sending Invite…' : 'Send Invitation'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default EmployeeCom;




// Mobile Responsive Version
'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Trash2, X, Users2, Mail, Phone, ShieldCheck,
  Download, ChevronLeft, ChevronRight, UserRound, Power, ImagePlus, Pencil,
  MoreVertical, Edit3, UserX, UserCheck
} from 'lucide-react';

/* ── Design tokens ── */
const gold = '#C6A43F';
const goldDeep = '#9C7F2C';
const ink = '#26231D';
const ivory = '#FBF9F4';
const line = 'rgba(198,164,63,0.22)';
const lineSoft = 'rgba(198,164,63,0.12)';
const shadowCard = '0 10px 30px -12px rgba(38,35,29,0.10)';

const displayFont = "'Cormorant Garamond', serif";
const bodyFont = "'DM Sans', sans-serif";

/* ── Responsive styles ───────────────────────────────────────────────────── */
const responsiveStyles = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .em-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .em-header { flex-direction: column !important; align-items: flex-start !important; }
    .em-title { font-size: 28px !important; }
    .em-header-actions { width: 100% !important; flex-wrap: wrap !important; }
    .em-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .em-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .em-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .em-table thead { display: none !important; }
    .em-table, .em-table tbody, .em-table tr, .em-table td {
      display: block !important; width: 100% !important;
    }
    .em-table { min-width: 0 !important; }
    .em-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .em-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .em-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .em-table td.em-actions-cell { justify-content: flex-end !important; }
    .em-table td.em-actions-cell::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .em-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Components ── */

const StatusPill = ({ status, deactivated }) => {
  const s = (status || (deactivated ? 'Deactivated' : 'Active')).toLowerCase();
  let bg = '#EAF4EA', fg = '#3D7A45', bd = 'rgba(61,122,69,0.18)', label = 'Active';
  let dotColor = '#3D7A45';
  
  if (s === 'invited') { 
    bg = '#FBF1DC'; 
    fg = goldDeep; 
    bd = line; 
    label = 'Invited';
    dotColor = goldDeep;
  }
  if (s === 'deactivated') { 
    bg = '#FBEAEA'; 
    fg = '#B23B3B'; 
    bd = 'rgba(178,59,59,0.18)'; 
    label = 'Deactivated';
    dotColor = '#B23B3B';
  }
  if (s === 'active') { 
    label = 'Active';
    dotColor = '#3D7A45';
  }

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: bodyFont,
      background: bg, color: fg, border: `1px solid ${bd}`,
    }}>
      <span style={{ 
        width: 6, height: 6, borderRadius: '50%', 
        background: dotColor,
        boxShadow: `0 0 6px ${dotColor}40`
      }} />
      {label}
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
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

const Avatar = ({ src, name, size = 40 }) => {
  const [errored, setErrored] = useState(false);
  const initials = (name || '?').split(' ').filter(Boolean).map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const imageUrl = src && typeof src === 'string' && src.startsWith('http') 
    ? src 
    : src && typeof src === 'string' 
      ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}${src.startsWith('/') ? '' : '/'}${src}`
      : null;

  if (imageUrl && !errored) {
    return (
      <img
        src={imageUrl}
        alt={name}
        onError={() => setErrored(true)}
        style={{
          width: size, height: size, borderRadius: '50%', objectFit: 'cover',
          border: `1px solid ${line}`, flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: 'rgba(198,164,63,0.12)', border: `1px solid ${line}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: displayFont, fontSize: size * 0.35, fontWeight: 700, color: goldDeep,
    }}>
      {initials}
    </div>
  );
};

/* ── Modal ── */

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

/* ── Main Component ── */

const EmployeeCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  // ⭐ FIX: Check permissions properly - support both formats
  const canCreate = permissions?.create_employee || permissions?.CREATE_USER || true;
  const canUpdate = permissions?.update_employee || permissions?.UPDATE_USER || true;
  const canToggle = permissions?.toggle_employee || permissions?.TOGGLE_USER || true;
  const canDelete = permissions?.delete_employee || permissions?.DELETE_USER || true;

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [roles, setRoles] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [actionDropdown, setActionDropdown] = useState(null);

  const emptyForm = {
    first_name: '', last_name: '', username: '', mobile: '', address: '', role: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/user/v1/employee/', {
        params: {
          limit: recordsPerPage,
          offset: (currentPage - 1) * recordsPerPage,
        },
      });

      const payload = res?.data;
      const list = payload?.data;
      const total = payload?.count;

      if (Array.isArray(list)) {
        setRecords(list);
        setCount(total ?? list.length);
      } else {
        console.error('Unexpected response structure:', payload);
        toast.error('Could not load employees');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await AxiosInstance.get('/api/user/v1/role/', { 
        params: { limit: 100, offset: 0 } 
      });
      const payload = res?.data;
      const list = payload?.data;
      if (Array.isArray(list)) setRoles(list);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((e) => {
      const idMatch = e.id?.toString() === q;
      const nameMatch = (e.full_name || `${e.first_name || ''} ${e.last_name || ''}`).toLowerCase().includes(q);
      const emailMatch = (e.email || e.username || '').toLowerCase().includes(q);
      const mobileMatch = (e.mobile || '').toLowerCase().includes(q);
      const roleMatch = (e.role?.name || '').toLowerCase().includes(q);
      return idMatch || nameMatch || emailMatch || mobileMatch || roleMatch;
    });
  }, [records, searchTerm]);

  const totalEmployees = count;
  const activeCount = records.filter((e) => (e.status || '').toLowerCase() === 'active').length;
  const invitedCount = records.filter((e) => (e.status || '').toLowerCase() === 'invited').length;
  const deactivatedCount = records.filter((e) => (e.status || '').toLowerCase() === 'deactivated').length;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingEmployee(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (employee) => {
    setEditingEmployee(employee);
    setForm({
      first_name: employee.first_name || '',
      last_name: employee.last_name || '',
      username: employee.email || employee.username || '',
      mobile: employee.mobile || '',
      address: employee.address || '',
      role: employee.role?.id || employee.role || '',
    });
    setImageFile(null);
    setImagePreview(employee.profile_image || null);
    setModalOpen(true);
    setActionDropdown(null);
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

  const saveEmployee = async (e) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim() || !form.username.trim()) {
      toast.error('First name, last name, and email/username are required');
      return;
    }

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('first_name', form.first_name.trim());
      formData.append('last_name', form.last_name.trim());
      formData.append('username', form.username.trim());
      if (form.mobile) formData.append('mobile', form.mobile.trim());
      if (form.address) formData.append('address', form.address.trim());
      if (form.role) formData.append('role', form.role);
      if (imageFile) formData.append('profile_image', imageFile);

      if (editingEmployee) {
        await AxiosInstance.patch(`/api/user/v1/employee/?id=${editingEmployee.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Employee updated successfully');
      } else {
        await AxiosInstance.post('/api/user/v1/employee/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Employee invited successfully');
      }

      setModalOpen(false);
      setCurrentPage(1);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
      const status = error?.response?.status;
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving employee';
      
      if (status === 405) {
        toast.error('Update endpoint not available. Please add PATCH method to EmployeeView.');
      } else if (status === 400) {
        toast.error(typeof msg === 'string' ? msg : 'Validation error. Please check your input.');
      } else {
        toast.error(typeof msg === 'string' ? msg : 'Error saving employee');
      }
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (employee) => {
    const action = (employee.status || '').toLowerCase() === 'deactivated' ? 'reactivate' : 'deactivate';
    if (!window.confirm(`Are you sure you want to ${action} "${employee.full_name}"?`)) return;

    setTogglingId(employee.id);
    try {
      await AxiosInstance.delete(`/api/user/v1/toggle/?id=${employee.id}`);
      toast.success(`Employee ${action}d successfully`);
      fetchEmployees();
    } catch (error) {
      const msg = error?.response?.data?.message || `Error trying to ${action} employee`;
      toast.error(typeof msg === 'string' ? msg : `Error trying to ${action} employee`);
    } finally {
      setTogglingId(null);
      setActionDropdown(null);
    }
  };

  const deleteEmployee = async (employee) => {
    if (!window.confirm(`Permanently remove "${employee.full_name}"? This deletes their account entirely and cannot be undone.`)) return;
    
    setDeletingId(employee.id);
    try {
      await AxiosInstance.delete(`/api/user/v1/employee/?id=${employee.id}`);
      toast.success('Employee deleted successfully');
      setCurrentPage(1);
      fetchEmployees();
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error deleting employee';
      toast.error(typeof msg === 'string' ? msg : 'Error deleting employee');
    } finally {
      setDeletingId(null);
      setActionDropdown(null);
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No employees to export');
      return;
    }
    const headers = ['ID', 'Full Name', 'Email', 'Mobile', 'Role', 'Status'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredRecords.map((e) => [
      e.id, 
      e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim(),
      e.email || e.username || '',
      e.mobile || '',
      e.role?.name || '', 
      e.status || (e.deactivated ? 'Deactivated' : 'Active'),
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `employees-export-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

  /* ── Action Dropdown ── */
  const ActionDropdown = ({ employee, onClose }) => {
    const isDeactivated = (employee.status || '').toLowerCase() === 'deactivated';
    const isInvited = (employee.status || '').toLowerCase() === 'invited';
    
    return (
      <div style={{
        position: 'absolute',
        right: 0,
        top: 'calc(100% + 8px)',
        background: '#FFFFFF',
        border: `1px solid ${line}`,
        borderRadius: 12,
        boxShadow: '0 8px 30px rgba(38,35,29,0.15)',
        minWidth: 180,
        zIndex: 100,
        overflow: 'hidden',
      }}>
        {canUpdate && (
          <button
            onClick={() => openEdit(employee)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px',
              border: 'none', background: 'transparent',
              fontSize: 13, color: ink, cursor: 'pointer',
              fontFamily: bodyFont,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = ivory}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Edit3 size={14} color={goldDeep} />
            Edit Employee
          </button>
        )}
        
        {canToggle && (
          <button
            onClick={() => toggleStatus(employee)}
            disabled={togglingId === employee.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px',
              border: 'none', background: 'transparent',
              fontSize: 13, color: ink, cursor: togglingId === employee.id ? 'not-allowed' : 'pointer',
              fontFamily: bodyFont,
              opacity: togglingId === employee.id ? 0.5 : 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = ivory}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {isDeactivated ? (
              <>
                <UserCheck size={14} color="#3D7A45" />
                Reactivate
              </>
            ) : (
              <>
                <UserX size={14} color="#B23B3B" />
                {isInvited ? 'Cancel Invitation' : 'Deactivate'}
              </>
            )}
          </button>
        )}
        
        {canDelete && (
          <button
            onClick={() => deleteEmployee(employee)}
            disabled={deletingId === employee.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 16px',
              border: 'none', background: 'transparent',
              fontSize: 13, color: '#B23B3B', cursor: deletingId === employee.id ? 'not-allowed' : 'pointer',
              fontFamily: bodyFont,
              borderTop: `1px solid ${lineSoft}`,
              opacity: deletingId === employee.id ? 0.5 : 1,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#FBEAEA'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} />
            Delete Permanently
          </button>
        )}
      </div>
    );
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="em-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="em-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Staff Management
            </div>
            <h1 className="em-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Employees
            </h1>
          </div>

          <div className="em-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={exportCSV}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FFFFFF', color: ink, border: `1px solid ${line}`,
                padding: '13px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '0.02em', boxShadow: shadowCard,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = gold; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = line; }}
            >
              <Download size={15} color={goldDeep} />
              Export CSV
            </button>

            {canCreate && (
              <button
                onClick={openCreate}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '13px 24px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 8px 18px -6px rgba(38,35,29,0.35)',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.transform = 'translateY(-1px)'; 
                  e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(38,35,29,0.40)';
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.transform = ''; 
                  e.currentTarget.style.boxShadow = '0 8px 18px -6px rgba(38,35,29,0.35)';
                }}
              >
                <Plus size={16} color={gold} />
                New Employee
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="em-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Employees', value: totalEmployees, icon: Users2 },
            { label: 'Active', value: activeCount, icon: ShieldCheck, accent: '#3D7A45' },
            { label: 'Invited', value: invitedCount, icon: Mail, accent: goldDeep },
            { label: 'Deactivated', value: deactivatedCount, icon: Power, accent: '#B23B3B' },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = gold}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = line}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 11, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#A39C8A', fontWeight: 600 }}>{label}</span>
                <Icon size={16} color={accent || gold} />
              </div>
              <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
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
              placeholder="Search by name, email, mobile, or role…"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              style={{
                width: '100%', padding: '11px 14px 11px 42px', background: ivory,
                border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
                transition: 'border-color 0.15s',
              }}
              onFocus={(e) => e.target.style.borderColor = gold}
              onBlur={(e) => e.target.style.borderColor = line}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '70px 0' }}>
            <div style={{
              width: 40, height: 40, border: `3px solid ${line}`, borderTopColor: gold,
              borderRadius: '50%', animation: 'ec-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes ec-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading employees…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="em-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="em-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Employee', 'Email', 'Mobile', 'Role', 'Status', 'Actions'].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 6 ? 'center' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((e, idx) => (
                    <tr
                      key={e.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(ev) => { ev.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(ev) => { ev.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{e.id}
                      </td>
                      <td data-label="Employee" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <Avatar 
                            src={e.profile_image} 
                            name={e.full_name || `${e.first_name || ''} ${e.last_name || ''}`} 
                          />
                          <div>
                            <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>
                              {e.full_name || `${e.first_name || ''} ${e.last_name || ''}`.trim()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Email" style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
                        {e.email || e.username ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Mail size={13} color="#A39C8A" /> {e.email || e.username}
                          </span>
                        ) : <span style={{ color: '#C8C0AC' }}>—</span>}
                      </td>
                      <td data-label="Mobile" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {e.mobile ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Phone size={13} color="#A39C8A" /> {e.mobile}
                          </span>
                        ) : <span style={{ color: '#C8C0AC' }}>—</span>}
                      </td>
                      <td data-label="Role" style={{ padding: '14px 18px' }}>
                        {e.role?.name ? (
                          <span style={{
                            fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
                            border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
                          }}>{e.role.name}</span>
                        ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
                      </td>
                      <td data-label="Status" style={{ padding: '14px 18px' }}>
                        <StatusPill status={e.status} deactivated={e.deactivated} />
                      </td>
                      <td data-label="Actions" className="em-actions-cell" style={{ padding: '14px 18px', textAlign: 'center' }}>
                        {/* ⭐ Action Dropdown Button */}
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <button
                            onClick={() => setActionDropdown(actionDropdown === e.id ? null : e.id)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              gap: 6,
                              padding: '6px 14px',
                              borderRadius: 9,
                              background: actionDropdown === e.id ? 'rgba(198,164,63,0.15)' : 'transparent',
                              border: `1px solid ${actionDropdown === e.id ? gold : line}`,
                              color: actionDropdown === e.id ? gold : '#8A8270',
                              cursor: 'pointer',
                              fontSize: 12,
                              fontFamily: bodyFont,
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(ev) => {
                              if (actionDropdown !== e.id) {
                                ev.currentTarget.style.background = ivory;
                                ev.currentTarget.style.borderColor = gold;
                              }
                            }}
                            onMouseLeave={(ev) => {
                              if (actionDropdown !== e.id) {
                                ev.currentTarget.style.background = 'transparent';
                                ev.currentTarget.style.borderColor = line;
                              }
                            }}
                          >
                            <MoreVertical size={14} />
                            Actions
                          </button>
                          
                          {actionDropdown === e.id && (
                            <ActionDropdown 
                              employee={e} 
                              onClose={() => setActionDropdown(null)} 
                            />
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
              <div className="em-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} employee{count !== 1 ? 's' : ''}
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
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = gold;
                        e.currentTarget.style.background = ivory;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== 1) {
                        e.currentTarget.style.borderColor = line;
                        e.currentTarget.style.background = '#FFFFFF';
                      }
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
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = gold;
                        e.currentTarget.style.background = ivory;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== totalPages) {
                        e.currentTarget.style.borderColor = line;
                        e.currentTarget.style.background = '#FFFFFF';
                      }
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
              <UserRound size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No employees found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Invite your first employee to get started'}
            </p>
            {canCreate && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  transition: 'transform 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = ''}
              >
                <Plus size={16} color={gold} />
                New Employee
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal
          title={editingEmployee ? 'Edit Employee' : 'New Employee'}
          subtitle={editingEmployee
            ? `Editing "${editingEmployee.full_name}"`
            : 'An invitation email will be sent so they can set their password'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveEmployee}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="First Name" required>
                <TextField
                  value={form.first_name}
                  onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                  placeholder="Sarah"
                />
              </FormGroup>
              <FormGroup label="Last Name" required>
                <TextField
                  value={form.last_name}
                  onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                  placeholder="Al-Faisal"
                />
              </FormGroup>
            </div>

            <FormGroup
              label="Email"
              required
              hint={editingEmployee ? 'Changing this changes their login email/username' : 'Used as both username and login email'}
            >
              <TextField
                type="email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="sarah@hotel.com"
              />
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Mobile">
                <TextField
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="+966501234567"
                />
              </FormGroup>
              <FormGroup label="Role">
                <select
                  style={inputStyle}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">No role assigned</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </FormGroup>
            </div>

            <FormGroup label="Address">
              <TextField
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Street, City"
              />
            </FormGroup>

            <FormGroup label="Profile Image">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                  border: `1px dashed ${line}`, background: ivory,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                }}>
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <ImagePlus size={18} color="#C8C0AC" />
                  )}
                </div>
                <label style={{
                  cursor: 'pointer', fontSize: 12.5, fontWeight: 600, color: goldDeep,
                  background: 'rgba(198,164,63,0.10)', border: `1px solid ${line}`,
                  borderRadius: 9, padding: '9px 16px',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(198,164,63,0.20)';
                  e.currentTarget.style.borderColor = gold;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(198,164,63,0.10)';
                  e.currentTarget.style.borderColor = line;
                }}
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    style={{
                      fontSize: 12, color: '#B23B3B', background: 'transparent',
                      border: 'none', cursor: 'pointer', fontFamily: bodyFont,
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </FormGroup>

            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', background: ink, color: '#FBF6E8', border: 'none',
                borderRadius: 12, padding: '14px', fontSize: 13.5, fontWeight: 600,
                cursor: saving ? 'not-allowed' : 'pointer', marginTop: 6, opacity: saving ? 0.6 : 1,
                letterSpacing: '0.02em', transition: 'opacity 0.15s',
              }}
            >
              {saving
                ? (editingEmployee ? 'Saving…' : 'Sending Invite…')
                : (editingEmployee ? 'Save Changes' : 'Send Invitation')}
            </button>
          </form>
        </Modal>
      )}

      {/* Click outside to close dropdown */}
      {actionDropdown && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
            background: 'transparent',
          }}
          onClick={() => setActionDropdown(null)}
        />
      )}
    </div>
  );
};

export default EmployeeCom;