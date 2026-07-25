'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, DollarSign, Calendar,
  ChevronLeft, ChevronRight, Package, FileText,
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
    .bs-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .bs-header { flex-direction: column !important; align-items: flex-start !important; }
    .bs-title { font-size: 28px !important; }
    .bs-header-actions { width: 100% !important; }
    .bs-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .bs-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .bs-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .bs-table thead { display: none !important; }
    .bs-table, .bs-table tbody, .bs-table tr, .bs-table td {
      display: block !important; width: 100% !important;
    }
    .bs-table { min-width: 0 !important; }
    .bs-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .bs-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .bs-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .bs-table td.bs-empty-label { justify-content: flex-end !important; }
    .bs-table td.bs-empty-label::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .bs-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
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

const BookingServicesCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [saving, setSaving] = useState(false);

  const [bookings, setBookings] = useState([]);

  const emptyForm = {
    booking: '', service_name_en: '', service_name_ar: '', cost: '', notes: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchServices();
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/booking/service/', {
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
        toast.error('Could not load services');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching services');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/booking/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((s) => {
      const idMatch = s.id?.toString() === q;
      const bookingMatch = s.booking?.booking_code?.toLowerCase().includes(q);
      const nameMatch = `${s.service_name_en || ''} ${s.service_name_ar || ''}`.toLowerCase().includes(q);
      const costMatch = s.cost?.toString().includes(q);
      return idMatch || bookingMatch || nameMatch || costMatch;
    });
  }, [records, searchTerm]);

  const totalServices = count;
  const totalCost = records.reduce((sum, s) => sum + Number(s.cost || 0), 0);
  const avgCost = records.length > 0 
    ? totalCost / records.length 
    : 0;

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingService(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (service) => {
    setEditingService(service);
    setForm({
      booking: service.booking || '',
      service_name_en: service.service_name_en || '',
      service_name_ar: service.service_name_ar || '',
      cost: service.cost || '',
      notes: service.notes || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
  };

  const saveService = async (e) => {
    e.preventDefault();
    if (!form.booking || !form.service_name_en.trim() || !form.cost) {
      toast.error('Booking, service name, and cost are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        booking: form.booking,
        service_name_en: form.service_name_en,
        service_name_ar: form.service_name_ar,
        cost: form.cost,
        notes: form.notes,
      };

      if (editingService) {
        await AxiosInstance.patch(`/api/hotel/v1/booking/service/?id=${editingService.id}`, payload);
        toast.success('Service updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/booking/service/', payload);
        toast.success('Service added successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving service';
      toast.error(typeof msg === 'string' ? msg : 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (service) => {
    if (!window.confirm(`Remove this service? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/booking/service/?id=${service.id}`);
      if (res) {
        toast.success('Service deleted successfully');
        setCurrentPage(1);
        fetchServices();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting service');
    }
  };

  /* ── Render ── */

  return (
    <div style={{ width: '100%', minHeight: '100%', background: '#F6F3EC', fontFamily: bodyFont }}>
      <style>{responsiveStyles}</style>
      <ToastContainer position="top-right" autoClose={3000} theme="light" className="mt-16" />

      <div className="bs-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="bs-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Service Management
            </div>
            <h1 className="bs-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Booking Services
            </h1>
          </div>

          <div className="bs-header-actions" style={{ display: 'flex' }}>
            {permissions.create_booking_service && (
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
              Add Service
            </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="bs-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Services', value: totalServices, icon: Package },
            { label: 'Total Cost', value: `SAR ${totalCost.toLocaleString()}`, icon: DollarSign, accent: goldDeep },
            { label: 'Avg Cost', value: `SAR ${avgCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, icon: FileText, accent: '#3D7A45' },
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
              placeholder="Search by booking, service name, or cost…"
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
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading services…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="bs-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="bs-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Booking ID', 'Booking Code', 'Service Name', 'Cost', 'Notes', 'Created By', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 7 ? 'right' : 'left', padding: '14px 18px',
                        fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                        color: '#8A8270', fontWeight: 700,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((s, idx) => (
                    <tr
                      key={s.id}
                      style={{
                        borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{s.id}
                      </td>
                      <td data-label="Booking ID" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {s.booking || '—'}
                      </td>
                      <td data-label="Booking Code" style={{ padding: '14px 18px' }}>
                        <span style={{
                          fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                          background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          fontWeight: 600,
                        }}>{s.booking_code || '—'}</span>
                      </td>
                      <td data-label="Service Name" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        <div>{s.service_name_en || '—'}</div>
                        {s.service_name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{s.service_name_ar}</div>}
                      </td>
                      <td data-label="Cost" style={{ padding: '14px 18px', fontSize: 13.5, color: goldDeep, fontWeight: 600 }}>
                        SAR {Number(s.cost || 0).toLocaleString()}
                      </td>
                      <td data-label="Notes" style={{ padding: '14px 18px', fontSize: 12.5, color: '#A39C8A', maxWidth: 200 }}>
                        {s.notes || '—'}
                      </td>
                      <td data-label="Created By" style={{ padding: '14px 18px', fontSize: 13, color: ink }}>
                        {s.created_by_name || '—'}
                      </td>
                      <td data-label="" className="bs-empty-label" style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          {permissions.update_booking_service && (
                            <button
                              onClick={() => openEdit(s)}
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
                          {permissions.delete_booking_service && (
                            <button
                              onClick={() => deleteService(s)}
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
              <div className="bs-pagination" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
              }}>
                <span style={{ fontSize: 12, color: '#A39C8A' }}>
                  Page {currentPage} of {totalPages} · {count} service{count !== 1 ? 's' : ''}
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
              <Package size={28} color={gold} />
            </div>
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No services found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Add your first service to get started'}
            </p>
            {permissions.create_booking_service && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                Add Service
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingService ? 'Update Service' : 'Add Service'}
          subtitle={editingService ? `Editing service for booking ${editingService.booking?.booking_code}` : 'Add a new service to a booking'}
          onClose={closeModal}
        >
          <form onSubmit={saveService}>
            <FormGroup label="Booking" required>
              <select
                style={inputStyle}
                value={form.booking}
                onChange={(e) => setForm({ ...form, booking: e.target.value })}
              >
                <option value="">Select Booking</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>{b.booking_code} - {b.event_type_en}</option>
                ))}
              </select>
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Service Name (English)" required>
                <TextField
                  value={form.service_name_en}
                  onChange={(e) => setForm({ ...form, service_name_en: e.target.value })}
                  placeholder="Catering"
                />
              </FormGroup>
              <FormGroup label="Service Name (Arabic)">
                <TextField
                  value={form.service_name_ar}
                  onChange={(e) => setForm({ ...form, service_name_ar: e.target.value })}
                  placeholder="تقديم الطعام"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <FormGroup label="Cost (SAR)" required>
              <TextField
                type="number"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="0.00"
              />
            </FormGroup>

            <FormGroup label="Notes">
              <textarea
                style={{
                  ...inputStyle,
                  minHeight: 80,
                  resize: 'vertical',
                }}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Additional notes..."
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
              {saving ? 'Saving…' : editingService ? 'Save Changes' : 'Add Service'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BookingServicesCom;
