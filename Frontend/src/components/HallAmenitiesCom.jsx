// 'use client';
// import React, { useEffect, useState, useContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import AxiosInstance from "@/components/AxiosInstance";
// import { AuthContext } from '@/components/AuthContext';
// import {
//   Search, Plus, Pencil, Trash2, X, MapPin, CheckCircle,
//   ChevronLeft, ChevronRight, Wifi, Car, Coffee, Monitor,
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
//         maxWidth: wide ? 640 : 480, maxHeight: '88vh', overflowY: 'auto',
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

// const HallAmenitiesCom = () => {
//   const { permissions = {} } = useContext(AuthContext);

//   const [records, setRecords] = useState([]);
//   const [count, setCount] = useState(0);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const recordsPerPage = 10;
//   const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingAmenity, setEditingAmenity] = useState(null);
//   const [saving, setSaving] = useState(false);

//   const [halls, setHalls] = useState([]);

//   const emptyForm = {
//     hall: '', name_en: '', name_ar: '', description_en: '', description_ar: '',
//   };
//   const [form, setForm] = useState(emptyForm);

//   useEffect(() => {
//     fetchAmenities();
//     fetchHalls();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentPage]);

//   const fetchAmenities = async () => {
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.get('/api/hotel/v1/hall/amenity/', {
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
//         toast.error('Could not load amenities');
//       }
//     } catch (error) {
//       console.error('Error occurred:', error);
//       toast.error('Error fetching amenities');
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

//   const filteredRecords = useMemo(() => {
//     if (!Array.isArray(records)) return [];
//     const q = searchTerm.trim().toLowerCase();
//     if (!q) return records;
//     return records.filter((a) => {
//       const idMatch = a.id?.toString() === q;
//       const hallMatch = (a.hall_name_en || a.hall?.name_en)?.toLowerCase().includes(q);
//       const nameMatch = `${a.name_en || ''} ${a.name_ar || ''}`.toLowerCase().includes(q);
//       const descMatch = `${a.description_en || ''} ${a.description_ar || ''}`.toLowerCase().includes(q);
//       return idMatch || hallMatch || nameMatch || descMatch;
//     });
//   }, [records, searchTerm]);

//   const totalAmenities = count;
//   const uniqueHalls = new Set(records.map((a) => a.hall?.id)).size;

//   /* ── Modal handlers ── */

//   const openCreate = () => {
//     setEditingAmenity(null);
//     setForm(emptyForm);
//     setModalOpen(true);
//   };

//   const openEdit = (amenity) => {
//     setEditingAmenity(amenity);
//     setForm({
//       hall: amenity.hall?.id || '',
//       name_en: amenity.name_en || '',
//       name_ar: amenity.name_ar || '',
//       description_en: amenity.description_en || '',
//       description_ar: amenity.description_ar || '',
//     });
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     if (saving) return;
//     setModalOpen(false);
//   };

//   const saveAmenity = async (e) => {
//     e.preventDefault();
//     if (!form.hall || !form.name_en.trim()) {
//       toast.error('Hall and amenity name are required');
//       return;
//     }

//     setSaving(true);
//     try {
//       const payload = {
//         hall: form.hall,
//         name_en: form.name_en,
//         name_ar: form.name_ar,
//         description_en: form.description_en,
//         description_ar: form.description_ar,
//       };

//       if (editingAmenity) {
//         await AxiosInstance.patch(`/api/hotel/v1/hall/amenity/?id=${editingAmenity.id}`, payload);
//         toast.success('Amenity updated successfully');
//       } else {
//         await AxiosInstance.post('/api/hotel/v1/hall/amenity/', payload);
//         toast.success('Amenity added successfully');
//       }
//       setModalOpen(false);
//       setCurrentPage(1);
//       fetchAmenities();
//     } catch (error) {
//       console.error('Error saving amenity:', error);
//       const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving amenity';
//       toast.error(typeof msg === 'string' ? msg : 'Error saving amenity');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const deleteAmenity = async (amenity) => {
//     if (!window.confirm(`Remove this amenity? This cannot be undone.`)) return;
//     try {
//       const res = await AxiosInstance.delete(`/api/hotel/v1/hall/amenity/?id=${amenity.id}`);
//       if (res) {
//         toast.success('Amenity deleted successfully');
//         setCurrentPage(1);
//         fetchAmenities();
//       }
//     } catch (error) {
//       const msg = error?.response?.data?.message;
//       toast.error(typeof msg === 'string' ? msg : 'Error deleting amenity');
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
//               Facility Management
//             </div>
//             <h1 style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
//               Hall Amenities
//             </h1>
//           </div>

//           {permissions.create_hall_amenity && (
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
//               Add Amenity
//             </button>
//           )}
//         </div>

//         {/* Stat strip */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
//           {[
//             { label: 'Total Amenities', value: totalAmenities, icon: CheckCircle },
//             { label: 'Halls with Amenities', value: uniqueHalls, icon: MapPin, accent: goldDeep },
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
//               placeholder="Search by hall, amenity name, or description…"
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
//             <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading amenities…</p>
//           </div>
//         )}

//         {/* Table */}
//         {!loading && filteredRecords.length > 0 && (
//           <div style={{
//             background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
//             overflow: 'hidden', boxShadow: shadowCard,
//           }}>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
//                 <thead>
//                   <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
//                     {['Hall', 'Amenity Name', 'Description', ''].map((h, i) => (
//                       <th key={i} style={{
//                         textAlign: i === 3 ? 'right' : 'left', padding: '14px 18px',
//                         fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
//                         color: '#8A8270', fontWeight: 700,
//                       }}>{h}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredRecords.map((a, idx) => (
//                     <tr
//                       key={a.id}
//                       style={{
//                         borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
//                         transition: 'background 0.15s',
//                       }}
//                       onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
//                       onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
//                     >
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
//                         {a.hall_name_en || a.hall?.name_en || '—'}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
//                         <div>{a.name_en || '—'}</div>
//                         {a.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{a.name_ar}</div>}
//                       </td>
//                       <td style={{ padding: '14px 18px', fontSize: 12.5, color: '#A39C8A', maxWidth: 300 }}>
//                         {a.description_en || a.description_ar || '—'}
//                       </td>
//                       <td style={{ padding: '14px 18px' }}>
//                         <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//                           {permissions.update_hall_amenity && (
//                             <button
//                               onClick={() => openEdit(a)}
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
//                           {permissions.delete_hall_amenity && (
//                             <button
//                               onClick={() => deleteAmenity(a)}
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
//                   Page {currentPage} of {totalPages} · {count} amenit{count !== 1 ? 'ies' : 'y'}
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
//               <CheckCircle size={28} color={gold} />
//             </div>
//             <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No amenities found</h3>
//             <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
//               {searchTerm ? 'Try a different search term' : 'Add your first amenity to get started'}
//             </p>
//             {permissions.create_hall_amenity && !searchTerm && (
//               <button
//                 onClick={openCreate}
//                 style={{
//                   display: 'inline-flex', alignItems: 'center', gap: 8,
//                   background: ink, color: '#FBF6E8', border: 'none',
//                   padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
//                 }}
//               >
//                 <Plus size={16} color={gold} />
//                 Add Amenity
//               </button>
//             )}
//           </div>
//         )}
//       </div>

//       {/* Create / Edit modal */}
//       {modalOpen && (
//         <Modal
//           title={editingAmenity ? 'Update Amenity' : 'Add Amenity'}
//           subtitle={editingAmenity ? `Editing amenity for ${editingAmenity.hall?.name_en}` : 'Add a new amenity to a hall'}
//           onClose={closeModal}
//           wide
//         >
//           <form onSubmit={saveAmenity}>
//             <FormGroup label="Hall" required>
//               <select
//                 style={inputStyle}
//                 value={form.hall}
//                 onChange={(e) => setForm({ ...form, hall: e.target.value })}
//               >
//                 <option value="">Select Hall</option>
//                 {halls.map((h) => (
//                   <option key={h.id} value={h.id}>{h.name_en}</option>
//                 ))}
//               </select>
//             </FormGroup>

//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
//               <FormGroup label="Amenity Name (English)" required>
//                 <TextField
//                   value={form.name_en}
//                   onChange={(e) => setForm({ ...form, name_en: e.target.value })}
//                   placeholder="WiFi"
//                 />
//               </FormGroup>
//               <FormGroup label="Amenity Name (Arabic)">
//                 <TextField
//                   value={form.name_ar}
//                   onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
//                   placeholder="واي فاي"
//                   dir="rtl"
//                 />
//               </FormGroup>
//             </div>

//             <FormGroup label="Description (English)">
//               <textarea
//                 style={{
//                   ...inputStyle,
//                   minHeight: 80,
//                   resize: 'vertical',
//                 }}
//                 value={form.description_en}
//                 onChange={(e) => setForm({ ...form, description_en: e.target.value })}
//                 placeholder="High-speed internet access..."
//               />
//             </FormGroup>

//             <FormGroup label="Description (Arabic)">
//               <textarea
//                 style={{
//                   ...inputStyle,
//                   minHeight: 80,
//                   resize: 'vertical',
//                 }}
//                 value={form.description_ar}
//                 onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
//                 placeholder="وصول عالي السرعة للإنترنت..."
//                 dir="rtl"
//               />
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
//               {saving ? 'Saving…' : editingAmenity ? 'Save Changes' : 'Add Amenity'}
//             </button>
//           </form>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default HallAmenitiesCom;







// Mobile Responsive Version
'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, MapPin, CheckCircle,
  ChevronLeft, ChevronRight, Wifi, Car, Coffee, Monitor,
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

/* ── Responsive styles ───────────────────────────────────────────────────── */
const responsiveStyles = `
  * { box-sizing: border-box; }
  @media (max-width: 768px) {
    .ha-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .ha-header { flex-direction: column !important; align-items: flex-start !important; }
    .ha-title { font-size: 28px !important; }
    .ha-header-actions { width: 100% !important; }
    .ha-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .ha-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .ha-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .ha-table thead { display: none !important; }
    .ha-table, .ha-table tbody, .ha-table tr, .ha-table td {
      display: block !important; width: 100% !important;
    }
    .ha-table { min-width: 0 !important; }
    .ha-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .ha-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .ha-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .ha-table td.ha-empty-label { justify-content: flex-end !important; }
    .ha-table td.ha-empty-label::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .ha-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

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
        maxWidth: wide ? 640 : 480, maxHeight: '88vh', overflowY: 'auto',
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

const HallAmenitiesCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [saving, setSaving] = useState(false);

  const [halls, setHalls] = useState([]);

  const emptyForm = {
    hall: '', name_en: '', name_ar: '', description_en: '', description_ar: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchAmenities();
    fetchHalls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchAmenities = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/hall/amenity/', {
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
        toast.error('Could not load amenities');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching amenities');
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

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((a) => {
      const idMatch = a.id?.toString() === q;
      const hallIdMatch = (a.hall?.id ?? a.hall)?.toString() === q;
      const hallMatch = (a.hall_name_en || a.hall?.name_en)?.toLowerCase().includes(q);
      const nameMatch = `${a.name_en || ''} ${a.name_ar || ''}`.toLowerCase().includes(q);
      const descMatch = `${a.description_en || ''} ${a.description_ar || ''}`.toLowerCase().includes(q);
      const createdByMatch = a.created_by_name?.toLowerCase().includes(q);
      return idMatch || hallIdMatch || hallMatch || nameMatch || descMatch || createdByMatch;
    });
  }, [records, searchTerm]);

  const totalAmenities = count;
  const uniqueHalls = new Set(records.map((a) => a.hall?.id ?? a.hall)).size;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingAmenity(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (amenity) => {
    setEditingAmenity(amenity);
    setForm({
      hall: amenity.hall?.id ?? amenity.hall ?? '',
      name_en: amenity.name_en || '',
      name_ar: amenity.name_ar || '',
      description_en: amenity.description_en || '',
      description_ar: amenity.description_ar || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const saveAmenity = async (e) => {
    e.preventDefault();
    if (!form.hall || !form.name_en.trim()) {
      toast.error('Hall and amenity name are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        hall: form.hall,
        name_en: form.name_en,
        name_ar: form.name_ar,
        description_en: form.description_en,
        description_ar: form.description_ar,
      };

      if (editingAmenity) {
        await AxiosInstance.patch(`/api/hotel/v1/hall/amenity/?id=${editingAmenity.id}`, payload);
        toast.success('Amenity updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/hall/amenity/', payload);
        toast.success('Amenity added successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchAmenities();
    } catch (error) {
      console.error('Error saving amenity:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving amenity';
      toast.error(typeof msg === 'string' ? msg : 'Error saving amenity');
    } finally {
      setSaving(false);
    }
  };

  const deleteAmenity = async (amenity) => {
    if (!window.confirm(`Remove this amenity? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/hall/amenity/?id=${amenity.id}`);
      if (res) {
        toast.success('Amenity deleted successfully');
        setCurrentPage(1);
        fetchAmenities();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting amenity');
    }
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="ha-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="ha-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Facility Management
            </div>
            <h1 className="ha-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Hall Amenities
            </h1>
          </div>

          <div className="ha-header-actions" style={{ display: 'flex' }}>
            {permissions.create_hall_amenity && (
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
              Add Amenity
            </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="ha-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Amenities', value: totalAmenities, icon: CheckCircle },
            { label: 'Halls with Amenities', value: uniqueHalls, icon: MapPin, accent: goldDeep },
          ].map(({ label, value, icon: Icon, accent }) => (
            <div key={label} style={{
              background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 16,
              padding: '18px 20px', boxShadow: shadowCard,
            }}>
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
              placeholder="Search by ID, hall, amenity name, or description…"
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
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading amenities…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="ha-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="ha-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Hall ID', 'Hall', 'Amenity Name', 'Description', 'Created By', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 6 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((a, idx) => (
                    <tr
                      key={a.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{a.id}
                      </td>
                      <td data-label="Hall ID" style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                          background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          fontWeight: 600,
                        }}>{a.hall?.id ?? a.hall ?? '—'}</span>
                      </td>
                      <td data-label="Hall" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        {a.hall_name_en || a.hall?.name_en || '—'}
                      </td>
                      <td data-label="Amenity Name" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        <div>{a.name_en || '—'}</div>
                        {a.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{a.name_ar}</div>}
                      </td>
                      <td data-label="Description" style={{ padding: '14px 18px', fontSize: 12.5, color: '#A39C8A', maxWidth: 300 }}>
                        {a.description_en || a.description_ar || '—'}
                      </td>
                      <td data-label="Created By" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {a.created_by_name || '—'}
                      </td>
                      <td data-label="" className="ha-empty-label" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {permissions.update_hall_amenity && (
                            <button
                              onClick={() => openEdit(a)}
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
                          {permissions.delete_hall_amenity && (
                            <button
                              onClick={() => deleteAmenity(a)}
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
              <div className="ha-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} amenit{count !== 1 ? 'ies' : 'y'}
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
              <CheckCircle size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No amenities found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Add your first amenity to get started'}
            </p>
            {permissions.create_hall_amenity && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                Add Amenity
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingAmenity ? 'Update Amenity' : 'Add Amenity'}
          subtitle={editingAmenity ? `Editing amenity for ${editingAmenity.hall_name_en || editingAmenity.hall?.name_en}` : 'Add a new amenity to a hall'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveAmenity}>
            <FormGroup label="Hall" required>
              <select
                style={inputStyle}
                value={form.hall}
                onChange={(e) => setForm({ ...form, hall: e.target.value })}
              >
                <option value="">Select Hall</option>
                {halls.map((h) => (
                  <option key={h.id} value={h.id}>{h.name_en}</option>
                ))}
              </select>
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Amenity Name (English)" required>
                <TextField
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  placeholder="WiFi"
                />
              </FormGroup>
              <FormGroup label="Amenity Name (Arabic)">
                <TextField
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  placeholder="واي فاي"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <FormGroup label="Description (English)">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 80,
                  resize: 'vertical',
                }}
                value={form.description_en}
                onChange={(e) => setForm({ ...form, description_en: e.target.value })}
                placeholder="High-speed internet access..."
              />
            </FormGroup>

            <FormGroup label="Description (Arabic)">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 80,
                  resize: 'vertical',
                }}
                value={form.description_ar}
                onChange={(e) => setForm({ ...form, description_ar: e.target.value })}
                placeholder="وصول عالي السرعة للإنترنت..."
                dir="rtl"
              />
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
              {saving ? 'Saving…' : editingAmenity ? 'Save Changes' : 'Add Amenity'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default HallAmenitiesCom;