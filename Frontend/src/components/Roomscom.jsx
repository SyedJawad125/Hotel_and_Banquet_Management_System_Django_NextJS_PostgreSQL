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
  LayoutGrid, Table2, Download, MapPin, CalendarDays, CheckCircle2, Building2,
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
    .rm-container { padding: 65px 14px 40px !important; width: 100% !important; max-width: 100% !important; }
    .rm-header { flex-direction: column !important; align-items: flex-start !important; }
    .rm-title { font-size: 28px !important; }
    .rm-header-actions { width: 100% !important; }
    .rm-header-actions button { flex: 1 1 auto !important; justify-content: center !important; }

    .rm-stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 10px !important; }

    .rm-searchbar-row { flex-direction: column !important; }
    .rm-viewtoggle { width: 100% !important; }
    .rm-viewtoggle button { flex: 1 1 50% !important; justify-content: center !important; }

    /* Outer table panel turns ivory so the white row-cards stand out against it */
    .rm-table-wrap { background: #F6F3EC !important; border: none !important; box-shadow: none !important; }

    /* Responsive table: hide header row, stack each cell as a labeled block */
    .rm-table thead { display: none !important; }
    .rm-table, .rm-table tbody, .rm-table tr, .rm-table td {
      display: block !important; width: 100% !important;
    }
    .rm-table { min-width: 0 !important; }
    .rm-table tr {
      border: 1px solid rgba(198,164,63,0.12) !important;
      border-radius: 14px !important;
      margin-bottom: 14px !important;
      padding: 12px 14px !important;
      background: #FFFFFF !important;
      box-shadow: 0 4px 14px -8px rgba(38,35,29,0.18) !important;
    }
    .rm-table td {
      padding: 8px 0 !important;
      border-bottom: none !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 10px !important;
      text-align: right !important;
    }
    .rm-table td::before {
      content: attr(data-label);
      font-size: 10.5px;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: #8A8270;
      font-weight: 700;
      text-align: left;
      flex-shrink: 0;
    }
    .rm-table td[data-label=Room] { align-items: flex-start !important; }
    .rm-table td[data-label=Room] .rm-room-col { justify-content: flex-end !important; text-align: right !important; }
    .rm-table td[data-label] { justify-content: flex-end !important; }
    .rm-table td[data-label]::before { display: none !important; }

    /* Pagination bar inside the (now transparent) table wrap */
    .rm-pagination { background: #FFFFFF !important; border: 1px solid rgba(198,164,63,0.12) !important; border-radius: 14px !important; }
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
      value={value || ''}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

/* Renders up to 2 upcoming non-cancelled bookings for a room.
   Backend computes this live (see Room.get_upcoming_bookings),
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

const RoomsCom = () => {
  const { permissions = {} } = useContext(AuthContext);

  const [records, setRecords] = useState([]);
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(count / recordsPerPage));

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // occupied / occupied_dates are computed live on the backend from actual
  // room bookings (Room.is_occupied_today / get_upcoming_bookings), so
  // it's not something a user sets manually here.
  const emptyForm = {
    name_en: '', name_ar: '', code_name: '', capacity: '', capacity_count: '', badge: '',
  };
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get('/api/hotel/v1/room/', {
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
        toast.error('Could not load rooms');
      }
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  };


  const filteredRecords = useMemo(() => {
    if (!Array.isArray(records)) return [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) => {
      const idMatch = r.id?.toString() === q;
      const nameMatch = `${r.name_en || ''} ${r.name_ar || ''}`.toLowerCase().includes(q);
      const codeMatch = r.code_name?.toLowerCase().includes(q);
      const badgeMatch = r.badge?.toLowerCase().includes(q);
      return idMatch || nameMatch || codeMatch || badgeMatch;
    });
  }, [records, searchTerm]);

  const totalRooms = count;
  const occupiedCount = records.filter((r) => r.occupied).length;
  const availableCount = records.filter((r) => !r.occupied).length;
  const totalBookings = records.reduce((sum, r) => sum + (r.booking_count || 0), 0);

  /* ── Modal handlers ── */

  const openCreate = () => {
    setEditingRoom(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (room) => {
    setEditingRoom(room);
    setForm({
      name_en: room.name_en || '',
      name_ar: room.name_ar || '',
      code_name: room.code_name || '',
      capacity: room.capacity || '',
      capacity_count: room.capacity_count ?? '',
      badge: room.badge || '',
    });
    setImageFile(null);
    setImagePreview(room.image || null);
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

  const saveRoom = async (e) => {
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

      if (editingRoom) {
        await AxiosInstance.patch(`/api/hotel/v1/room/?id=${editingRoom.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room updated successfully');
      } else {
        await AxiosInstance.post('/api/hotel/v1/room/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Room created successfully');
      }
      setModalOpen(false);
      setCurrentPage(1);
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      const msg = error?.response?.data?.message || error?.response?.data?.data || 'Error saving room';
      toast.error(typeof msg === 'string' ? msg : 'Error saving room');
    } finally {
      setSaving(false);
    }
  };

  const deleteRoom = async (room) => {
    if (!window.confirm(`Remove "${room.name_en}"? This cannot be undone.`)) return;
    try {
      const res = await AxiosInstance.delete(`/api/hotel/v1/room/?id=${room.id}`);
      if (res) {
        toast.success('Room deleted successfully');
        setCurrentPage(1);
        fetchRooms();
      }
    } catch (error) {
      const msg = error?.response?.data?.message;
      toast.error(typeof msg === 'string' ? msg : 'This room has active bookings and cannot be deleted');
    }
  };

  const exportCSV = () => {
    if (!filteredRecords.length) {
      toast.error('No rooms to export');
      return;
    }
    const headers = ['ID', 'Name (EN)', 'Name (AR)', 'Code Name', 'Capacity', 'Capacity Count', 'Badge', 'Status', 'Upcoming Dates', 'Booking Count'];
    const escape = (val) => {
      const s = val === null || val === undefined ? '' : String(val);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const formatUpcoming = (r) =>
      (r.upcoming_occupied_dates || [])
        .map((b) => `${b.date} (${b.time_slot_display})`)
        .join(' | ');
    const rows = filteredRecords.map((r) => [
      r.id, r.name_en, r.name_ar, r.code_name, r.capacity, r.capacity_count,
      r.badge, r.occupied ? 'Occupied' : 'Available', formatUpcoming(r), r.booking_count ?? 0,
    ]);
    const csv = [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.download = `rooms-export-${stamp}.csv`;
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

      <div className="rm-container" style={{ maxWidth: 1280, margin: '0 auto', padding: '36px 28px 60px' }}>

        {/* Header */}
        <div className="rm-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 18, marginBottom: 30 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, fontWeight: 700, marginBottom: 8 }}>
              Venue Management
            </div>
            <h1 className="rm-title" style={{ fontFamily: displayFont, fontSize: 38, color: ink, fontWeight: 600, lineHeight: 1.1 }}>
              Rooms
            </h1>
          </div>

          <div className="rm-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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

            {permissions.create_room && (
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
                New Room
              </button>
            )}
          </div>
        </div>

        {/* Stat strip */}
        <div className="rm-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 26 }}>
          {[
            { label: 'Total Rooms', value: totalRooms, icon: DoorOpen },
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
        <div className="rm-searchbar-row" style={{ display: 'flex', gap: 12, marginBottom: 22, flexWrap: 'wrap' }}>
          <div style={{
            flex: '1 1 280px',
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 14,
            padding: 14, boxShadow: shadowCard,
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={17} color="#A39C8A" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
              {/* <input
                type="text"
                placeholder="Search by name, code, badge, or hall…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                style={{
                  width: '100%', padding: '11px 14px 11px 42px', background: ivory,
                  border: `1px solid ${line}`, borderRadius: 10, fontSize: 13.5,
                  color: ink, outline: 'none', boxSizing: 'border-box', fontFamily: bodyFont,
                }}
              /> */}
            </div>
          </div>

          <div className="rm-viewtoggle" style={{
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
              borderRadius: '50%', animation: 'rm-spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes rm-spin { to { transform: rotate(360deg); } }`}</style>
            <p style={{ marginTop: 16, color: '#A39C8A', fontSize: 13 }}>Loading rooms…</p>
          </div>
        )}

        {/* Table or Cards */}
        {!loading && filteredRecords.length > 0 && viewMode === 'table' && (
          <div className="rm-table-wrap" style={{
            background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 18,
            overflow: 'hidden', boxShadow: shadowCard,
          }}>
              <div style={{ overflowX: 'auto' }}>
                <table className="rm-table" style={{ width: '100%', borderCollapse: 'collapse', minWidth: 940 }}>
                  <thead>
                    <tr style={{ background: ivory, borderBottom: `1px solid ${line}` }}>
                      {['ID', 'Room', 'Code', 'Capacity', 'Badge', 'Status', 'Bookings', ''].map((h, i) => (
                        <th key={i} style={{
                          textAlign: i === 7 ? 'right' : 'left', padding: '14px 18px',
                          fontSize: 10.5, letterSpacing: '0.08em', textTransform: 'uppercase',
                          color: '#8A8270', fontWeight: 700,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((r, idx) => (
                      <tr
                        key={r.id}
                        style={{
                          borderBottom: idx === filteredRecords.length - 1 ? 'none' : `1px solid ${lineSoft}`,
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#FCFAF4'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                      <td data-label="ID" style={{ padding: '14px 18px', fontSize: 13, color: '#8A8270', fontWeight: 500 }}>
                        #{r.id}
                      </td>
                        <td data-label="Room" style={{ padding: '14px 18px' }}>
                          <div className="rm-room-col" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {r.image ? (
                              <img
                                src={r.image}
                                alt={r.name_en}
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
                              <div style={{ fontFamily: displayFont, fontSize: 17, fontWeight: 600, color: ink }}>{r.name_en}</div>
                              {r.name_ar && <div style={{ fontSize: 12, color: '#A39C8A' }}>{r.name_ar}</div>}
                            </div>
                          </div>
                        </td>
                        <td data-label="Code" style={{ padding: '14px 18px' }}>
                          <span style={{
                            fontSize: 11.5, fontFamily: 'monospace', color: '#8A8270',
                            background: ivory, border: `1px solid ${lineSoft}`, borderRadius: 6, padding: '3px 8px',
                          }}>{r.code_name}</span>
                        </td>
                        <td data-label="Capacity" style={{ padding: '14px 18px', fontSize: 13.5, color: ink }}>{r.capacity}</td>
                        <td data-label="Badge" style={{ padding: '14px 18px' }}>
                          {r.badge ? (
                            <span style={{
                              fontSize: 11.5, color: goldDeep, background: 'rgba(198,164,63,0.12)',
                              border: `1px solid ${line}`, borderRadius: 999, padding: '4px 11px', fontWeight: 600,
                            }}>{r.badge}</span>
                          ) : <span style={{ color: '#C8C0AC', fontSize: 13 }}>—</span>}
                        </td>
                        <td data-label="Status" style={{ padding: '14px 18px' }}>
                          <StatusPill occupied={r.occupied} />
                          <div style={{ marginTop: 6 }}>
                            <UpcomingDates bookings={r.upcoming_occupied_dates} />
                          </div>
                        </td>
                        <td data-label="Bookings" style={{ padding: '14px 18px', fontSize: 13.5, color: ink, fontWeight: 600 }}>{r.booking_count ?? 0}</td>
                        <td data-label="" style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                            {permissions.update_room && (
                              <button
                                onClick={() => openEdit(r)}
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
                            {permissions.delete_room && (
                              <button
                                onClick={() => deleteRoom(r)}
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
                <div className="rm-pagination" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px', borderTop: `1px solid ${lineSoft}`, background: ivory,
                }}>
                  <span style={{ fontSize: 12, color: '#A39C8A' }}>
                    Page {currentPage} of {totalPages} · {count} room{count !== 1 ? 's' : ''}
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
              {filteredRecords.map((r) => (
                <div
                  key={r.id}
                  style={{
                    background: '#FFFFFF', border: `1px solid ${line}`, borderRadius: 20,
                    padding: 20, boxShadow: shadowCard, transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = line; e.currentTarget.style.transform = ''; }}
                >
                  <StatusPill occupied={r.occupied} />

                  <div style={{ fontFamily: displayFont, fontSize: 15, color: gold, marginTop: 4, marginBottom: 2 }}>
                    {r.name_en}
                  </div>
                  {r.name_ar && (
                    <div style={{ fontSize: 21, fontWeight: 700, color: ink, marginBottom: 8 }}>{r.name_ar}</div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: '#A39C8A', marginBottom: 10 }}>
                    <MapPin size={13} color={gold} />
                    {r.capacity}
                  </div>

                  {r.badge && (
                    <div style={{
                      display: 'inline-block', background: 'rgba(198,164,63,0.14)',
                      padding: '4px 13px', borderRadius: 999, fontSize: 11.5, color: goldDeep,
                      fontWeight: 600, marginBottom: 10,
                    }}>
                      {r.badge}
                    </div>
                  )}

                  <div style={{
                    display: 'flex', flexDirection: 'column', gap: 6,
                    background: r.occupied ? '#FBEAEA' : '#EAF4EA',
                    padding: '10px 12px', borderRadius: 12, fontSize: 12.5, margin: '10px 0',
                    color: r.occupied ? '#B23B3B' : '#3D7A45', fontWeight: 600,
                  }}>
                    {r.upcoming_occupied_dates && r.upcoming_occupied_dates.length > 0 ? (
                      r.upcoming_occupied_dates.map((b, i) => (
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
                    {permissions.update_room && (
                      <button
                        onClick={() => openEdit(r)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: 'transparent', color: goldDeep, border: `1px solid ${line}`,
                          borderRadius: 10, padding: '7px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        }}
                      >
                        <Pencil size={12} /> Update
                      </button>
                    )}
                    {permissions.delete_room && (
                      <button
                        onClick={() => deleteRoom(r)}
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
                  Page {currentPage} of {totalPages} · {count} room{count !== 1 ? 's' : ''}
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
              <h3 style={{ fontFamily: displayFont, fontSize: 21, color: ink, marginBottom: 6 }}>No rooms found</h3>
              <p style={{ color: '#A39C8A', fontSize: 13.5, marginBottom: 22 }}>
                {searchTerm ? 'Try a different search term' : 'Add your first room to get started'}
              </p>
              {permissions.create_room && !searchTerm && (
                <button
                  onClick={openCreate}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: ink, color: '#FBF6E8', border: 'none',
                    padding: '12px 22px', borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  <Plus size={16} color={gold} />
                  New Room
                </button>
              )}
            </div>
        )}
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <Modal
          title={editingRoom ? 'Update Room' : 'New Room'}
          subtitle={editingRoom ? `Editing "${editingRoom.name_en}"` : 'Add a room'}
          onClose={closeModal}
          wide
        >
          <form onSubmit={saveRoom}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Name (English)" required>
                <TextField
                  value={form.name_en}
                  onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                  placeholder="Meeting Room A"
                />
              </FormGroup>
              <FormGroup label="Name (Arabic)">
                <TextField
                  value={form.name_ar}
                  onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                  placeholder="غرفة الاجتماعات"
                  dir="rtl"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Code Name" required hint="Unique identifier, e.g. MR-A">
                <TextField
                  value={form.code_name}
                  onChange={(e) => setForm({ ...form, code_name: e.target.value })}
                  placeholder="MR-A"
                />
              </FormGroup>
              <FormGroup label="Badge">
                <TextField
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="Quiet Room"
                />
              </FormGroup>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <FormGroup label="Capacity" required hint='Display text, e.g. "7 Guests"'>
                <TextField
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="7 Guests"
                />
              </FormGroup>
              <FormGroup label="Capacity (count)" hint="Numeric value, max 7 guests">
                <TextField
                  type="number"
                  min="0"
                  max="7"
                  value={form.capacity_count}
                  onChange={(e) => setForm({ ...form, capacity_count: e.target.value })}
                  placeholder="7"
                />
              </FormGroup>
            </div>

            {/* Status / Occupied Dates fields removed — occupancy is now computed
                live from RoomBooking records on the backend and is read-only here.
                To change a room's status, create/cancel a room booking instead. */}
            {editingRoom && (
              <FormGroup label="Current Status" hint="Computed from active bookings — create or cancel a room booking to change this">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <StatusPill occupied={!!editingRoom.occupied} />
                  <UpcomingDates bookings={editingRoom.upcoming_occupied_dates} size={12} />
                </div>
              </FormGroup>
            )}

            <FormGroup label="Room Image">
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
              {saving ? 'Saving…' : editingRoom ? 'Save Changes' : 'Create Room'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default RoomsCom;