// Mobile Responsive Version
'use client';
import React, { useEffect, useState, useContext, useMemo } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AxiosInstance from "@/components/AxiosInstance";
import { AuthContext } from '@/components/AuthContext';
import {
  Search, Plus, Pencil, Trash2, X, Calendar, Clock, DollarSign,
  ChevronLeft, ChevronRight, Download, CheckCircle, XCircle, Clock as PendingIcon,
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
    .rb-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .rb-header { flex-direction: column !important; align-items: flex-start !important; }
    .rb-title { font-size: 28px !important; }
    .rb-header-actions { width: 100% !important; }
    .rb-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .rb-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }
    .rb-stat-value { font-size: 20px !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .rb-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; padding: 0 !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .rb-table thead { display: none !important; }
    .rb-table, .rb-table tbody, .rb-table tr, .rb-table td {
      display: block !important; width: 100% !important;
    }
    .rb-table { min-width: 0 !important; }
    .rb-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .rb-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .rb-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .rb-table td[data-label='Date & Time'] { align-items: flex-start !important; }
    .rb-table td[data-label='Date & Time'] .rb-datetime-col { align-items: flex-end !important; }
    .rb-table td[data-label=''] { justify-content: flex-end !important; }
    .rb-table td[data-label='']::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .rb-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
  }
`;

/* ── Small building blocks ───────────────────────────────────────────── */

const StatusPill = ({ status }) => {
  const config = {
    confirmed: { bg: '#EAF4EA', color: '#3D7A45', border: 'rgba(61,122,69,0.18)', icon: CheckCircle },
    pending: { bg: '#FEF7E6', color: '#B8860B', border: 'rgba(184,134,11,0.18)', icon: PendingIcon },
    cancelled: { bg: '#FBEAEA', color: '#B23B3B', border: 'rgba(178,59,59,0.18)', icon: XCircle },
    checked_in: { bg: '#E3F2FD', color: '#1976D2', border: 'rgba(25,118,210,0.18)', icon: CheckCircle },
    checked_out: { bg: '#E8EAF6', color: '#3F51B5', border: 'rgba(63,81,181,0.18)', icon: CheckCircle },
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
      {status?.replace('_', ' ') || 'Pending'}
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

const RoomBookingsCom = () => {
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

  const [rooms, setRooms] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);

  const emptyForm = {
    room: '', customer: '', booking: '', event_type_en: '', event_type_ar: '',
    check_in_date: '', check_out_date: '', status: 'pending', total: '',
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    fetchBookings();
    fetchRooms();
    fetchCustomers();
    fetchHallBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/room/booking/', {
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
        toast.error('Could not load room bookings');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching room bookings');
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/room/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setRooms(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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

  const fetchHallBookings = async () => {
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/booking/', { params: { limit: 100 } });
      const list = res?.data?.data || res?.data?.data?.data || [];
      setBookings(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Error fetching hall bookings:', error);
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
      const roomMatch = (b.room_name_en || b.room?.name_en)?.toLowerCase().includes(q);
      const customerMatch = (b.customer_name || b.customer?.name_en)?.toLowerCase().includes(q);
      return idMatch || codeMatch || eventMatch || roomMatch || customerMatch;
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
      room: booking.room || '',
      customer: booking.customer || '',
      booking: booking.booking || '',
      event_type_en: booking.event_type_en || '',
      event_type_ar: booking.event_type_ar || '',
      check_in_date: booking.check_in_date || '',
      check_out_date: booking.check_out_date || '',
      status: booking.status || 'pending',
      total: booking.total || '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setForm({ ...emptyForm });
    setEditingBooking(null);
  };

  const saveBooking = async (e) => {
    e.preventDefault();
    if (!form.room || !form.customer || !form.event_type_en.trim() || !form.check_in_date || !form.check_out_date || !form.total) {
      toast.error('Room, customer, event type, check-in date, check-out date, and total are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        room: form.room,
        customer: form.customer,
        booking: form.booking || null,
        event_type_en: form.event_type_en,
        event_type_ar: form.event_type_ar,
        check_in_date: form.check_in_date,
        check_out_date: form.check_out_date,
        status: form.status,
        total: form.total,
      };

      if (editingBooking) {
        await AxiosInstance.patch(`/api/hotel/v1/room/booking/?id=${editingBooking.id}`, payload);
        toast.success('Room booking updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/room/booking/', payload);
        toast.success('Room booking created successfully');
      }
      setModalOpen(false);
      setForm({ ...emptyForm });
      setEditingBooking(null);
      setCurrentPage(1);
      fetchBookings();
    } catch (error) {
      console.error('Error saving room booking:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving room booking';
      toast.error(typeof msg === 'string' ? msg : 'Error saving room booking');
    } finally {
      setSaving(false);
    }
  };

  const deleteBooking = async (booking) => {
    if (!window.confirm(`Remove room booking "${booking.booking_code}"? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/room/booking/?id=${booking.id}`);
      if (res) {
        toast.success('Room booking deleted successfully');
        setCurrentPage(1);
        fetchBookings();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'Error deleting room booking');
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No room bookings to export');
      return;
    }
    const headers = ['ID', 'Booking Code', 'Room', 'Customer', 'Event', 'Check-In', 'Check-Out', 'Status', 'Total'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filteredRecords.map((b) => [
      b.id, b.booking_code, b.room_name_en || b.room?.name_en, b.customer_name || b.customer?.name_en,
      b.event_type_en, b.check_in_date, b.check_out_date, b.status, b.total,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `room-bookings-export-${stamp}.csv`;
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

      <div className="rb-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="rb-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Event Management
            </div>
            <h1 className="rb-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Room Bookings
            </h1>
          </div>

          <div className="rb-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

            {permissions.create_room_booking && (
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
                New Room Booking
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="rb-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
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
              <div className="rb-stat-value" style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 600, color: accent || ink }}>{value}</div>
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
              placeholder="Search by booking code, event, room, or customer…"
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
              borderRadius: '50%', animation: 'rb-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes rb-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading room bookings…</p>
          </div>
        )}

        {/* Table */}
        {!loading && filteredRecords.length > 0 && (
          <div className="rb-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table className="rb-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1000 }}>
                <thead>
                  <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                    {['ID', 'Booking', 'Room', 'Customer', 'Parent Booking', 'Event', 'Check-In', 'Check-Out', 'Status', 'Total', ''].map((h, i) => (
                      <th key={i} style={{
                        textAlign: i === 10 ? 'right' : 'left', padding: '14px 18px',
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
                        }}>{b.booking_code || `RB${1000 + b.id}`}</span>
                      </td>
                      <td data-label="Room" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 500 }}>
                        {b.room_name_en || b.room?.name_en || '—'}
                      </td>
                      <td data-label="Customer" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {b.customer_name || b.customer?.name_en || '—'}
                      </td>
                      <td data-label="Parent Booking" style={{ padding: '14px 18px' }}>
                        {b.booking_code_parent ? (
                          <span style={{
                            fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                            background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                            fontWeight: 600,
                          }}>{b.booking_code_parent}</span>
                        ) : (
                          <span style={{ color: '#A39C8A', fontSize: 13 }}>—</span>
                        )}
                      </td>
                      <td data-label="Event" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>
                        {b.event_type_en || '—'}
                      </td>
                      <td data-label="Check-In" style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={13} color="#A39C8A" />
                          {b.check_in_date || '—'}
                        </div>
                      </td>
                      <td data-label="Check-Out" style={{ padding: '14px 18px', fontSize: 12.5, color: ink }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <Calendar size={13} color="#A39C8A" />
                          {b.check_out_date || '—'}
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
                          {permissions.update_room_booking && (
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
                          {permissions.delete_room_booking && (
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
              <div className="rb-pagination" style={{
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
            <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No room bookings found</h3>
            <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
              {searchTerm ? 'Try a different search term' : 'Create your first room booking to get started'}
            </p>
            {permissions.create_room_booking && !searchTerm && (
              <button
                onClick={openCreate}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: ink, color: '#FBF6E8', border: 'none',
                  padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                <Plus size={16} color={gold} />
                New Room Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingBooking ? 'Update Room Booking' : 'New Room Booking'}
          subtitle={editingBooking ? `Editing "${editingBooking.booking_code}"` : 'Create a new room booking'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveBooking}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Room" required>
                <select
                  style={inputStyle}
                  value={form.room || ''}
                  onChange={(e) => setForm({ ...form, room: e.target.value })}
                >
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name_en || r.name || `Room ${r.id}`}
                    </option>
                  ))}
                </select>
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
              </FormGroup>
            </div>

            <FormGroup label="Parent Hall Booking (Optional)" hint="Link to a main hall booking if this is an add-on">
              <select
                style={inputStyle}
                value={form.booking || ''}
                onChange={(e) => setForm({ ...form, booking: e.target.value })}
              >
                <option value="">No Parent Booking</option>
                {bookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.booking_code} - {b.event_type_en}
                  </option>
                ))}
              </select>
            </FormGroup>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Event Type (English)" required>
                <TextField
                  value={form.event_type_en || ''}
                  onChange={(e) => setForm({ ...form, event_type_en: e.target.value })}
                  placeholder="Meeting"
                />
              </FormGroup>
              <FormGroup label="Event Type (Arabic)">
                <TextField
                  value={form.event_type_ar || ''}
                  onChange={(e) => setForm({ ...form, event_type_ar: e.target.value })}
                  placeholder="اجتماع"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Check-In Date" required>
                <TextField
                  type="date"
                  value={form.check_in_date || ''}
                  onChange={(e) => setForm({ ...form, check_in_date: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Check-Out Date" required>
                <TextField
                  type="date"
                  value={form.check_out_date || ''}
                  onChange={(e) => setForm({ ...form, check_out_date: e.target.value })}
                />
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
                  <option value="checked_in">Checked In</option>
                  <option value="checked_out">Checked Out</option>
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
              {saving ? 'Saving…' : editingBooking ? 'Save Changes' : 'Create Room Booking'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RoomBookingsCom;